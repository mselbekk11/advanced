# Plan: RX form v3: Drawing templates

> Source PRD: `plans/rx-form-v3-templates.md`

## Architectural decisions

These apply to every phase:

- **Routes:**
  - `/rxform` is unchanged.
  - New dev-only route `/dev/template-studio`. It returns 404 unless running under `next dev`, and nothing links to it.
- **Schema / backend:** no Convex, schema, email or storage changes. A template is part of the exported drawing PNG, which follows the existing v2 path. No `npx convex deploy` is needed.
- **Template data model:**
  - `DrawingTemplate`: a list of strokes. Each stroke is an ordered list of `{ x, y }` points in **arch-image coordinates** (388 × 453, the size of `mouth.png`).
  - Templates have no colour or width. They always render as the default pen: black `#111827`, width 2.
  - Templates are grouped into two categories, `appliance` and `clasp`. Each is keyed by option name from the shared RX option list, then by arch `upper` / `lower`.
  - "Other - Specify Below" never has a template. Spring and colour have no templates.
- **Template selection rule:**
  - Arch `Upper` gives upper templates, `Lower` gives lower, `Both` gives both, and blank gives upper.
  - There is at most one appliance template and one clasp template per arch shown.
- **One stroke = one erasable part.** The eraser stays in stroke mode.
- **Canvas ownership:** the drawing component tracks which strokes on the canvas belong to which template category. A swap or reset rebuilds the path list with reset + `loadPaths`, and that clears undo/redo history.
- **Scaling:** arch-image coordinates are scaled to the rendered canvas width when strokes load. Existing strokes are not rescaled on window resize (same as v2).
- **Export:** unchanged, 776 × 906 PNG. Template strokes count as drawing, so an unedited template is sent.

---

## Phase 1: Template studio and template data format

**User stories:** 36, 37, 38, 40, 41, 42, 43, 44, 45, 47, 48

### What to build

- The shared template module, with an empty-or-partial template map keyed by option names from the RX option list, plus coordinate helpers that convert between arch-image and canvas coordinates.
- A dev-only template studio at `/dev/template-studio`:
  - It renders the same arch canvas as the form, with pen (default black/thin), eraser, undo/redo and clear.
  - It has a category + option + arch picker and "Load existing", which loads the saved template for the selected key.
  - "Copy" puts the current strokes on the clipboard as a ready-to-paste entry: rounded arch-image coordinates in the module's format.
  - A checklist shows which option/arch combinations still have no template.
- The developer draws the first real template (Hawley Retainer U/L, upper), pastes it into the module and commits it.

### Acceptance criteria

- [ ] `/dev/template-studio` works under `npm run dev` and returns 404 in a production build (`npm run build && npm start`).
- [ ] Drawing, then Copy, then pasting into the module, then Load existing reproduces the same drawing in the same place, at any browser width.
- [ ] Each pen stroke becomes one separate stroke in the copied data.
- [ ] The missing-templates checklist lists every named appliance and clasp × upper/lower, and ticks off the ones that exist.
- [ ] The Hawley upper template is committed.
- [ ] Vitest: every template point is within 388 × 453; templates are non-empty; template keys exist in the RX option list; "Other" has no entry; the coordinate conversion round-trips.
- [ ] `npm test` and `npm run typecheck` pass.

---

## Phase 2: Appliance template on the form (upper arch)

**User stories:** 1, 9, 10, 12, 13, 14, 15, 16, 17, 18, 22, 23, 26, 28, 29, 30, 31, 32

### What to build

- The RX form passes the selected appliance to the drawing component. Selecting an appliance that has a template loads its upper-arch strokes onto the canvas, scaled to the current canvas size, as normal black thin pen strokes.
- Template strokes are tracked as belonging to the appliance category:
  - Changing the appliance removes that category's remaining strokes and loads the new template.
  - The doctor's own strokes stay.
  - Choosing "Other" or an appliance without a template only removes the old template.
- Eraser, pen colours/widths and undo/redo work on top of the template, with undo history starting from the last template change.
- `hasDrawing` counts template strokes, so a template-only canvas is exported and arrives in both emails.
- After a successful submit the canvas resets to empty, and the tools stay locked during submit, as in v2.

### Acceptance criteria

- [ ] Choosing Hawley Retainer U/L draws its template on the upper arch, lined up with the teeth on desktop, tablet and phone widths.
- [ ] One eraser touch on a template line removes exactly that stroke.
- [ ] The doctor can draw on top in any colour or width, and undo/redo their edits.
- [ ] Switching appliance removes the old template's remaining lines and keeps the doctor's own lines.
- [ ] Switching to "Other - Specify Below" removes the template and adds nothing.
- [ ] Submitting with an unedited template sends the drawing in the owner and doctor emails (checked on dev/Preview with `EMAIL_OVERRIDE_TO`).
- [ ] The emailed PNG matches what was on screen: template and doctor edits.
- [ ] The canvas is empty after a successful submit, and tools are disabled while submitting.
- [ ] Vitest: the template-selection helper covers an appliance with a template, an appliance without one, "Other" and blank.
- [ ] `npm test` and `npm run typecheck` pass.

