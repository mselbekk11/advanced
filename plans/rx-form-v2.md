# PRD: Advanced Ortho Lab v2 — RX Form, Scan Uploads, Resend + Convex

## Problem Statement

Advanced Ortho Lab receives appliance prescriptions from dentists and orthodontists through the RX form on the website (`/rxform`). That flow has several problems:

- **Scans don't fit in email.** Doctors send intraoral scans (`.stl` / `.ply`) to the owner by email. They are often too big to send or open in Gmail. The scans also arrive separately from the RX form they belong to, so the owner has to match them up by hand.
- **The doctor can't draw the case.** The paper RX form has an arch diagram labelled "Design case above". The doctor draws the design on it. The web form shows the arch image but nobody can draw on it, so design intent gets lost or has to be typed out.
- **The order email is hard to read.** The owner gets a Mailgun template email that looks nothing like the paper RX form he and his clients use (`public/rx-form.pdf`). Web and paper orders read differently.
- **The form is unreliable and unpolished:**
  - The success toast shows on click, even when the submission fails.
  - The email API always returns success, even when sending fails.
  - Several options are misspelled ("Dugonni", "Hydrax", "Seperator", "Turqouise", "Light Prutple", etc.).
  - One option is broken: "Lemon Yellow" actually submits the value `Any`.
  - No fields are validated.
  - The "Download Form" button is easy to miss and points to an external uploadthing file instead of the current PDF.
- **The stack is fragmented:**
  - A hard-coded Supabase key and table are used as a write-only archive.
  - Prisma and Kinde auth are present but unused.
  - Several unused component variants are still in the repo.
  - The developer wants to move to Convex (data and files), Resend with React Email (email), and shadcn (UI).
- **It can't be tested safely.** The developer needs to test v2 at a live URL without touching the production site. The domain's DNS (GoDaddy) won't be available for about a week, but the email flow still needs to be built and tested before then.

## Solution

A v2 of the RX form flow, built on a long-lived `v2` branch and deployed to a Vercel Preview URL with its own environment variables. Production (`main`) keeps the current Mailgun/Supabase behaviour until the branch is merged.

From the doctor's point of view, the redesigned `/rxform` page:

- Puts a prominent "Prefer paper? Download the RX form" callout at the top. It serves the current `public/rx-form.pdf`.
- Uses shadcn form components, with corrected spellings and required-field validation.
- Adds the "Delivery date" field from the paper form.
- Lets the doctor draw on the arch diagram with pen, eraser, undo/redo, clear and 2–3 pen colours. This works with a mouse, a finger or a stylus.
- Lets the doctor optionally attach one or more `.stl` / `.ply` scans, up to 250 MB each, with a progress bar per file. Files upload straight from the browser to Convex storage, bypassing Vercel's ~4.5 MB request-body limit.
- Shows success only after the submission is saved and the emails are queued. Failures show a real error.

From the owner's point of view:

- Each submission is stored in Convex together with its drawing PNG and any scans.
- He gets one email, sent through Resend and built with React Email, that is laid out like the paper RX form:
  - Lab header and the doctor / address / phone / patient / delivery-date block.
  - The purple "Appliances Prescription" bar.
  - A left column with the doctor's drawing (embedded inline) and the clasp / spring / colour fields.
  - A right column with the full appliance checklist and the chosen appliance ticked.
  - Special instructions at the bottom.
  - A "Scans" section with a download link for each uploaded scan.
- The doctor gets a confirmation email summarising what they submitted.

The footer contact form also moves to Resend and shadcn, and Mailgun, Supabase, Prisma, Kinde and dead UI variants are removed.

## User Stories

### Doctor — filling out the RX form

