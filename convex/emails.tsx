'use node';

import { render } from '@react-email/render';
import { v } from 'convex/values';
import RxOwnerEmail from '../emails/RxOwnerEmail';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { ownerAddress, routeEmail } from './lib/emailRouting';
import { ownerRxSubject } from './lib/rxSubmission';
import { resend } from './resend';

// Renders the owner email and hands it to the Resend component, which queues,
// retries and tracks delivery. Failures before enqueueing are recorded on the
// submission so they're visible in the dashboard.
export const sendOwnerRxEmail = internalAction({
  args: { submissionId: v.id('rxSubmissions') },
  handler: async (ctx, { submissionId }) => {
    const submission = await ctx.runQuery(internal.rxSubmissions.get, { id: submissionId });
    if (!submission) throw new Error(`RX submission ${submissionId} not found`);

    try {
      const { from, to, subject } = routeEmail(process.env, {
        to: ownerAddress(process.env),
        subject: ownerRxSubject(submission),
      });
      const html = await render(<RxOwnerEmail submission={submission} />);
      const emailId = await resend.sendEmail(ctx, {
        from,
        to,
        subject,
        html,
        replyTo: [submission.email],
        idempotencyKey: `owner-rx:${submissionId}`,
      });
      await ctx.runMutation(internal.rxSubmissions.setOwnerEmailStatus, {
        id: submissionId,
        status: 'queued',
        emailId,
      });
    } catch (err) {
      await ctx.runMutation(internal.rxSubmissions.setOwnerEmailStatus, {
        id: submissionId,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  },
});
