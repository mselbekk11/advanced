'use node';

import { BlobNotFoundError, del, head } from '@vercel/blob';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';
import { ConvexError, v } from 'convex/values';
import { randomUUID } from 'node:crypto';
import { internal } from './_generated/api';
import { action, internalAction } from './_generated/server';
import {
  MAX_SCAN_BYTES,
  SCAN_UPLOAD_WINDOW_MS,
  scanContentType,
  scanFileProblem,
  scanPathname,
} from './lib/scans';

// Issues a client token the browser uses to upload one scan straight to
// Vercel Blob. Blob enforces the token's limits: this exact pathname, the
// content type for the file's extension, and at most 250 MB.
export const createScanUpload = action({
  args: { fileName: v.string(), size: v.number() },
  handler: async (ctx, { fileName, size }) => {
    const problem = scanFileProblem({ name: fileName, size });
    if (problem) throw new ConvexError({ message: problem, issues: [] });

    const pathname = scanPathname(randomUUID(), fileName);
    const token = await generateClientTokenFromReadWriteToken({
      token: blobToken(),
      pathname,
      allowedContentTypes: [scanContentType(fileName)!],
      maximumSizeInBytes: MAX_SCAN_BYTES,
      addRandomSuffix: false,
      validUntil: Date.now() + SCAN_UPLOAD_WINDOW_MS,
    });
    await ctx.runMutation(internal.scanUploads.record, { pathname, fileName });
    return { pathname, token };
  },
});

// Size, type and link of an uploaded scan, or null if it never arrived.
export async function scanDetails(pathname: string) {
  try {
    const blob = await head(pathname, { token: blobToken() });
    return { url: blob.downloadUrl, size: blob.size, contentType: blob.contentType };
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

// Deletes scans that were uploaded (or started) but never submitted:
// removed files, retried uploads and abandoned forms. Runs hourly.
export const sweepOrphanedScans = internalAction({
  args: {},
  handler: async (ctx): Promise<number> => {
    const orphans = await ctx.runQuery(internal.scanUploads.orphans, {});
    if (orphans.length === 0) return 0;
    await del(
      orphans.map((o) => o.pathname),
      { token: blobToken() }
    );
    await ctx.runMutation(internal.scanUploads.forget, { ids: orphans.map((o) => o._id) });
    console.log(`Deleted ${orphans.length} orphaned scan upload(s)`);
    return orphans.length;
  },
});

function blobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  return token;
}