1. As a doctor, I want a clearly visible "Download the paper RX form" callout at the top of the RX page, so that I can print and fill it by hand if I prefer.
2. As a doctor, I want the downloadable PDF to be the lab's current RX form, so that my paper order matches what the lab expects.
3. As a doctor, I want to enter my first name, last name, email, phone, street, city and ZIP, so that the lab knows who is ordering and where to deliver.
4. As a doctor, I want to enter the patient's name, so that the appliance is matched to the right patient.
5. As a doctor, I want to pick a delivery date from a date picker, so that the lab knows when I need the appliance.
6. As a doctor, I want to choose the appliance from a single dropdown with correctly spelled names, so that I can trust I'm ordering the right thing.
7. As a doctor, I want the appliance dropdown grouped as "Orthodontic & Pediatric" and "Splint / TMJ", like the paper form, so that I can find items quickly.
8. As a doctor, I want to pick Upper, Lower or Both for the position, so that the lab builds for the correct arch.
9. As a doctor, I want to pick a clasp type (Adams, Ball, C, or Other), so that the retention is built to my spec.
10. As a doctor, I want to pick a spring option or say I'll specify one, so that the spring design is communicated.
11. As a doctor, I want to pick an appliance colour from a correctly spelled list, so that the patient gets the colour they chose.
12. As a doctor, I want to open the colour chart from the form, so that I can show the patient what each colour looks like.
13. As a doctor, I want a special-instructions text area, so that I can describe anything the dropdowns don't cover (e.g. "Other – specify below").
14. As a doctor, I want required fields (my name, email, phone, patient, appliance) marked and validated inline, so that I don't submit an incomplete order.
15. As a doctor, I want a clear error message on any field that is invalid (e.g. a malformed email), so that I can fix it before submitting.

### Doctor — drawing on the arch

16. As a doctor, I want to draw on the arch diagram, so that I can show the case design the way I would on paper.
17. As a doctor, I want to draw with a mouse, my finger, or an iPad pencil, so that I can use whatever device I have.
18. As a doctor, I want 2–3 pen colours, so that I can tell different elements apart (e.g. wire vs clasp).
19. As a doctor, I want an eraser, undo and redo, so that I can fix mistakes without starting over.
20. As a doctor, I want a clear button, so that I can start the drawing again.
21. As a doctor, I want the drawing to be optional, so that I can submit simple orders without drawing.
22. As a doctor, I want the drawing canvas to be usable on a phone or tablet without the page scrolling while I draw, so that my strokes land where I intend.

### Doctor — scan upload

23. As a doctor, I want to attach intraoral scans to my RX form, so that I don't have to email large files separately.
24. As a doctor, I want to attach several files (e.g. upper, lower, bite), so that the whole case arrives together.
25. As a doctor, I want only `.stl` and `.ply` files accepted, so that I don't accidentally upload the wrong thing.
26. As a doctor, I want to be told immediately if a file is over 250 MB or the wrong type, so that I don't wait for an upload that will fail.
27. As a doctor, I want a progress bar for each file, so that I know a large upload is working.
28. As a doctor, I want to remove a file I attached by mistake before submitting, so that the lab only gets the right scans.
29. As a doctor, I want submit to be blocked (with a clear message) while uploads are still in progress, so that I don't submit an order missing its scans.
30. As a doctor, I want a failed upload to show an error and let me retry, so that a network blip doesn't lose my order.
31. As a doctor, I want scan upload to be optional, so that I can order appliances that don't need a scan, or send scans another way (e.g. iTero lab code).

### Doctor — submission and confirmation

32. As a doctor, I want the submit button to show a loading state, so that I don't double-submit.
33. As a doctor, I want a success message only when my order was actually received, so that I can trust it went through.
34. As a doctor, I want a clear error message if submission fails, so that I know to try again or call the lab.
35. As a doctor, I want the form cleared (including drawing and files) after a successful submission, so that I can start a new order.
36. As a doctor, I want a confirmation email with a summary of my order, so that I have a record of what I sent.

### Owner — receiving orders

