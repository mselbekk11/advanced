import { describe, expect, it } from 'vitest';
import {
  formatBytes,
  MAX_SCAN_BYTES,
  scanContentType,
  scanFileProblem,
  scanUploadProblem,
} from './scans';

describe('scanContentType', () => {
  it('maps .stl and .ply, case-insensitively', () => {
    expect(scanContentType('upper.stl')).toBe('model/stl');
    expect(scanContentType('LOWER.STL')).toBe('model/stl');
    expect(scanContentType('bite.ply')).toBe('model/x-ply');
  });

  it('rejects other or missing extensions', () => {
    expect(scanContentType('scan.obj')).toBeNull();
    expect(scanContentType('scan.stl.zip')).toBeNull();
    expect(scanContentType('stl')).toBeNull();
  });
});

describe('scanFileProblem', () => {
  it('accepts scans up to the limit', () => {
    expect(scanFileProblem({ name: 'upper.stl', size: 1 })).toBeNull();
    expect(scanFileProblem({ name: 'upper.ply', size: MAX_SCAN_BYTES })).toBeNull();
  });

  it('rejects the wrong type', () => {
    expect(scanFileProblem({ name: 'photo.jpg', size: 100 })).toMatch(/\.stl and \.ply/);
  });

  it('rejects empty files and files over 250 MB', () => {
    expect(scanFileProblem({ name: 'upper.stl', size: 0 })).toMatch(/empty/);
    expect(scanFileProblem({ name: 'upper.stl', size: MAX_SCAN_BYTES + 1 })).toMatch(/250 MB/);
  });
});

describe('scanUploadProblem', () => {
  it('accepts a stored file whose type matches its name', () => {
    expect(scanUploadProblem('upper.stl', { contentType: 'model/stl', size: 1000 })).toBeNull();
  });

  it('rejects a missing upload', () => {
    expect(scanUploadProblem('upper.stl', null)).toMatch(/not found/);
  });

  it('rejects a stored type that does not match the name', () => {
    expect(scanUploadProblem('upper.stl', { contentType: 'image/png', size: 1000 })).toMatch(/type/);
    expect(scanUploadProblem('upper.stl', { size: 1000 })).toMatch(/type/);
  });

  it('rejects by the stored size, not the claimed one', () => {
    expect(scanUploadProblem('upper.stl', { contentType: 'model/stl', size: MAX_SCAN_BYTES + 1 })).toMatch(
      /250 MB/
    );
  });

  it('rejects a disallowed name', () => {
    expect(scanUploadProblem('upper.exe', { contentType: 'model/stl', size: 10 })).toMatch(/\.stl/);
  });
});

describe('formatBytes', () => {
  it('formats readable sizes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(200 * 1024 * 1024)).toBe('200 MB');
    expect(formatBytes(MAX_SCAN_BYTES)).toBe('250 MB');
  });
});
