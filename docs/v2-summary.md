# v2 summary: RX form and scan submission (handoff for v3)

Written 2026-10-13, after v2 went live. Read this first when starting v3. It says what v2 changed, how the RX form and scan pipeline work now, where everything lives, why things were built this way, and what is still open.

Related docs:

- `docs/overview.md`: the current architecture as a reference (stack, folders, env vars, local dev).
- `plans/rx-form-v2.md`: the original v2 PRD (problems, user stories, out of scope).
- `plans/rx-form-v2-plan.md`: the phase-by-phase plan, with detailed handoff notes and gotchas.
- `docs/v2.md`: the developer's original notes from before the rebuild.

---

## 1. Status

- **v2 is live** on https://www.advancedortholabsf.com. `v2` was merged into `main` (PR #2, 2026-10-05); follow-ups went in as PR #3 (US due date, new colour chart) and PR #4 (typo fix).
- Work still happens on the `v2` branch, then merges into `main` through a PR. Vercel deploys production from `main` and a Preview from `v2`.
- Production sends real emails: RX orders and contact messages go to `advancedortholabsf@gmail.com`, from `Advanced Ortho Lab RX <rx@advancedortholabsf.com>`.

---

## 2. What changed, before vs. after

| Area | v1 (before) | v2 (now) |
|---|---|---|
| Scans | Doctors emailed `.stl`/`.ply` files separately; often too big for Gmail and not linked to the order | Optional upload on the form: multiple files, up to 250 MB each and 20 per order, with per-file progress, retry and remove. Files go straight from the browser to Vercel Blob; the owner email has a download link per scan that saves under the original file name |
| Drawing | Arch image shown, but nobody could draw on it | Doctor draws on the arch (pen, eraser, 3 colours, 2 widths, undo/redo/clear; mouse, finger or stylus). Flattened to a PNG, stored in Convex, embedded inline in both emails |
| Owner email | Mailgun template that looked nothing like the paper form | React Email template laid out like the paper RX form (`public/rx-form.pdf`): logo header, doctor/patient block, purple "Appliances Prescription" bar, drawing + clasp/spring/arch checkboxes + colour, full appliance checklist with the chosen one ticked, additional information box, scans list |
| Doctor email | None | Confirmation with logo header, order summary, drawing and scan file names (no links) |
| Reliability | Success toast on click even if sending failed; API always returned success | Success only after the submission is saved; real errors shown; email status stored per submission with retries |
| Validation | None | zod schema shared by the browser and the Convex mutation |
| Options | Misspellings ("Dugonni", "Hydrax", "Turqouise"...) and "Lemon Yellow" submitted `Any` | One shared, tested option list with corrected spellings, grouped like the paper form |
| Paper form | Small button linking to an external uploadthing file | Highlighted "Prefer paper? Download the RX form" callout serving `/rx-form.pdf` |
| Contact form | Mailgun | Convex + Resend + shadcn, reply-to the visitor |
| Stack | Mailgun, Supabase (hard-coded key), Prisma and Kinde (unused), react-toastify, dead UI variants | Convex (data, drawings, crons), Vercel Blob (scans), Resend + React Email, shadcn/ui + react-hook-form + zod, Sonner. All the old services removed |

---

## 3. The RX form today (`/rxform`, `app/components/RXForm/rxform.tsx`)

Layout: page title (h1 "RX Form"), the paper-form callout, then two columns on desktop. The **left** column (sticky) has the arch drawing and its toolbar; the **right** column has the form.

Fields, in order. Labels are what the doctor sees; some stored keys predate a rename:

| Label | Stored key | Required | Notes |
|---|---|---|---|
| First name, Last name, Email, Phone | `first`, `last`, `email`, `phone` | Yes | |
| Street address, City, ZIP | `street`, `city`, `zip` | No | |
| Patient | `patient` | Yes | |
| Due date | `deliveryDate` | Yes | Typed MM/DD/YYYY field with a calendar button (`DueDateInput.tsx`); stored as ISO `YYYY-MM-DD`. Past dates are rejected in the browser only |
| Appliance | `appliance` | Yes | Grouped select: Orthodontic & Pediatric (14), Splint / T.M.J. (3), Other - Specify Below |
| Arch | `position` | No | Upper / Lower / Both. Was labelled "Position" |
| Clasp | `clasp` | No | Adams, Ball, C, Other - Specify Below |
| Spring | `spring` | Yes (defaults) | `No Spring` (default) / `Spring - Specify Below`; choosing Spring shows a hint to describe it below |
| Appliance color | `color` | No | Searchable combobox (shadcn Command + Popover) plus a "View chart" dialog showing `public/colours.png` |
| Additional information | `instructions` | Yes | Was "Special instructions" (optional). Holds spring details and "Other" details |
| Scans | `scans` | No | `ScanUpload.tsx`. Submit is disabled while any upload is running or has failed |
| Drawing | `drawing` | No | `ArchDrawing.tsx` |

Option lists live only in `convex/lib/rxOptions.ts`. The marketing appliance catalogue (`app/components/Appliances/Appliances.tsx`, `Home/Appliances.tsx`) is separate copy.