---

## Phase 3: Clasp templates alongside the appliance

**User stories:** 2, 3, 8, 24, 25

### What to build

- The RX form also passes the selected clasp. A clasp template loads as its own category on the upper arch, drawn on both first molars, one stroke (or group) per side.
- Appliance and clasp templates coexist. Swapping one category never touches the other category's strokes, including template strokes the doctor has erased or kept, or the doctor's own lines.
- The developer draws Ball Clasp upper in the studio to prove the slice.

### Acceptance criteria

- [ ] Choosing Ball Clasp draws clasps on both upper first molars.
- [ ] With an appliance and a clasp both selected, both templates show.
- [ ] Changing the clasp swaps only the clasp lines; the appliance template, including any erasures the doctor made, and the doctor's own lines stay.
- [ ] Changing the appliance swaps only the appliance lines and leaves the clasp untouched.
- [ ] Clasp "Other - Specify Below" removes the clasp template.
- [ ] Erasing one side's clasp leaves the other side.
- [ ] Vitest: the selection helper returns appliance and clasp grouped separately for appliance only, clasp only, both, and neither.
- [ ] `npm test` and `npm run typecheck` pass.

---

## Phase 4: Arch-aware templates and "Mirror to lower"

**User stories:** 4, 5, 6, 7, 27, 39

### What to build

- The RX form passes the Arch field (`position`). Templates load for the selected arch: Upper gives upper, Lower gives lower, Both gives both, and blank gives upper.
- Changing Arch swaps both categories' template strokes to the new arch and keeps the doctor's own lines.
- In the studio, "Mirror to lower" flips the current upper drawing vertically across the gap between the arches, to give a starting point for the lower version, which the developer adjusts and copies.
- The developer draws Hawley lower and Ball Clasp lower to prove the slice.

### Acceptance criteria

- [ ] Arch Upper, Lower and Both each show the templates in the right place; blank shows upper.
- [ ] Changing Arch moves the templates and keeps the doctor's own lines.
- [ ] With Both selected, appliance and clasp templates show on both arches, and each is still one erasable stroke per part.
- [ ] Mirror to lower produces a drawing on the lower arch that is close enough to only need small adjustments.
- [ ] Vitest: the selection helper covers Upper, Lower, Both and blank × appliance/clasp; the mirror helper maps upper points into the lower-arch region and stays in bounds.
- [ ] `npm test` and `npm run typecheck` pass.

---

## Phase 5: Reset to template

**User stories:** 19, 20, 21

### What to build

- A "Reset to template" toolbar button. It drops all of the doctor's edits and own lines, and reloads the clean templates for the current appliance, clasp and arch. It is disabled when no current selection has a template, and while submitting.
- Clear keeps the v2 behaviour: it wipes everything, templates included.

### Acceptance criteria

- [ ] After erasing template lines and drawing extras, Reset to template restores exactly the clean templates and removes the extras.
- [ ] Reset to template is disabled with no appliance/clasp selected, with only "Other" selected, and during submit.
- [ ] Clear empties the canvas completely. Changing a selection afterwards loads that template again.
- [ ] The button has an accessible label and tooltip matching the other tool buttons.
- [ ] `npm test` and `npm run typecheck` pass.

---

## Phase 6: Draw all templates, require completeness, write docs

**User stories:** 11, 33, 34, 35, 46

### What to build

- The developer draws every remaining template in the studio: all 17 named appliances and 3 named clasps (Adams, Ball, C), each upper and lower, about 40 in total, in the simple line style of `public/drawing-example.png`.
- A completeness test makes a missing template fail the build.
- Docs updated: a short v3 section (or summary) describing templates, the studio and how to add or edit one. The open items list in `docs/v2-summary.md` is refreshed.

### Acceptance criteria

- [ ] The studio checklist shows every option × arch as done.
- [ ] Vitest: every named appliance and clasp has non-empty upper and lower templates; "Other" has none; all points are in bounds.
- [ ] A spot check on `/rxform` at desktop and phone widths shows every appliance and clasp lining up with the teeth on upper, lower and both arches.
- [ ] Docs explain how to add or edit a template in the studio.
- [ ] Merged to `main` through a PR; Vercel production deploy verified on the live site with a test order. No Convex deploy needed.