37. As the lab owner, I want one email per RX submission, so that each order is a single item in my inbox.
38. As the lab owner, I want the email to look like the paper RX form, so that web and paper orders read the same way.
39. As the lab owner, I want the doctor's drawing embedded in the email, so that I can see the case design without clicking anything.
40. As the lab owner, I want the drawing to show even in Gmail with images from external links blocked or expired, so that it reliably appears (inline attachment, not a data URI or expiring link).
41. As the lab owner, I want the full appliance checklist with the selected appliance ticked, so that I can read the order at a glance like the paper form.
42. As the lab owner, I want each uploaded scan listed with its file name, size and a download link, so that I can fetch the files without Gmail's size limits.
43. As the lab owner, I want scan links that keep working, so that I can download a scan whenever I get to the case.
44. As the lab owner, I want the email subject to include the patient and doctor name, so that I can search my inbox for an order.
45. As the lab owner, I want reply-to set to the doctor's email, so that I can reply to the doctor directly.
46. As the lab owner, I want every submission (fields, drawing, scans) stored in a database, so that nothing is lost if an email goes missing.

### Visitor — contact form

47. As a site visitor, I want the footer contact form to send my message reliably, so that the lab actually receives it.
48. As a site visitor, I want the contact form to show success only when the message was sent, and an error otherwise, so that I know whether to try again.
49. As a site visitor, I want inline validation on the contact form (name, valid email, message), so that I don't send an incomplete message.
50. As the lab owner, I want contact messages stored and emailed through the same system as RX forms, so that there is one email provider to manage.
51. As a site visitor, I want the footer email link to point to the lab's real address, so that I can email them directly (it is currently a `hello@example.com` placeholder).

### Developer — staging and operations

52. As the developer, I want v2 deployed to a Vercel Preview URL from a `v2` branch, so that I can test it live without changing the production site.
53. As the developer, I want the Preview deployment to use its own Convex deployment and Resend settings, so that test submissions never reach production data or the owner's inbox.
54. As the developer, I want staging emails sent from Resend's test sender to my own inbox before the domain is verified, so that I can check the layout, the inline drawing and the scan links now.
55. As the developer, I want a staging override that sends all outgoing emails (owner and doctor confirmation) to one test address, so that I can test the full flow safely.
56. As the developer, I want sender and recipient addresses to come from environment variables, so that switching to `rx@advancedortholabsf.com` after DNS verification needs only a config change.
57. As the developer, I want to preview the React Email templates locally with sample data, so that I can work on the layout without submitting forms.
58. As the developer, I want email-send failures logged in Convex and retried, so that a transient Resend error doesn't silently lose an order.
59. As the developer, I want Mailgun, Supabase, Prisma, Kinde and unused component variants removed, so that the codebase only has what is used.
60. As the developer, I want the hard-coded Supabase key removed from source, so that no credentials are committed.
61. As the developer, I want the appliance, clasp, spring and colour option lists defined once and shared by the form and the email, so that spellings stay consistent.
62. As the developer, I want typecheck and tests to pass on the v2 branch, so that I can merge with confidence.

## Implementation Decisions

### Environments and rollout
- All work happens on a long-lived `v2` branch. Vercel builds it as a Preview deployment, optionally aliased to a stable branch URL. `main` and production are untouched until merge.
- There are two Convex deployments: a dev/preview deployment for the `v2` Preview, and a production deployment created at merge time. The Vercel build runs Convex's deploy step, using the deploy key for the matching environment.
- Vercel Preview environment variables:
  - Convex URL and deploy key.
  - Resend API key.
  - `EMAIL_FROM`, set to `onboarding@resend.dev` until the domain is verified, then `rx@advancedortholabsf.com`.
  - `EMAIL_TO_OWNER`, set to `advancedortholabsf@gmail.com` in production.
  - `EMAIL_OVERRIDE_TO`, staging only; when set, every outgoing email goes to that address.
- Domain verification: verify the root domain `advancedortholabsf.com` in Resend once GoDaddy access is available. Add the SPF/DKIM TXT records Resend provides, plus its return-path/MX record on its bounce subdomain. The existing Mailgun records on `mg.` are left alone until cutover.

### Data and storage (Convex)
- Convex replaces Supabase for RX form data, and also stores contact-form messages. Supabase writes stop in v2. The existing Supabase rows are left in place as an archive; no migration.
- Schema, `rxSubmissions`:
  - Doctor: first, last, email, phone, street, city, zip.
  - Order: patient, deliveryDate, appliance, position, clasp, spring, color, instructions.
  - Drawing: optional storage id of the drawing PNG.
  - Scans: array of { storage id, file name, size, content type }.
  - Status: owner-email status, doctor-email status.
  - Created time.