---

## 4. How a submission flows

1. **While filling in the form, scans upload.** For each file, `ScanUpload.tsx` calls the Convex action `scanUploadsNode.createScanUpload`. It checks the name, extension and size (`scanFileProblem`), picks the path `scans/<uuid>/<sanitised name>`, records it in the `scanUploads` table and returns a Blob client token. The token is locked to that path, to the content type (`.stl` → `model/stl`, `.ply` → `model/x-ply`) and to 250 MB, and is valid for 2 hours. The browser `put`s to Blob, using multipart above 100 MB, and shows progress.
2. **On submit**, if anything was drawn, `ArchDrawing` exports a 776×906 PNG of the arch background plus the strokes. The PNG is uploaded to Convex storage through `rxSubmissions.generateUploadUrl`; the limit is 5 MB, PNG only.
3. **The `rxSubmissions.submit` mutation** re-validates everything with `rxSubmissionSchema` and checks the drawing's type and size. It accepts only scan paths that exist in `scanUploads` and haven't been claimed by another submission, saves the `rxSubmissions` row, marks the scans as claimed, and schedules two separate actions: `emails.sendOwnerRxEmail` and `emails.sendDoctorRxEmail`. Either email can fail without affecting the other.
4. **Owner email** (`emails/RxOwnerEmail.tsx`):
   - Before sending, the action `head()`s each scan in Blob to get its real size and download URL, and saves those on the submission (`setScanDetails`). A scan that never arrived is listed as "Upload missing".
   - Subject `New RX: <patient> — Dr. <last>`; reply-to is the doctor.
5. **Doctor email** (`emails/RxDoctorEmail.tsx`): subject `RX received: <patient> — Advanced Ortho Lab`; reply-to is the lab inbox.
6. **How emails are sent:**
   - Without a drawing, emails go through the Resend component's queue (`resend.sendEmail`), which has retries built in.
   - With a drawing, they're sent directly with the Resend SDK, because the queue's batch API can't carry attachments. The drawing is attached inline (CID `rx-drawing`), and `emails.tsx` retries at 30 s, 2 min, 10 min and 30 min.
   - Status is stored in `ownerEmailStatus` / `doctorEmailStatus`.
7. **Housekeeping crons** (`convex/crons.ts`, hourly):
   - `storage.sweepOrphanedUploads` deletes Convex files 1–3 days old that no submission references (rejected or abandoned drawings).
   - `scanUploadsNode.sweepOrphanedScans` deletes Blob scans older than a day that no submission claimed.

**Staging behaviour** (`convex/lib/emailRouting.ts`): if `EMAIL_OVERRIDE_TO` is set on a deployment, every email goes to that address and its subject gets a `[STAGING]` prefix. It is set on dev only.

---

## 5. Infrastructure and how to deploy

