import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, internalQuery, mutation } from './_generated/server';
import { drawingProblem } from './lib/drawing';
import { rxSubmissionSchema } from './lib/rxSubmission';
import { MAX_SCANS } from './lib/scans';
import { vEmailStatus } from './schema';

const optional = v.optional(v.string());

export const submit = mutation({
  args: {
    first: v.string(),
    last: v.string(),
    email: v.string(),
    phone: v.string(),
    street: optional,
    city: optional,
    zip: optional,
    patient: v.string(),
    deliveryDate: optional,
    appliance: v.string(),
    position: optional,
    clasp: optional,
    spring: optional,
    color: optional,
    instructions: optional,
    drawing: v.optional(v.id('_storage')),
    scans: v.optional(v.array(v.object({ pathname: v.string(), fileName: v.string() }))),
  },
  handler: async (ctx, { drawing, scans: scanUploads = [], ...args }) => {
    const parsed = rxSubmissionSchema.safeParse(args);
    if (!parsed.success) {
      throw new ConvexError({
        message: 'Invalid RX submission',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    if (drawing) {
      const meta = await ctx.db.system.get('_storage', drawing);
      const problem = drawingProblem(meta);
      // Throwing rolls back the whole mutation, so the rejected upload can't be
      // deleted here; it is left for the orphaned-storage sweep (storage.ts).
      if (problem) throw new ConvexError({ message: problem, issues: [] });
    }
    if (scanUploads.length > MAX_SCANS) {
      throw new ConvexError({ message: `Attach at most ${MAX_SCANS} scans`, issues: [] });
    }
    if (new Set(scanUploads.map((s) => s.pathname)).size !== scanUploads.length) {
      throw new ConvexError({ message: 'The same scan was attached twice', issues: [] });
    }
    // Only accept uploads we issued a token for (see scanUploadsNode.ts) that
    // no other submission has claimed. Blob enforced type and size at upload.
    const uploads = [];
    for (const { pathname, fileName } of scanUploads) {
      const upload = await ctx.db
        .query('scanUploads')
        .withIndex('by_pathname', (q) => q.eq('pathname', pathname))
        .unique();
      if (!upload || upload.submissionId || upload.fileName !== fileName) {
        throw new ConvexError({ message: `${fileName}: upload not found`, issues: [] });
      }
      uploads.push(upload);
    }
    const id = await ctx.db.insert('rxSubmissions', {
      ...parsed.data,
      drawing,
      scans: uploads.map(({ pathname, fileName }) => ({ pathname, fileName })),
      ownerEmailStatus: 'pending',
    });
    for (const upload of uploads) await ctx.db.patch(upload._id, { submissionId: id });
    await ctx.scheduler.runAfter(0, internal.emails.sendOwnerRxEmail, { submissionId: id });
    return id;
  },
});

// Short-lived URL the browser POSTs a file to, straight into Convex storage.
export const generateUploadUrl = mutation({
  args: {},
  handler: (ctx) => ctx.storage.generateUploadUrl(),
});

export const get = internalQuery({
  args: { id: v.id('rxSubmissions') },
  handler: (ctx, { id }) => ctx.db.get(id),
});

// Records each scan's link, size and type from Blob, once it's been checked.
export const setScanDetails = internalMutation({
  args: {
    id: v.id('rxSubmissions'),
    details: v.array(
      v.object({
        pathname: v.string(),
        url: v.optional(v.string()),
        size: v.optional(v.number()),
        contentType: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { id, details }) => {
    const submission = await ctx.db.get(id);
    if (!submission?.scans) return;
    const byPath = new Map(details.map((d) => [d.pathname, d]));
    await ctx.db.patch(id, {
      scans: submission.scans.map((scan) =>
        'pathname' in scan ? { ...scan, ...byPath.get(scan.pathname) } : scan
      ),
    });
  },
});

export const setOwnerEmailStatus = internalMutation({
  args: {
    id: v.id('rxSubmissions'),
    status: vEmailStatus,
    emailId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, emailId, error }) => {
    await ctx.db.patch(id, { ownerEmailStatus: status, ownerEmailId: emailId, ownerEmailError: error });
  },
});