- Schema, `contactMessages`: first, last, email, phone, message, email status, created time.
- Field values stay single-select strings, matching today's form model (decision: keep single-selects, do not mirror the paper form's multi-select checklist).

#### File uploads
- A Convex mutation issues upload URLs.
- The browser POSTs each scan, and the drawing PNG, directly to Convex storage, then passes the returned storage ids to the submit mutation.
- File type and size (≤ 250 MB per scan) are validated on the client and again server-side. The server reads the storage metadata and rejects, then deletes, files that are the wrong type or too large.
- Verify Convex's upload-URL size limits support 250 MB before building on it.

#### Scan links
- Permanent, unguessable Convex storage URLs (decision: no expiring links and no admin page in v2).
- The download name should be the original file name where possible.

#### Submit mutation
- Validates the required fields: first, last, email, phone, patient, appliance.
- Inserts the submission.
- Schedules the email sends.
- Returns success only once the submission is saved.

### Email (Resend + React Email)
- Emails are sent from Convex, either with the official Convex Resend component (durable queue, retries, status tracking) or with a scheduled action that calls the Resend SDK. The component is preferred.
- The Next.js `pages/api/rxform` and `pages/api/contact` routes are removed. The forms call Convex directly.
- **Owner RX email template:** a React Email component that copies the paper form's layout using table-based Section/Row/Column:
  - Header: logo, lab address and phone, and the doctor / address / phone / patient / delivery-date block.
  - The purple "Appliances Prescription" bar.
  - Left column: the drawing (or the blank arch if nothing was drawn), then the clasp, spring and position fields, then appliance colour.
  - Right column: the full appliance list from the paper form, grouped "Orthodontic & Pediatric" and "Splint / T.M.J.", with the selected appliance shown as a ticked box. "Other" shows the instructions.
  - Special instructions box.
  - A "Scans" section: one row per file with name, human-readable size and a download link.
  - Footer: the "Over 45 years of excellence" bar.
  - Subject: `New RX: <patient> — Dr. <last>`. Reply-to: the doctor's email.
- **Drawing in the email:** the drawing is flattened onto the arch image as one PNG on the client and stored in Convex. It is sent as an inline (CID) attachment so it renders in Gmail, not as a data URI or remote link. Resend's inline/CID attachment support must be confirmed early; the fallback is a hosted image URL.
- **Doctor confirmation email:** a simpler React Email template that thanks the doctor and summarises the order fields and drawing. It names the uploaded scan files but does not include their links. Reply-to: the lab email.
- **Contact email:** a simple React Email template sent to the owner, with reply-to set to the visitor.
- **Staging behaviour:** when `EMAIL_OVERRIDE_TO` is set, every send goes to that address and the subject is prefixed `[STAGING]`. This is needed because `onboarding@resend.dev` can only deliver to the Resend account owner.
- Send failures are recorded in the submission's email status. The doctor's success response depends only on the submission being saved and the send being queued, not on the email being delivered.

### Shared option lists
- One module defines the appliance list (grouped), positions, clasps, springs and colours, with corrected spellings. The form and the email templates both use it. Fixes include:
  - Dugoni, Hyrax, Separator, 6x6 Lingual Arch, Wraparound.
  - Quad Helix Expansion "W" Arch, Fluorescent Pink, Root Beer Brown, Persimmon, Turquoise, Sapphire Blue, Cobalt Blue, Light Purple, Sunrise Orange.
  - The Lemon Yellow value bug.
- "Invisible Retainer/Essex" matches the paper form's spelling. The developer will confirm the remaining client-agreed spelling changes.

