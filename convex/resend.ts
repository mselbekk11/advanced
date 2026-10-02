import { Resend, vOnEmailEventArgs } from '@convex-dev/resend';
import { components, internal } from './_generated/api';
import { internalMutation } from './_generated/server';

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  onEmailEvent: internal.resend.handleEmailEvent,
});

const statusByEvent = {
  'email.sent': 'sent',
  'email.delivered': 'delivered',
  'email.delivery_delayed': 'delivery_delayed',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.failed': 'failed',
} as const;

// Mirrors Resend webhook delivery events onto the submission's owner or
// doctor email status.
export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, { id, event }) => {
    const status = statusByEvent[event.type as keyof typeof statusByEvent];
    if (!status) return;
    const owner = await ctx.db
      .query('rxSubmissions')
      .withIndex('by_ownerEmailId', (q) => q.eq('ownerEmailId', id))
      .unique();
    if (owner) return await ctx.db.patch(owner._id, { ownerEmailStatus: status });
    const doctor = await ctx.db
      .query('rxSubmissions')
      .withIndex('by_doctorEmailId', (q) => q.eq('doctorEmailId', id))
      .unique();
    if (doctor) await ctx.db.patch(doctor._id, { doctorEmailStatus: status });
  },
});
