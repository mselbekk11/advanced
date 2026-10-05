// Rules for the doctor's arch drawing, shared by the form, the submit
// mutation and the owner email.

// The drawing is exported at 2x the arch image (public/mouth.png, 388x453).
export const DRAWING_EXPORT_SIZE = { width: 776, height: 906 } as const;

// A flattened 776x906 PNG is well under 1 MB; anything near this is not ours.
export const MAX_DRAWING_BYTES = 5 * 1024 * 1024;

export const DRAWING_CONTENT_TYPE = 'image/png';

// Content-ID of the inline drawing attachment, referenced as `cid:` in the email.
export const DRAWING_CID = 'rx-drawing';

// Returns why the uploaded file can't be used as the drawing, or null if it's fine.
export function drawingProblem(meta: { contentType?: string; size: number } | null) {
  if (!meta) return 'Drawing upload not found';
  if (meta.contentType !== DRAWING_CONTENT_TYPE) return 'Drawing must be a PNG image';
  if (meta.size > MAX_DRAWING_BYTES) return 'Drawing is too large';
  return null;
}
