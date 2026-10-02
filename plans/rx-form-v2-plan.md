# Plan: Advanced Ortho Lab v2 — RX Form, Scan Uploads, Resend + Convex

> Source PRD: `plans/rx-form-v2.md`

## Architectural decisions

These decisions apply to every phase:

- **Branching / environments:**
  - All work happens on a long-lived `v2` branch, deployed as a Vercel Preview. `main` and production stay on Mailgun/Supabase until phase 10.
  - Convex has two deployments: a dev/preview one for v2, and a production one created at cutover.
- **Routes:**
  - Public pages are unchanged: `/`, `/appliances`, `/digital-printing`, `/about` and `/rxform`.
  - The paper form is served at `/rx-form.pdf`.
  - The forms call Convex directly. The Next.js `pages/api/rxform` and `pages/api/contact` routes are retired by phase 9.
- **Schema (Convex):**
  - `rxSubmissions`:
    - Doctor: first, last, email, phone, street, city, zip.
    - Order: patient, deliveryDate, appliance, position, clasp, spring, color, instructions.
    - `drawing`: optional storage id.
    - `scans`: array of { storageId, fileName, size, contentType }.
    - `ownerEmailStatus` and `doctorEmailStatus`.
    - The record's created time.
  - `contactMessages`: first, last, email, phone, message, emailStatus, plus the created time.
- **Form model:** single-select string values for appliance, position, clasp, spring and color. This deliberately does not copy the paper form's multi-select checklist.
- **Option lists:** one shared module, with corrected spellings, defines the appliance list (grouped "Orthodontic & Pediatric" / "Splint / T.M.J."), positions, clasps, springs and colours. The form and the email templates both use it.
- **Validation:** one zod schema per form, used by the client form and mirrored in the Convex argument validators. Required RX fields are doctor first and last name, email, phone, patient and appliance.
- **File storage:**
  - Scans and drawings upload from the browser straight to Convex storage using upload URLs issued by a mutation. They never pass through Vercel.
  - Scans must be `.stl`/`.ply` and at most 250 MB each, checked in the browser and again on the server.
  - Scan links are permanent but unguessable Convex storage URLs.
- **Email:**
  - Sending:
    - Resend, through the Convex Resend component, triggered from the submit mutation.
    - Templates are built with React Email.
  - Configuration:
    - Addresses come from environment variables: `EMAIL_FROM`, `EMAIL_TO_OWNER`, and `EMAIL_OVERRIDE_TO` (staging only).
    - When `EMAIL_OVERRIDE_TO` is set, every send goes to that address and the subject gets a `[STAGING]` prefix.
    - Staging uses `onboarding@resend.dev` as the sender until the domain is verified.
  - Subject and replies:
    - Owner subject: `New RX: <patient> — Dr. <last>`.
    - Owner emails reply to the doctor or visitor. Doctor emails reply to the lab.
- **UI:**
  - shadcn on the existing Next 14 + Tailwind 3. No framework upgrade.
  - Forms use react-hook-form + zod. Toasts use Sonner.
  - Only the RX form and the contact form are restyled.

---

## Progress & handoff notes

