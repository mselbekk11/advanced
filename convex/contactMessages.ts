import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, internalQuery, mutation } from './_generated/server';
import { contactMessageSchema } from './lib/contactMessage';
import { vEmailStatus } from './schema';

// Saves a footer contact-form message and schedules the owner email.
export const submit = mutation({
  args: {
    first: v.string(),
    last: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const parsed = contactMessageSchema.safeParse(args);
    if (!parsed.success) {
      throw new ConvexError({
        message: 'Invalid contact message',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    const id = await ctx.db.insert('contactMessages', { ...parsed.data, emailStatus: 'pending' });
    await ctx.scheduler.runAfter(0, internal.emails.sendContactEmail, { messageId: id });
    return id;
  },
});

export const get = internalQuery({
  args: { id: v.id('contactMessages') },
  handler: (ctx, { id }) => ctx.db.get(id),
});

export const setEmailStatus = internalMutation({
  args: {
    id: v.id('contactMessages'),
    status: vEmailStatus,
    emailId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, emailId, error }) => {
    await ctx.db.patch(id, { emailStatus: status, emailId, emailError: error });
  },
});
