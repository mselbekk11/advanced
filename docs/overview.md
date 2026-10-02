# Advanced Ortho Lab – Project Overview

Marketing website and order-intake form for **Advanced Ortho Lab**, an orthodontic appliance laboratory in San Francisco (1108 Vicente St Ste 102, SF, CA 94116). The lab has been operating since 1982 and sells custom appliances (retainers, expanders, splints, etc.) to dentists and orthodontists. Live site: https://www.advancedortholabsf.com/

The site has two jobs:

1. **Marketing** – explain who the lab is, what appliances it makes, its digital-printing capability, and its referral list of doctors.
2. **Order and lead intake** – the **RX Form** (`/rxform`), where doctors prescribe an appliance, draw on the arch and upload scans, and a contact form in the footer. Both are saved in **Convex** and emailed through **Resend** with **React Email** templates.

There is no admin UI, no user accounts and no CMS. Marketing content is hard-coded in React components.

> This describes the `v2` branch. Production (`main`) runs the old Mailgun/Supabase version until the phase 10 cutover in `plans/rx-form-v2-plan.md`.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14.2 App Router, React 18, TypeScript |
| Styling | Tailwind CSS 3, `tailwindcss-animate` |
| UI | shadcn/ui (`components/ui/*`, on Radix) for the forms; Headless UI (mobile nav), Heroicons, Lucide |
| Forms | react-hook-form + zod (`@hookform/resolvers`) |
| Toasts | Sonner (`components/ui/sonner.tsx`, mounted in `app/layout.tsx`) |
| Backend / database | Convex (mutations, actions, crons, file storage for drawings) |
| Scan storage | Vercel Blob (public store; browser uploads straight to Blob) |
| Email | Resend via the Convex Resend component (`@convex-dev/resend`), templates in React Email |
| Drawing | `react-sketch-canvas` |
| Tests | Vitest |
| Analytics | Vercel Analytics + Simple Analytics script |
| Hosting | Vercel, Node 24 |

Path alias: `@/*` maps to the repo root (`tsconfig.json`).

Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run email` (React Email preview server on http://localhost:3001).

---

## Directory layout

```
app/
  layout.tsx                 Root layout: ConvexClientProvider, NavbarTwo, page, FooterTwo, Sonner Toaster, Analytics
  ConvexClientProvider.tsx   Convex React client (NEXT_PUBLIC_CONVEX_URL)
  page.tsx                   Home page (/)
  about/ appliances/ digital-printing/ rxform/   One page.tsx per route
  components/
    NavbarTwo.tsx            Site nav (desktop + mobile Dialog)
    VideoOne.tsx             Hero <video> (external uploadthing URL)
    Home/                    HeroThree, Appliances teaser, DigitalPrintingThree, rxform CTA,
                             FooterTwo (address, phones and the CONTACT FORM)
    Appliances/ DigitalPrinting/ About/   Page content
    RXForm/
      rxform.tsx             The RX form (shadcn Form, paper-form callout, colour chart)
      ArchDrawing.tsx        Drawing layer over mouth.png, exported as one PNG
      ScanUpload.tsx         Multi-file .stl/.ply upload to Vercel Blob with progress

convex/
  schema.ts                  rxSubmissions, contactMessages, scanUploads
  rxSubmissions.ts           submit mutation, drawing upload URL, email status
  contactMessages.ts         submit mutation, email status
  emails.tsx                 Node actions that render and send the owner, doctor and contact emails
  resend.ts, http.ts         Resend component + webhook (/resend-webhook) for delivery status
  scanUploadsNode.ts         Blob upload tokens, scan lookups, orphaned-scan sweep
  storage.ts, crons.ts       Hourly sweeps of unclaimed drawings and scans
  lib/                       Shared, tested rules: rxOptions (option lists), rxSubmission and
                             contactMessage (zod schemas, subjects), emailRouting, drawing, scans

