'use node';

import { render } from '@react-email/render';
import { v } from 'convex/values';
import { Resend as ResendApi } from 'resend';
import RxOwnerEmail from '../emails/RxOwnerEmail';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { internalAction, type ActionCtx } from './_generated/server';
import { DRAWING_CID } from './lib/drawing';
import { ownerAddress, routeEmail } from './lib/emailRouting';
import { ownerRxSubject } from './lib/rxSubmission';
import { resend } from './resend';

// Retry schedule for sends that bypass the component's queue (inline drawing).
const MANUAL_RETRY_DELAYS_MS = [30_000, 2 * 60_000, 10 * 60_000, 30 * 60_000];

// Renders the owner email and sends it through the Resend component.
//
// Without a drawing, the email goes through the component's durable queue,
// which batches, retries and tracks delivery. The queue uses Resend's batch
// API, which has no attachments, so an email with a drawing is sent with
// `sendEmailManually` and the drawing as an inline (CID) attachment; this
// action retries those itself. Either way the status lands on the submission.
export const sendOwnerRxEmail = internalAction({
  args: { submissionId: v.id('rxSubmissions'), attempt: v.optional(v.number()) },
  handler: async (ctx, { submissionId, attempt = 0 }) => {
    const submission = await ctx.runQuery(internal.rxSubmissions.get, { id: submissionId });
    if (!submission) throw new Error(`RX submission ${submissionId} not found`);

    try {
      const { from, to, subject } = routeEmail(process.env, {
        to: ownerAddress(process.env),
        subject: ownerRxSubject(submission),
      });
      const drawing = submission.drawing ? await loadDrawing(ctx, submission.drawing) : null;
      const html = await render(
        <RxOwnerEmail
          submission={submission}
          archImageUrl={drawing ? `cid:${DRAWING_CID}` : undefined}
        />
      );
      const idempotencyKey = `owner-rx:${submissionId}`;

      const emailId = drawing
        ? await resend.sendEmailManually(
            ctx,
            { from, to, subject, replyTo: [submission.email] },
            async () => {
              const { data, error } = await resendApi().emails.send(
                {
                  from,
                  to,
                  subject,
                  html,
                  replyTo: submission.email,
                  attachments: [
                    { filename: 'rx-drawing.png', content: drawing, contentType: 'image/png', contentId: DRAWING_CID },
                  ],
                },
                { idempotencyKey }
              );
              if (error) throw new Error(`Resend: ${error.message}`);
              return data.id;
            }
          )
        : await resend.sendEmail(ctx, {
            from,
            to,
            subject,
            html,
            replyTo: [submission.email],
            idempotencyKey,
          });

      await ctx.runMutation(internal.rxSubmissions.setOwnerEmailStatus, {
        id: submissionId,
        status: drawing ? 'sent' : 'queued',
        emailId,
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      const retryIn = submission.drawing ? MANUAL_RETRY_DELAYS_MS[attempt] : undefined;
      await ctx.runMutation(internal.rxSubmissions.setOwnerEmailStatus, {
        id: submissionId,
        status: retryIn === undefined ? 'failed' : 'pending',
        error: retryIn === undefined ? error : `${error} (retrying, attempt ${attempt + 1})`,
      });
      if (retryIn !== undefined) {
        await ctx.scheduler.runAfter(retryIn, internal.emails.sendOwnerRxEmail, {
          submissionId,
          attempt: attempt + 1,
        });
        return;
      }
      throw err;
    }
  },
});

async function loadDrawing(ctx: ActionCtx, id: Id<'_storage'>) {
  const blob = await ctx.storage.get(id);
  if (!blob) {
    // Fall back to the blank arch rather than failing the order email.
    console.error(`Drawing ${id} is missing from storage; sending the blank arch`);
    return null;
  }
  return Buffer.from(await blob.arrayBuffer());
}

function resendApi() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new ResendApi(key);
}
