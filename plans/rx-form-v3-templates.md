# PRD: Advanced Ortho Lab v3: Drawing templates on the RX form

## Problem Statement

Since v2, doctors draw the appliance design on the arch diagram in the left column of the RX form (`/rxform`). They told Advanced Ortho Lab that drawing the appliance from scratch on every order is slow and repetitive. Most orders are standard appliances, such as a Hawley retainer with ball clasps, and these look the same every time. The doctor redraws the same bow, plate outline and clasps on every order before making the small changes specific to the case. Freehand drawings with a mouse or finger also vary a lot in quality, which makes them harder for the lab to read.

## Solution

Choosing an **Appliance** or a **Clasp** on the RX form puts a simple line drawing of it on the arch diagram, ready to edit. The drawings look like the hand-drawn example in `public/drawing-example.png`.

- Only the Appliance and Clasp fields add drawings. There can be at most one appliance template and one clasp template on the canvas at a time.
- Templates follow the **Arch** field:
  - Upper shows the upper-arch version.
  - Lower shows the lower-arch version.
  - Both shows both.
  - No arch chosen shows the upper version.
- Template lines are ordinary pen strokes (black, thin), not a picture. The doctor can:
  - remove a single line with the existing eraser, which deletes a whole stroke per touch;
  - draw extra lines with the pen;
  - undo and redo their edits.
- Each logical part of a template is its own stroke, so one eraser tap removes exactly one part. Examples: the labial bow, the left clasp, the right clasp, the plate outline.
- **Changing** the appliance, clasp or arch swaps that template's lines for the new ones. Lines the doctor drew themselves stay. Choosing "Other - Specify Below" removes that category's template.
- **Clear** (trash) still wipes the whole canvas, templates included. A new **Reset to template** button throws away the doctor's edits and reloads the templates for the current appliance, clasp and arch.
- Submission and emails are unchanged. The flattened PNG already contains template and doctor lines together. A canvas with only an unedited template still counts as a drawing and is sent.

The developer draws the templates once in a local-only **template studio** page:

- It uses the same canvas over the same arch image.
- It has a "Mirror to lower" helper that turns an upper-arch drawing into a starting point for the lower one.
- It has a "Copy" button that exports the strokes as data, which is committed to the codebase.

## User Stories

### Doctor: getting a template

1. As a doctor, I want a line drawing of the appliance to appear on the arch when I pick it from the Appliance list, so that I don't have to draw it from scratch.
2. As a doctor, I want a line drawing of the clasp to appear on the arch when I pick a clasp, so that the retention is shown without me drawing it.
3. As a doctor, I want the appliance and clasp drawings to appear together when I pick both, so that the arch shows the complete design.
4. As a doctor, I want the template to appear on the upper arch when I set Arch to Upper, so that it matches the arch I'm ordering for.
5. As a doctor, I want the template to appear on the lower arch when I set Arch to Lower, so that a lower appliance is drawn in the right place.
6. As a doctor, I want the template drawn on both arches when I set Arch to Both, so that both appliances are shown.
7. As a doctor, I want a template to appear on the upper arch even before I choose an arch, so that I see something useful straight away.
8. As a doctor, I want the clasp template drawn on both first molars, so that it matches the most common placement.
9. As a doctor, I want template lines to look like my own black pen lines, so that the final drawing reads as one clean picture.
10. As a doctor, I want templates to be simple line drawings like the paper form sketches, so that they're easy to read and adjust.
11. As a doctor, I want every named appliance (all 17) and every named clasp (Adams, Ball, C) to have a template, so that I get help whatever I order.
12. As a doctor, I want "Other - Specify Below" to add no drawing, so that I'm not given a template that doesn't match my custom request.
13. As a doctor, I want the template drawn at the right size on my phone, tablet or desktop, so that it lines up with the teeth on any screen.

### Doctor: editing a template

