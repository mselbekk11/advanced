// Rules for intraoral scan uploads, shared by the form, the submit mutation
// and the owner email.

export const MAX_SCAN_BYTES = 250 * 1024 * 1024;

// More than any single case needs; stops a runaway submission.
export const MAX_SCANS = 20;

// The browser uploads each scan with the content type for its extension
// (browsers report "" or various types for .stl/.ply), so the server can check
// the stored type against the file name.
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

// Returns why an uploaded file can't be saved as a scan, or null if it's fine.
// `meta` is the file's Convex storage metadata.
export function scanUploadProblem(
  fileName: string,
  meta: { contentType?: string; size: number } | null
) {
  if (!meta) return `${fileName}: upload not found`;
  const fileProblem = scanFileProblem({ name: fileName, size: meta.size });
  if (fileProblem) return `${fileName}: ${fileProblem}`;
  if (meta.contentType !== scanContentType(fileName)) return `${fileName}: unexpected file type`;
  return null;
}

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
