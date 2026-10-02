import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, internalQuery, mutation } from './_generated/server';
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
  },
  handler: async (ctx, args) => {
    const parsed = rxSubmissionSchema.safeParse(args);
    if (!parsed.success) {
      throw new ConvexError({
        message: 'Invalid RX submission',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    const id = await ctx.db.insert('rxSubmissions', { ...parsed.data, ownerEmailStatus: 'pending' });
    await ctx.scheduler.runAfter(0, internal.emails.sendOwnerRxEmail, { submissionId: id });
    return id;
  },
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