emails/                      React Email templates (+ tests): RxOwnerEmail, RxDoctorEmail, ContactOwnerEmail
components/ui/               shadcn primitives (button, dialog, form, input, label, progress, select, sonner, textarea)
lib/utils.ts                 cn() helper
public/                      Images, colour chart, mouth.png (arch), rx-form.pdf (paper RX form)
plans/                       v2 PRD and phased plan (with handoff notes)
```

---

## Pages

| Route | Sections |
|---|---|
| `/` | `HeroThree` → `Home/Appliances` → `DigitalPrintingThree` → `Home/rxform` CTA |
| `/appliances` | `Appliances/Appliances` – full appliance catalogue |
| `/digital-printing` | `DigitalPrinting/DigitalPrinting` – iTero lab code **26235**, 3Shape-by-email note |
| `/about` | `About/About` + `About/Referrals` |
| `/rxform` | Paper-form download callout (`/rx-form.pdf`) + the RX form |

Every page has `NavbarTwo` on top and `FooterTwo` (with the contact form) at the bottom.

---

## Data flows

### RX form

1. The doctor fills the form. Validation is the zod schema in `convex/lib/rxSubmission.ts`; option lists (appliances grouped like the paper form, positions, clasps, springs, colours) come from `convex/lib/rxOptions.ts`. Required: doctor first/last name, email, phone, patient, appliance.
2. **Scans** (optional, `.stl`/`.ply`, ≤ 250 MB each) upload from the browser straight to Vercel Blob while the form is filled in, using a client token from `scanUploadsNode.createScanUpload`. Submit is disabled while uploads are running.
3. On submit, a **drawing** (if any) is flattened onto the arch image and uploaded to Convex storage.
4. `rxSubmissions.submit` validates everything again, checks the drawing and that each scan is one of our unclaimed uploads, saves the record, and schedules two emails as separate actions:
   - **Owner email** (`RxOwnerEmail`), laid out like the paper RX form, with the drawing as an inline (CID) image and a download link per scan. Subject `New RX: <patient> — Dr. <last>`, reply-to the doctor.
   - **Doctor confirmation** (`RxDoctorEmail`): thank-you, order summary, drawing, scan file names (no links). Reply-to the lab.
5. The success toast shows only once the mutation succeeds. Each email's status is stored on the submission (`ownerEmailStatus`, `doctorEmailStatus`). Emails without a drawing go through the Resend component's queue (retries built in); emails with a drawing are sent directly (the queue can't carry attachments) and retried by `emails.tsx`.

### Contact form (footer)

`FooterTwo.tsx` → `contactMessages.submit` (zod schema `convex/lib/contactMessage.ts`) saves the message and schedules `ContactOwnerEmail` to the owner, reply-to the visitor. Status is stored in `contactMessages.emailStatus`.

### Housekeeping

Hourly crons delete drawings and Blob scans that were uploaded but never submitted (older than a day).

---

## Environment variables

**Convex deployment** (set with `npx convex env set`, per deployment):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender, e.g. `Advanced Ortho Lab RX <onboarding@resend.dev>` in staging, `rx@advancedortholabsf.com` once the domain is verified |
| `EMAIL_TO_OWNER` | The lab inbox (`advancedortholabsf@gmail.com`); receives orders and contact messages, and is the reply-to on doctor confirmations |
| `EMAIL_OVERRIDE_TO` | **Staging only.** When set, every email (owner, doctor, contact) goes to this address instead and the subject is prefixed `[STAGING]`. Never set it in production. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token, for scan upload tokens, lookups and the sweep |
| `RESEND_WEBHOOK_SECRET` | Optional; enables delivery-status updates via `/resend-webhook` |

**Next.js / Vercel**:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | The Convex deployment the browser talks to |
| `CONVEX_DEPLOYMENT` | Local only (`.env.local`, written by `npx convex dev`) |

The old Mailgun, Supabase, Prisma and Kinde variables are no longer used.

---

## External services

- **Convex** project `advanced-ortho-lab` (dev deployment used by the Preview; production deployment created at cutover).
- **Resend** – domain `advancedortholabsf.com` to be verified at cutover; until then staging sends from `onboarding@resend.dev`, which only delivers to the Resend account owner (hence `EMAIL_OVERRIDE_TO`).
- **Vercel Blob** public store for scans. Links are permanent but unguessable.
- Hero video streams from an external uploadthing URL; some decorative images are hot-linked from `i.ibb.co` and `tailwindui.com`.
- Simple Analytics and Vercel Analytics.

---

## Things to watch when editing

- Change appliance/option lists only in `convex/lib/rxOptions.ts`; the form and emails both read it. The marketing catalogue (`Appliances/Appliances.tsx`, `Home/Appliances.tsx`) is separate copy.
- Email images must be absolute URLs and not SVG (Gmail). Preview templates with `npm run email`.
- Push Convex function changes with `npx convex dev --once` (dev) – the Vercel build does not deploy Convex yet.
- Scan links and drawings are patient health information; see the HIPAA note in `plans/rx-form-v2.md`.

---

## Local development

```bash
npm install
npx convex dev          # links/creates a dev deployment and writes .env.local
npm run dev             # http://localhost:3000
npm run typecheck && npm test
npm run build && npm run start   # production check
```