- **Done:** Phase 1 (`6e0d66c`, Node 24 pin `6fbe8fd`), Phase 2 (`e861305`). **Next: Phase 3.**
- **Branch:** `v2` (pushed). Vercel Preview builds on push; Preview has `NEXT_PUBLIC_CONVEX_URL`. Preview is behind Vercel login protection.
- **Convex:** project `advanced-ortho-lab`, dev deployment `glad-mole-195` (https://glad-mole-195.convex.cloud). The Preview uses this dev deployment; push function changes with `npx convex dev --once` (no Convex deploy in the Vercel build yet; that's phase 10).
- **Convex env (dev):** `RESEND_API_KEY`, `EMAIL_FROM` (`Advanced Ortho Lab RX <onboarding@resend.dev>`), `EMAIL_TO_OWNER` (`advancedortholabsf@gmail.com`), `EMAIL_OVERRIDE_TO` (developer's Resend-account inbox). `RESEND_WEBHOOK_SECRET` not set (webhook optional).
- **Code map:**
  - Shared option lists: `convex/lib/rxOptions.ts`. Zod schema: `convex/lib/rxSubmission.ts`. Email routing: `convex/lib/emailRouting.ts`.
  - Submit mutation: `convex/rxSubmissions.ts`. Owner email send: `convex/emails.tsx` (Node action). Resend component plus webhook event handler: `convex/resend.ts` and `convex/http.ts`.
  - Email templates live in `emails/`. The RX form is `app/components/RXForm/rxform.tsx`.
- **Gotchas:**
  - Run vitest via `npm test`; it uses oxc automatic JSX (`vitest.config.mts`).
  - Add shadcn components with `npx -y shadcn@2.3.0 add <name> -y </dev/null` (Tailwind 3; the CLI hangs without `</dev/null`).
  - The delivery date uses a native `<input type="date">` rather than shadcn Calendar; react-day-picker v10 is incompatible with shadcn 2.3.0.
  - Production Vercel project setting is still Node 20.x; `package.json` engines pins 24.x on `v2`.
  - The local Vercel CLI is logged into a different account than the project owner (`mselbekk11s-projects`), so build logs must come from the user.
  - **Phase 5:** the Resend component's `sendEmail` uses the batch API, which has **no attachments**. Inline CID images need `resend.sendEmailManually`.
  - `convex logs` streams forever; don't run it in the foreground.

---

## Phase 1: Tracer bullet — RX submit → Convex → Resend email on Preview

**User stories**: 33, 34, 37, 44, 45, 46, 52, 53, 54, 55, 56, 58

### What to build

Get the thinnest possible path working end to end on the deployed `v2` Preview:

- Initialise shadcn and Convex, and install the Convex Resend component.
- Define the `rxSubmissions` table, with the drawing and scan fields optional and unused for now.
- Keep the existing RX form fields.
- On submit, call a Convex mutation that validates the input, saves the record, and schedules a basic React Email to the owner (a plain list of fields).
- Update the email status on the record.
- Show the success toast only after the mutation succeeds, and an error toast if it fails.
- Configure the Vercel Preview environment variables (Convex deploy key/URL, Resend key, email settings) so the deployed Preview uses the dev Convex deployment and the staging email override.

### Acceptance criteria

- [ ] The `v2` branch deploys to a Vercel Preview URL. Production is unchanged.
- [ ] Submitting the RX form on the Preview creates a `rxSubmissions` record in the dev Convex deployment.
- [ ] The staging inbox gets an email from `onboarding@resend.dev` with a `[STAGING]`-prefixed subject in the form `New RX: <patient> — Dr. <last>`. Its reply-to is the doctor's email.
- [ ] The success toast only shows after the submission is saved. A forced failure shows an error toast.
- [ ] The email send status is recorded on the submission, and failed sends are retried by the Resend component.
- [ ] The mutation rejects submissions that are missing required fields.
- [ ] Typecheck and tests pass.

---

## Phase 2: Shared option lists + RX form rebuilt in shadcn

**User stories**: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 32, 35, 61

### What to build

- Create the shared option-list module with corrected spellings, including the Lemon Yellow value fix.
- Rebuild the RX form with shadcn Form components:
  - Inputs for the doctor's and patient's details.
  - A grouped appliance Select.
  - Position, clasp, spring and colour Selects.
  - The colour-chart Dialog.
  - A Delivery date picker.
  - A special-instructions Textarea.
- Mark required fields, and show inline zod errors.
- The submit button shows a loading state and can't be clicked twice.
- After a successful submit, the form resets.
- The phase 1 email shows the new delivery date field.

### Acceptance criteria

- [ ] All dropdown options come from the shared module, and none of the misspellings listed in the PRD remain.
- [ ] Choosing "Lemon Yellow" submits `Lemon Yellow`.
- [ ] Appliances appear in the two paper-form groups.
- [ ] Leaving a required field empty, or entering an invalid email, shows an inline error and blocks submit.
- [ ] Delivery date can be picked and is saved and emailed.
- [ ] The submit button shows a spinner and is disabled while submitting. The form clears on success.
- [ ] The colour chart dialog still works.
- [ ] Unit tests cover the zod schema and the option lists.

---

## Phase 3: PDF download callout

**User stories**: 1, 2

### What to build

Add a highlighted "Prefer paper? Download the RX form" card at the top of `/rxform`. It downloads the local `/rx-form.pdf` and replaces the uploadthing links.

### Acceptance criteria

- [ ] The callout appears above the form and stands out visually on desktop and mobile.
- [ ] Clicking it downloads the current `public/rx-form.pdf`.
- [ ] No uploadthing links remain on the RX page.

---

## Phase 4: Owner email laid out like the paper RX form

**User stories**: 38, 41, 57

### What to build

Replace the basic owner email with a React Email template that copies `public/rx-form.pdf`, using table-based Section/Row/Column layout:

- A header with the logo, lab address and phone, plus the doctor / address / phone / patient / delivery-date block.
- The purple "Appliances Prescription" bar.
- A left column: the arch image (the blank arch for now), then the clasp, spring and position fields, then the appliance colour.
- A right column: the full grouped appliance list, with the chosen appliance ticked. "Other" shows the instructions.
- The special instructions box.
- The "Over 45 years of excellence" footer.

Set up local React Email previews using sample data.

### Acceptance criteria

- [ ] A staging submission produces an email that, in Gmail (web and mobile), looks like the paper form side by side.
- [ ] The selected appliance is ticked and every other appliance shows as unticked.
- [ ] The template renders in the local React Email preview using sample data.
- [ ] Template tests render it with sample data and check the ticked appliance, the doctor and patient details, and the instructions.

---

## Phase 5: Drawing on the arch, end-to-end

**User stories**: 16, 17, 18, 19, 20, 21, 22, 39, 40

### What to build

**First, a spike:** confirm Resend sends inline (CID) images that render in Gmail. If not, fall back to a hosted Convex image URL.

**Then the drawing feature:**

- Add a drawing layer over `mouth.png`, with pen, eraser, undo, redo, clear, 2–3 colours and 1–2 widths. It must work with mouse, touch and stylus, and drawing must not scroll the page.
- On submit, if the doctor drew anything, merge the drawing with the arch image into one PNG and upload it to Convex storage. Save the storage id as `drawing` on the submission.
- Embed the drawing in the left column of the owner email. If nothing was drawn, show the blank arch.

### Acceptance criteria

- [ ] The spike result (CID supported or fallback chosen) is documented in the plan or PRD notes.
- [ ] The doctor can draw, erase, undo/redo and clear, using a mouse and using touch on a phone or tablet. The page does not scroll while drawing.
- [ ] Submitting with a drawing saves a PNG in Convex storage, linked from the submission.
- [ ] The owner email in Gmail shows the drawing on the arch without clicking "display images", or with the documented fallback behaviour.
- [ ] Submitting without drawing works and the email shows the blank arch.
- [ ] The form resets the canvas after a successful submit.

---

## Phase 6: Scan uploads, end-to-end

**User stories**: 23, 24, 25, 26, 27, 28, 29, 30, 31, 42, 43

### What to build

**First, a spike:** confirm Convex upload URLs accept a 250 MB file.

**Then the upload feature:**

- Add an upload area (drag-and-drop or file picker) that accepts several `.stl`/`.ply` files.
- Reject wrong types and files over 250 MB immediately, with a message.
- Each file uploads directly to Convex storage. Each one shows a progress bar and can be removed or retried.
- Submit is blocked while any upload is in progress.
- On submit, check each file's type and size again on the server using its storage metadata. Reject and delete invalid files.
- Save scan metadata in `scans`.
- Add a "Scans" section to the owner email, with one row per file: name, readable size and a permanent download link.

### Acceptance criteria

- [ ] The spike result is documented. A file of about 200 MB uploads successfully from the Preview.
- [ ] Multiple files upload in parallel, each with its own progress. Files can be removed before submit, and failed uploads can be retried.
- [ ] Wrong file types, and files over 250 MB, are rejected in the browser with a clear message, and again by the server.
- [ ] Submit is disabled, with an explanation, while uploads are in progress.
- [ ] The owner email lists every scan with its name, size and a working download link.
- [ ] Submitting with no scans still works, and the email leaves out the scans section or marks it as none.
- [ ] Tests cover the file-validation rules and the scans section of the template.

---

## Phase 7: Doctor confirmation email

**User stories**: 36

### What to build

After a submission is saved, also send the doctor a confirmation email (React Email) that thanks them and summarises:

- The order fields.
- The drawing.
- The file names of any uploaded scans (no links).

It replies to the lab, and its status is recorded in `doctorEmailStatus`. In staging it goes to the override address.

### Acceptance criteria

- [ ] The staging inbox gets both the owner email and a doctor confirmation for each submission.
- [ ] The confirmation includes the order summary, the drawing (if any) and scan file names, but no scan links.
- [ ] Reply-to is the lab email.
- [ ] A failure to send the doctor email does not affect the owner email or the doctor's success response, and is recorded in `doctorEmailStatus`.

---

## Phase 8: Contact form on Convex + Resend + shadcn

**User stories**: 47, 48, 49, 50, 51

### What to build

- Add the `contactMessages` table.
- Rebuild the footer contact form using shadcn Form and zod validation (name, valid email, message).
- On submit, call a Convex mutation that saves the message and sends the owner a React Email via Resend, with reply-to set to the visitor.
- Show the success toast only on success, and an error otherwise.
- Fix the footer `mailto:` link to `advancedortholabsf@gmail.com`.

### Acceptance criteria

- [ ] Submitting the contact form on the Preview saves a `contactMessages` record and sends an email to the staging inbox, with reply-to set to the visitor.
- [ ] Validation errors show inline. Toasts reflect the real outcome.
- [ ] The footer email link points to `advancedortholabsf@gmail.com`.
- [ ] The contact form no longer calls Mailgun.

---

## Phase 9: Cleanup

**User stories**: 59, 60, 62

### What to build

- Remove:
  - Mailgun (dependencies and API routes).
  - The Supabase client, its hard-coded key and the Supabase dependency.
  - Prisma (schema, client, server action).
  - Kinde (dependency, auth route, sign-in/user-nav/old navbar).
  - Unused hero and digital-printing variants.
  - react-toastify.
- Remove the old environment variables from the docs.
- Update `docs/overview.md` to describe the v2 architecture.

### Acceptance criteria

- [ ] No Mailgun, Supabase, Prisma, Kinde or react-toastify imports or dependencies remain.
- [ ] No credentials are hard-coded in source.
- [ ] All marketing pages still render unchanged on the Preview.
- [ ] `docs/overview.md` describes Convex, Resend/React Email, shadcn, the email environment variables and the staging override.
- [ ] Build, typecheck and tests pass.

---

## Phase 10: Production cutover

**User stories**: 52, 56 (production side)

### What to build

This is the ops checklist for going live. It is blocked on GoDaddy DNS access.

1. Verify `advancedortholabsf.com` in Resend by adding the SPF/DKIM TXT records and the bounce subdomain's MX/return-path record in GoDaddy.
2. Create the production Convex deployment.
3. Set the production Vercel environment variables:
   - `EMAIL_FROM=rx@advancedortholabsf.com`
   - `EMAIL_TO_OWNER=advancedortholabsf@gmail.com`
   - No `EMAIL_OVERRIDE_TO`
   - The production Convex deploy key/URL and the Resend key
4. Optionally, switch staging to the verified sender while keeping the override.
5. Merge `v2` → `main`.
6. After a quiet period, remove the Mailgun DNS records and API keys.
7. Before launch, the owner decides whether HIPAA applies and whether Convex and Resend BAAs are needed.

### Acceptance criteria

- [ ] Resend shows the domain as verified.
- [ ] A real test submission on production reaches `advancedortholabsf@gmail.com` from `rx@advancedortholabsf.com`, with no `[STAGING]` prefix. The doctor confirmation goes to the doctor's address.
- [ ] Production data is in the production Convex deployment, separate from staging.
- [ ] The Mailgun records and keys are removed after the quiet period.
- [ ] The owner's HIPAA/BAA decision is recorded.