14. As a doctor, I want to erase a single template line (for example, one clasp) with the eraser, so that I can remove parts my case doesn't need.
15. As a doctor, I want one eraser touch to remove a whole part of the template, so that I don't have to scrub away a line piece by piece.
16. As a doctor, I want to draw extra lines on top of the template with the pen, so that I can add case-specific details.
17. As a doctor, I want to use any pen colour and width on top of a template, so that I can make my additions stand out if I want.
18. As a doctor, I want undo and redo to work for my edits on a template, so that I can fix mistakes.
19. As a doctor, I want a "Reset to template" button, so that I can throw away my edits and start again from the clean template.
20. As a doctor, I want "Reset to template" to be unavailable when no appliance or clasp with a template is selected, so that the button never does something confusing.
21. As a doctor, I want the Clear button to still wipe the whole canvas, so that I can start completely blank if I prefer.
22. As a doctor, I want to be able to erase the whole template and draw my own design instead, so that templates never limit me.

### Doctor: changing selections

23. As a doctor, I want changing the appliance to replace the old appliance drawing with the new one, so that the arch never shows two appliances.
24. As a doctor, I want changing the clasp to replace the old clasp drawing with the new one, so that the arch never shows two clasp types.
25. As a doctor, I want changing the appliance to leave the clasp template and my own lines alone, so that I don't lose unrelated work.
26. As a doctor, I want lines I drew myself to stay when a template is swapped, so that my additions survive a change of mind.
27. As a doctor, I want changing the Arch field to move the templates to the newly chosen arch, so that the drawing always matches the arch I ordered.
28. As a doctor, I want switching the appliance or clasp to "Other - Specify Below" to remove that category's template, so that the drawing matches what I've chosen.
29. As a doctor, I want the canvas to start empty after a successful submission, so that the next order starts clean (as in v2).

### Doctor: submitting

