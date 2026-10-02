import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

// Upload tokens are issued by scanUploadsNode.ts (it needs the Blob SDK).

export const record = internalMutation({
  args: { pathname: v.string(), fileName: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('scanUploads', args);
  },
});

// Uploads older than this that no submission claimed are deleted.
const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000;

export const orphans = internalQuery({
  args: {},
  handler: (ctx) =>
    ctx.db
      .query('scanUploads')
      .withIndex('by_submissionId', (q) =>
        q.eq('submissionId', undefined).lt('_creationTime', Date.now() - ORPHAN_AGE_MS)
      )
      .take(100),
});

export const forget = internalMutation({
  args: { ids: v.array(v.id('scanUploads')) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) await ctx.db.delete(id);
  },
});
