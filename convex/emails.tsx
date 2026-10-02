'use node';

import { render } from '@react-email/render';
import { v } from 'convex/values';
import { Resend as ResendApi } from 'resend';
import ContactOwnerEmail from '../emails/ContactOwnerEmail';
import RxDoctorEmail from '../emails/RxDoctorEmail';
import RxOwnerEmail, { type EmailScan } from '../emails/RxOwnerEmail';
import { internal } from './_generated/api';
import type { Doc, Id } from './_generated/dataModel';
import { internalAction, type ActionCtx } from './_generated/server';
import { contactSubject } from './lib/contactMessage';
import { DRAWING_CID } from './lib/drawing';
import { ownerAddress, routeEmail } from './lib/emailRouting';
import { doctorRxSubject, ownerRxSubject } from './lib/rxSubmission';
import { resend } from './resend';
import { scanDetails } from './scanUploadsNode';

// Retry schedule for sends that bypass the component's queue (inline drawing).
const MANUAL_RETRY_DELAYS_MS = [30_000, 2 * 60_000, 10 * 60_000, 30 * 60_000];

type Recipient = 'owner' | 'doctor';

const args = { submissionId: v.id('rxSubmissions'), attempt: v.optional(v.number()) };

// The order email to the lab, laid out like the paper RX form, with scan
// download links. Replies go to the doctor.
export const sendOwnerRxEmail = internalAction({
  args,
  handler: (ctx, { submissionId, attempt = 0 }) =>
    sendRxEmail(ctx, submissionId, attempt, 'owner', async (submission, drawing) => ({
      to: ownerAddress(process.env),
      subject: ownerRxSubject(submission),
      replyTo: submission.email,
      html: await render(
        <RxOwnerEmail
          submission={submission}
          archImageUrl={drawing ? `cid:${DRAWING_CID}` : undefined}
          scans={await scanLinks(ctx, submission)}
        />
      ),
    })),
});

// The doctor's confirmation: an order summary, the drawing and the scan file
// names (no links). Replies go to the lab.
export const sendDoctorRxEmail = internalAction({
  args,
  handler: (ctx, { submissionId, attempt = 0 }) =>
    sendRxEmail(ctx, submissionId, attempt, 'doctor', async (submission, drawing) => ({
      to: submission.email,
      subject: doctorRxSubject(submission),
      replyTo: ownerAddress(process.env),
      html: await render(
        <RxDoctorEmail
          submission={submission}
          drawingUrl={drawing ? `cid:${DRAWING_CID}` : undefined}
          scanFileNames={(submission.scans ?? []).map((s) => s.fileName)}
        />
      ),
    })),
});

// A footer contact-form message, to the owner. Replies go to the visitor. It
// has no attachments, so it always goes through the component's queue, which
// retries failed sends.
export const sendContactEmail = internalAction({
  args: { messageId: v.id('contactMessages') },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.runQuery(internal.contactMessages.get, { id: messageId });
    if (!message) throw new Error(`Contact message ${messageId} not found`);
    try {
      const { from, to, subject } = routeEmail(process.env, {
        to: ownerAddress(process.env),
        subject: contactSubject(message),
      });
      const emailId = await resend.sendEmail(ctx, {
        from,
        to,
        subject,
        html: await render(<ContactOwnerEmail message={message} />),
        replyTo: [message.email],
        idempotencyKey: `contact:${messageId}`,
      });
      await ctx.runMutation(internal.contactMessages.setEmailStatus, { id: messageId, status: 'queued', emailId });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(internal.contactMessages.setEmailStatus, { id: messageId, status: 'failed', error });
      throw err;
    }
  },
});

// Renders one RX email and sends it through the Resend component.
//
// Without a drawing, the email goes through the component's durable queue,
// which batches, retries and tracks delivery. The queue uses Resend's batch
// API, which has no attachments, so an email with a drawing is sent with
// `sendEmailManually` and the drawing as an inline (CID) attachment; this
// retries those itself. Either way the status lands on the submission.
async function sendRxEmail(
  ctx: ActionCtx,
  submissionId: Id<'rxSubmissions'>,
  attempt: number,
  recipient: Recipient,
  build: (
    submission: Doc<'rxSubmissions'>,
    drawing: Buffer | null
  ) => Promise<{ to: string; subject: string; replyTo: string; html: string }>
) {
  const submission = await ctx.runQuery(internal.rxSubmissions.get, { id: submissionId });
  if (!submission) throw new Error(`RX submission ${submissionId} not found`);
  const setStatus = (status: Doc<'rxSubmissions'>['ownerEmailStatus'], extra: { emailId?: string; error?: string }) =>
    ctx.runMutation(internal.rxSubmissions.setEmailStatus, { id: submissionId, recipient, status, ...extra });

  try {
    const drawing = submission.drawing ? await loadDrawing(ctx, submission.drawing) : null;
    const email = await build(submission, drawing);
    const { from, to, subject } = routeEmail(process.env, email);
    const { html, replyTo } = email;
    const idempotencyKey = `${recipient}-rx:${submissionId}`;

    const emailId = drawing
      ? await resend.sendEmailManually(ctx, { from, to, subject, replyTo: [replyTo] }, async () => {
          const { data, error } = await resendApi().emails.send(
            {
              from,
              to,
              subject,
              html,
              replyTo,
              attachments: [
                { filename: 'rx-drawing.png', content: drawing, contentType: 'image/png', contentId: DRAWING_CID },
              ],
            },
            { idempotencyKey }
          );
          if (error) throw new Error(`Resend: ${error.message}`);
          return data.id;
        })
      : await resend.sendEmail(ctx, { from, to, subject, html, replyTo: [replyTo], idempotencyKey });

    await setStatus(drawing ? 'sent' : 'queued', { emailId });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const retryIn = submission.drawing ? MANUAL_RETRY_DELAYS_MS[attempt] : undefined;
    if (retryIn === undefined) {
      await setStatus('failed', { error });
      throw err;
    }
    await setStatus('pending', { error: `${error} (retrying, attempt ${attempt + 1})` });
    const next = recipient === 'owner' ? internal.emails.sendOwnerRxEmail : internal.emails.sendDoctorRxEmail;
    await ctx.scheduler.runAfter(retryIn, next, { submissionId, attempt: attempt + 1 });
  }
}

async function loadDrawing(ctx: ActionCtx, id: Id<'_storage'>) {
  const blob = await ctx.storage.get(id);
  if (!blob) {
    // Fall back to the blank arch rather than failing the email.
    console.error(`Drawing ${id} is missing from storage; sending without it`);
    return null;
  }
  return Buffer.from(await blob.arrayBuffer());
}

// Looks each scan up in Vercel Blob for its download link and real size, and
// saves those on the submission. A scan that never finished uploading is
// listed without a link so the owner knows to ask for it.
async function scanLinks(ctx: ActionCtx, submission: Doc<'rxSubmissions'>) {
  const links: EmailScan[] = [];
  const details = [];
  for (const scan of submission.scans ?? []) {
    if (!('pathname' in scan)) continue; // early dev rows in Convex storage
    const found = await scanDetails(scan.pathname);
    if (!found) console.error(`Scan ${scan.pathname} is missing from Blob`);
    details.push({ pathname: scan.pathname, ...found });
    links.push({ fileName: scan.fileName, size: found?.size, url: found?.url });
  }
  if (details.length) {
    await ctx.runMutation(internal.rxSubmissions.setScanDetails, { id: submission._id, details });
  }
  return links;
}

function resendApi() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new ResendApi(key);
}
