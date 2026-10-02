import { internalMutation } from './_generated/server';

const HOUR = 60 * 60 * 1000;

// Uploads younger than this may still be about to be submitted.
const ORPHAN_AGE_MS = 24 * HOUR;

// Only files from this window are checked, so the sweep never has to read
// every old submission. It runs hourly (crons.ts), so each upload gets dozens
// of chances to be swept. A lab's two days of uploads fit easily in one
// mutation.
const SWEEP_WINDOW_MS = 3 * 24 * HOUR;

// Deletes uploads that no submission references: drawings and scans from
// abandoned forms, files removed before submit, and uploads the submit
// mutation rejected (a throwing mutation can't delete them itself).
export const sweepOrphanedUploads = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const files = await ctx.db.system
      .query('_storage')
      .withIndex('by_creation_time', (q) =>
        q.gte('_creationTime', now - SWEEP_WINDOW_MS).lt('_creationTime', now - ORPHAN_AGE_MS)
      )
      .collect();
    if (files.length === 0) return 0;

    // A file can only be referenced by a submission created after it.
    const submissions = await ctx.db
      .query('rxSubmissions')
      .withIndex('by_creation_time', (q) => q.gte('_creationTime', files[0]._creationTime))
      .collect();
    const referenced = new Set<string>();
    for (const s of submissions) {
      if (s.drawing) referenced.add(s.drawing);
      for (const scan of s.scans ?? []) referenced.add(scan.storageId);
    }

    let deleted = 0;
    for (const file of files) {
      if (referenced.has(file._id)) continue;
      await ctx.storage.delete(file._id);
      deleted++;
    }
    if (deleted) console.log(`Deleted ${deleted} orphaned upload(s)`);
    return deleted;
  },
});