### Front-end (shadcn)
- Initialise shadcn on the existing Next 14 + Tailwind 3 setup. No framework upgrade.
- Rebuild the RX form and the footer contact form with shadcn Form (react-hook-form + zod), Input, Select (with groups), Textarea, Button, a date picker (Popover + Calendar), Dialog (colour chart), Progress (uploads) and Sonner toasts (replacing react-toastify).
- A zod schema for the RX form, shared between client validation and the Convex argument validators where practical.
- **Drawing component:** `react-sketch-canvas` over `mouth.png`, with pen, eraser, undo, redo, clear, 2–3 colours and 1–2 widths. It exports a flattened PNG of the background plus strokes at submit time. Touch-action is set so drawing doesn't scroll the page.
- **Scan upload component:** a drag-and-drop or picker area that accepts multiple files. Each file has its own upload state (queued / uploading % / done / error + retry / remove). It exposes "all uploads complete" to gate submit.
- **PDF callout:** a highlighted card at the top of `/rxform` linking to `/rx-form.pdf` (download attribute), replacing the uploadthing links.
- Marketing pages are not restyled.

### Cleanup
- Remove:
  - Mailgun (`mailgun.js`, `form-data`) and the Mailgun API routes.
  - The Supabase client, its hard-coded key and the `@supabase/supabase-js` dependency.
  - Prisma (schema, client, `postData`).
  - Kinde (dependency, auth route, `SignIn`, `UserNav`, old `Navbar`).
  - Unused Hero / DigitalPrinting variants.
  - `react-toastify`, once Sonner replaces it.
- Fix the footer `mailto:` placeholder to `advancedortholabsf@gmail.com`.
- Update `docs/overview.md` to describe the v2 architecture.

### Testing
- Unit-test the shared option lists and zod schema: required fields, email format, file type/size validation.
- Unit-test the email templates: render them with sample data and assert that key content is present, such as the ticked appliance, the scan links, the drawing CID reference and the staging subject prefix.
- Test Convex functions where practical: the submit mutation rejects missing required fields and invalid storage ids.
- Manual end-to-end check on the Vercel Preview: submit with a drawing and 2 large scans, confirm the staging inbox receives the owner and doctor emails, the drawing shows in Gmail, and the scan links download.

## Out of Scope

- Changing the form to the paper form's multi-select model (appliance checklist, per-clasp tooth positions, expansion screw size). Single-selects are kept.
- Doctor accounts, login, order history or re-ordering (possible v2.1 with Clerk + Convex).
- An admin dashboard for the owner to browse submissions or files.
- Expiring or access-controlled scan links.
- Migrating historical Supabase submissions into Convex.
- Restyling marketing pages, upgrading Next.js or Tailwind, or per-page metadata.
- Text or symbol stamps on the drawing canvas (Fabric.js / tldraw).
- Resumable/chunked uploads beyond what Convex upload URLs provide.
- A 3D scan viewer.
- Signing BAAs: covered under Further Notes as an owner decision, not a build task.

## Further Notes

- **Patient data / HIPAA:** scans, drawings and patient names are health information. With permanent unguessable scan links, anyone who gets the email or link can download the file. Before production launch, the owner should decide whether HIPAA applies to the lab's use case. If it does, he should confirm whether Convex and Resend will sign a BAA on the chosen plans. This PRD accepts permanent links by explicit decision. Expiring links or an admin page can be added later without changing the data model.
- **Unverified assumptions to check first:**
  - Convex's per-file upload limit at 250 MB.
  - Resend inline (CID) image support.
  - Gmail rendering of the inline drawing.
  - Convex storage URLs letting the download use the original file name.
- **Cutover checklist:**
  - Verify the domain in Resend (GoDaddy DNS).
  - Set the production env vars (`EMAIL_FROM=rx@advancedortholabsf.com`, `EMAIL_TO_OWNER`, no `EMAIL_OVERRIDE_TO`).
  - Create the Convex production deployment.
  - Merge `v2` → `main`.
  - Remove the Mailgun DNS records and API keys after a quiet period.
- The developer will confirm any other client-agreed spelling changes beyond those listed.
- The iTero lab code (26235) and 3Shape-by-email remain valid alternatives to uploading scans; the form could mention them next to the upload field.
