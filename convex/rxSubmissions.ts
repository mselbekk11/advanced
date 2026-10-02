import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, internalQuery, mutation } from './_generated/server';
import { drawingProblem } from './lib/drawing';
import { rxSubmissionSchema } from './lib/rxSubmission';
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
  },
  handler: async (ctx, { drawing, ...args }) => {
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
      // deleted here; it is left orphaned for the storage cleanup (phase 6).
      if (problem) throw new ConvexError({ message: problem, issues: [] });
    }
    const id = await ctx.db.insert('rxSubmissions', {
      ...parsed.data,
      drawing,
      ownerEmailStatus: 'pending',
    });
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