| Thing | Value |
|---|---|
| Convex project | `advanced-ortho-lab` (team `mselbekk11`) |
| Convex dev (used by local dev and the Vercel Preview) | `glad-mole-195` (https://glad-mole-195.convex.cloud) |
| Convex production | `zany-akita-445` (https://zany-akita-445.convex.cloud) |
| Vercel project | under `mselbekk11s-projects`; Production uses `NEXT_PUBLIC_CONVEX_URL` = the prod Convex URL, Preview uses the dev URL; Node 24.x. Preview is behind Vercel login |
| Resend | Domain `advancedortholabsf.com`, verified 2026-10-05 (DKIM `resend._domainkey`, SPF CNAMEs `send` / `rsend`, configured through GoDaddy). Region us-east-1 |
| Vercel Blob | Public store `store_US3X6UpIsyJ0HvFe` (host `us3x6upisyj0hvfe.public.blob.vercel-storage.com`). Holds `scans/…` and the email logos under `email/` (`logo.png`, `logo-full.png`). Prod and dev share it |
| DNS | GoDaddy (the business owner's account) |

Convex environment variables are set per deployment with `npx convex env set [--prod]`:

- **Prod:** `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO_OWNER`, `BLOB_READ_WRITE_TOKEN`. `EMAIL_OVERRIDE_TO` must never be set in prod.
- **Dev:** the same four plus `EMAIL_OVERRIDE_TO`. Dev's `EMAIL_FROM` is still `onboarding@resend.dev`.
- `RESEND_WEBHOOK_SECRET` isn't set anywhere, so delivery and bounce status never update past "sent".

**Deploying:**

- **Front-end only changes:** commit to `v2` → PR into `main` → merge → Vercel builds production.
- **Changes in `convex/`:** the Vercel build does **not** deploy Convex. Push to dev with `npx convex dev --once`, and run **`npx convex deploy`** (to prod) when the change goes to `main`. Forgetting this leaves the live site calling old functions. An option for v3 is to add `CONVEX_DEPLOY_KEY` (Production only) and a build command that runs `npx convex deploy --cmd 'npm run build'` only when `VERCEL_ENV=production`.
- **Email logos** come from the Blob store, not from `/public`. If `public/logo-png.png` or `public/logo-full-png.png` changes, re-upload it to `email/logo.png` / `email/logo-full.png`.

---

## 6. Key decisions and why

- **Scans in Vercel Blob, not Convex storage.** Convex storage URLs don't carry a file name, so downloads saved as a bare UUID with no extension. Convex HTTP actions can't stream more than 20 MB, so they can't proxy a 250 MB file either. Blob serves `content-disposition: attachment; filename="<name>"`. The owner wants email links to download directly with the right name, with no landing page.
- **Drawings stay in Convex storage**, and are embedded in the emails as inline CID images so Gmail shows them without "display images".
- **Single-select fields**, not the paper form's multi-select checklist (one appliance, one clasp, and so on). This was a deliberate v2 scope cut.
- **Stored keys kept when labels changed** (`position` = Arch, `instructions` = Additional information, `deliveryDate` = Due date). This avoided a data migration; the comments in `rxOptions.ts` and `rxSubmission.ts` record it.
- **Custom US date field.** The native `<input type="date">` shows the viewer's locale format, so non-US browsers showed DD/MM/YYYY. shadcn's Calendar (react-day-picker v10) doesn't work with shadcn 2.3.0. So the field is a typed MM/DD/YYYY input, and its calendar button opens the native picker (`showPicker()`).
- **Permanent, unguessable scan links** (public Blob). Expiring links were explicitly deferred, so the data model doesn't block adding them later.
- **No Convex deploy in the Vercel build yet** (manual `npx convex deploy`). It was kept simple for launch.

---

## 7. Site polish done alongside v2

- Hero has an equal-width "Contact us" button that smooth-scrolls to `#contact` (the footer contact form, on every page).
- Solid `Button` variants (`components/ui/button.tsx`: default, destructive, secondary, purple) lift 1px with a soft shadow on hover instead of changing colour. Icon-size buttons don't lift, and reduced-motion users get the shadow only.
- Headings: one h1 per page and h2 for sections, styled by `.heading-1` / `.heading-2` in `app/globals.css`. The small purple pill labels are `<p>`, not headings.
- New appliance images (`removable-`, `fixed-`, `tmj-appliances.png`) and logo PNGs in `public/`.

---

## 8. Open items and known tech debt

**Owner decisions**

- [ ] **HIPAA / BAAs.** Scans, drawings and patient names are health information, and scan links are public (if unguessable). Whether HIPAA applies, and whether Convex and Resend BAAs are needed, has not been recorded.
- [ ] Homepage "42 Years of experience" card vs. the "Over 44 years" badge (`DigitalPrintingThree.tsx`).

**Cleanup due after the quiet period (about 2026-10-20)**

- [ ] Remove the Mailgun DNS records in GoDaddy, revoke the Mailgun keys, and delete the `MAILGUN_*` and Supabase variables from Vercel and `.env.local`.
- [ ] Delete the `spike/` folder in the Blob store.
- [ ] Clear the 3 early dev test submissions with the legacy Convex-storage scan shape, then drop that union branch from `convex/schema.ts` (`rxSubmissions.scans`).
- [ ] Delete the unused `public/color-chart.jpeg` and the other unused assets (`AOL.svg`, etc.).

**Gaps worth considering for v3**

- No admin view: the owner only sees submissions by email. Browsing orders and files means the Convex dashboard.
- Delivery status stops at "sent" (no Resend webhook).
- Convex isn't deployed by the Vercel build (see section 5).
- The paper form's multi-select model isn't supported: several appliances, per-clasp tooth positions, expansion screw size.
- No doctor accounts, order history or re-ordering (Clerk + Convex was the suggested route).
- Scan links never expire.
- The past-date check runs only in the browser; the server accepts any valid ISO date.
- The drawing has no text or symbol stamps (the paper form says "use symbols").
- No 3D scan preview.
- The appliance catalogue copy is duplicated between the marketing pages and is separate from `rxOptions.ts`.
- Some marketing images are hot-linked from `i.ibb.co` / `tailwindui.com`, and the hero video is on uploadthing.

---

## 9. Working on this codebase

- `npm run dev`, `npm test` (Vitest, 89 tests: option lists, schemas, email routing, drawing/scan rules, email templates, due-date conversion), `npm run typecheck`, `npm run email` (React Email previews on http://localhost:3001).
- Add shadcn components with `npx -y shadcn@2.3.0 add <name> -y </dev/null`. This is Tailwind 3; the CLI hangs without `</dev/null`.
- Email templates: images must be absolute URLs and not SVG. Tests find checkbox state through `data-option="<field>:<option>"` / `data-checked`.
- A throwing Convex mutation rolls back `ctx.storage.delete`, which is why rejected drawings are left for the sweep.
- Blob client tokens default to a 30-second expiry; `SCAN_UPLOAD_WINDOW_MS` sets 2 hours.
- `npx convex logs` streams forever, so don't run it in the foreground.
- The local Vercel CLI is logged into a different account than the project owner, so Vercel settings and build logs come from the dashboard.