30. As a doctor, I want a template-only drawing (one I didn't edit) to be sent with my order, so that the lab sees the design even if I accepted it as is.
31. As a doctor, I want my submitted drawing to look exactly like what I saw on screen, templates and edits included, so that the lab builds what I designed.
32. As a doctor, I want the drawing tools to be locked while the order is submitting, as in v2, so that the drawing can't change mid-submit.

### Lab owner

33. As the lab owner, I want drawings from doctors to start from consistent, standard templates, so that orders are quicker and easier to read.
34. As the lab owner, I want the drawing in my email to show the template and the doctor's changes together, as one image as today, so that nothing about my workflow changes.
35. As the lab owner, I want templates to be simple lines in the style of the paper form, so that they read like the drawings I'm used to.

### Developer: authoring templates

36. As the developer, I want a local-only template studio page that uses the same canvas and arch image as the form, so that templates line up exactly with what doctors see.
37. As the developer, I want to choose which option and arch (upper or lower) I'm drawing in the studio, so that each template is saved under the right key.
38. As the developer, I want each pen stroke I make in the studio to become one separately erasable part, so that I control how doctors can remove pieces.
39. As the developer, I want a "Mirror to lower" button that flips my upper drawing onto the lower arch, so that I only need to adjust lower versions instead of redrawing them.
40. As the developer, I want undo, redo, the eraser and clear in the studio, so that I can refine templates easily.
41. As the developer, I want a "Copy" button that puts the template data on the clipboard in the format the code expects, so that I can paste it straight into the template file.
42. As the developer, I want the studio to load existing templates for editing, so that I can tweak one later without starting over.
43. As the developer, I want the studio to show which options still have no upper or lower template, so that I know what's left to draw.
44. As the developer, I want template coordinates stored relative to the arch image (388 × 453), so that templates scale to any rendered canvas size.
45. As the developer, I want the studio to be unavailable in production builds, so that doctors never see it.
46. As the developer, I want unit tests to fail if any named appliance or clasp is missing an upper or lower template, so that templates stay complete when options change.
47. As the developer, I want unit tests to check that all template points are inside the arch image, so that a bad paste can't put lines off the canvas.
48. As the developer, I want template data keyed by the option names in the shared option list, so that a renamed option shows up as a test failure instead of a template that silently goes missing.

## Implementation Decisions

**Template format and storage**

- A template is a list of strokes. Each stroke is an ordered list of points in arch-image coordinates (the 388 × 453 space of `mouth.png`). Colour and width are not stored: templates always render as the default black, thin pen.
- Templates are stored in a new shared module next to the RX option list. It is keyed by option name (from the existing option list), then by arch (`upper` / `lower`). There are two categories: appliance and clasp.
- "Other - Specify Below" has no entry, by design. Spring and colour never have templates.
- A pure helper, for example `templateStrokesFor(appliance, clasp, arch)`, returns the strokes to show:
  - It returns up to two templates per selected arch (one appliance, one clasp).
  - "Both" means upper plus lower.
  - A blank arch means upper.
  - The result is grouped by category so the canvas can swap one category on its own.
- Scaling from arch-image coordinates to the rendered canvas size happens when strokes are loaded, using the canvas's current width. The canvas keeps the arch image's aspect ratio. As in v2, strokes already on the canvas are not rescaled if the window is resized after they were drawn.

**Drawing component (ArchDrawing)**

- New input: the current appliance, clasp and arch (or the resolved template strokes), passed in from the RX form.
- The component tracks which strokes on the canvas came from which template category, by stroke identity or signature. This is how a swap removes only that category's remaining lines and keeps the doctor's own strokes. Template lines the doctor already erased are not brought back by a swap of the *other* category.
- Swapping or resetting rebuilds the path list (keep the doctor's strokes, drop the old template strokes, add the new template strokes) using the canvas library's reset and `loadPaths`. **Undo/redo history is cleared on a template swap or reset.** Undo covers the doctor's edits since the last template change.
- The eraser stays in stroke mode, so one touch removes one whole stroke.
- The toolbar gets a "Reset to template" button. It reloads the current templates and drops all non-template strokes and edits. It is disabled when no selection has a template. Clear keeps its v2 behaviour of wiping everything.
- `hasDrawing()` is true whenever any drawing stroke is on the canvas, template strokes included, so an unedited template is exported and sent.
- The existing export (776 × 906 PNG, arch image plus strokes) is unchanged.

**RX form**

- The form watches `appliance`, `clasp` and `position` (shown as Arch) and passes them to the drawing component. No schema, validation or stored-field changes.

**Template studio**

- A dev-only route. It renders nothing (404) unless running under `next dev`, and is never linked from the site.
- It reuses the arch canvas with pen, eraser, undo/redo and clear, plus:
  - an option and arch picker;
  - "Load existing";
  - "Mirror to lower", which flips the strokes vertically around the gap between the arches, as a starting point for hand adjustment;
  - "Copy", which serialises strokes to arch-image coordinates, rounded, in the template module's format;
  - a checklist of missing templates.
- Template strokes are drawn by the developer, one stroke per logical part. Clasp templates are drawn on both first molars, one stroke (or group) per side.

**Backend and emails**

- No changes to Convex, the submission schema, emails or storage. No `npx convex deploy` is needed for this feature.

**Tests (Vitest)**

- Template completeness: every named appliance and clasp has both upper and lower templates, and "Other" has none.
- Bounds: every point is within 388 × 453.
- Each template is non-empty.
- Template-selection helper: covers Upper, Lower, Both and blank arch, "Other", and appliance only, clasp only, or both.
- Coordinate scaling helper: arch-image coordinates to canvas coordinates and back.
- Mirror helper.

## Out of Scope

- Choosing which teeth a clasp goes on. Clasps are fixed on both first molars; the doctor erases or adds by hand. This, like the paper form's per-clasp tooth positions, stays in the v2 open items.
- Multi-select appliances or clasps. Fields stay single-select, so there is at most one template per category.
- Templates for Spring, Colour or "Other".
- Erasing part of a stroke (pixel eraser). Removal is per whole stroke.
- Any email or data change, such as recording which template was used or whether it was edited.
- Letting the lab owner author or edit templates in production, or storing templates in the database.
- Text or symbol stamps on the drawing.
- Rescaling existing strokes when the browser window is resized mid-drawing (unchanged from v2).
- Keeping undo history across template swaps.

## Further Notes

- The canvas is `react-sketch-canvas` v8. It exposes `loadPaths` and `exportPaths` with a `CanvasPath` format (points, colour, width, draw mode) and supports `eraserMode="stroke"`. This is why templates can be plain strokes rather than images.
- The work splits into roughly 40 drawings (20 options × upper/lower). With "Mirror to lower", each lower version is a quick adjustment. Templates can be added gradually during development, but the completeness test must pass before release.
- Reference for the drawing style: `public/drawing-example.png`. Reference for appliance shapes: the paper form `public/rx-form.pdf` and the appliance images in `public/`.
- When done, update the open items in `docs/v2-summary.md` (or a new v3 summary) to note that templates exist.
