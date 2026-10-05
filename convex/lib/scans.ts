// Rules for intraoral scan uploads, shared by the form, the upload-token
// action and the owner email. Scans are stored in Vercel Blob, which (unlike
// Convex storage) serves them under their file name.

export const MAX_SCAN_BYTES = 250 * 1024 * 1024;

// More than any single case needs; stops a runaway submission.
export const MAX_SCANS = 20;

// The browser uploads each scan with the content type for its extension
// (browsers report "" or various types for .stl/.ply); the upload token only
// allows that type.
export const SCAN_CONTENT_TYPES = {
  stl: 'model/stl',
  ply: 'model/x-ply',
} as const;

export const SCAN_ACCEPT = Object.keys(SCAN_CONTENT_TYPES)
  .map((ext) => `.${ext}`)
  .join(',');

export function scanContentType(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return fileName.includes('.') && ext in SCAN_CONTENT_TYPES
    ? SCAN_CONTENT_TYPES[ext as keyof typeof SCAN_CONTENT_TYPES]
    : null;
}

// Returns why the picked file can't be uploaded as a scan, or null if it's fine.
export function scanFileProblem(file: { name: string; size: number }) {
  if (!scanContentType(file.name)) return 'Only .stl and .ply scan files can be uploaded';
  if (file.size === 0) return 'This file is empty';
  if (file.size > MAX_SCAN_BYTES) return `Scans must be ${formatBytes(MAX_SCAN_BYTES)} or smaller`;
  return null;
}

// Characters that can't go in a blob pathname segment or a download file name.
const UNSAFE_NAME_CHARS = /[\/\\?#%"<>|:*\u0000-\u001f\u007f]/g;

// Where a scan is stored in Vercel Blob. The random folder keeps the link
// unguessable while the last segment stays the doctor's file name, which is
// what the owner's browser saves it as.
export function scanPathname(folder: string, fileName: string) {
  const safe = fileName.replace(UNSAFE_NAME_CHARS, '_').trim() || 'scan';
  return `scans/${folder}/${safe}`;
}

// How long a browser has to finish one upload. Blob's default is 30 seconds,
// far too short for a 250 MB scan on a slow connection.
export const SCAN_UPLOAD_WINDOW_MS = 2 * 60 * 60 * 1000;

// 209715200 -> "200 MB". Binary units, labelled the way people expect.
export function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${i === 0 ? n : n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
}
