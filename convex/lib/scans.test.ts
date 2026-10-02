import { describe, expect, it } from 'vitest';
import {
  formatBytes,
  MAX_SCAN_BYTES,
  scanContentType,
  scanFileProblem,
  scanPathname,
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

describe('scanPathname', () => {
  it('keeps the file name as the last segment', () => {
    expect(scanPathname('abc', 'Alex Doe upper.stl')).toBe('scans/abc/Alex Doe upper.stl');
  });

  it('replaces characters that would break the path or the download name', () => {
    expect(scanPathname('abc', '../x/y?.stl')).toBe('scans/abc/.._x_y_.stl');
    expect(scanPathname('abc', 'a"b#c%.ply')).toBe('scans/abc/a_b_c_.ply');
  });

  it('never produces an empty name', () => {
    expect(scanPathname('abc', '   ')).toBe('scans/abc/scan');
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
