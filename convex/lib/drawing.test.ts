import { describe, expect, it } from 'vitest';
import { drawingProblem, MAX_DRAWING_BYTES } from './drawing';

describe('drawingProblem', () => {
  it('accepts a PNG within the size limit', () => {
    expect(drawingProblem({ contentType: 'image/png', size: 120_000 })).toBeNull();
    expect(drawingProblem({ contentType: 'image/png', size: MAX_DRAWING_BYTES })).toBeNull();
  });

  it('rejects a missing upload', () => {
    expect(drawingProblem(null)).toMatch(/not found/);
  });

  it('rejects other content types', () => {
    expect(drawingProblem({ contentType: 'image/jpeg', size: 1000 })).toMatch(/PNG/);
    expect(drawingProblem({ size: 1000 })).toMatch(/PNG/);
  });

  it('rejects files over the limit', () => {
    expect(drawingProblem({ contentType: 'image/png', size: MAX_DRAWING_BYTES + 1 })).toMatch(/too large/);
  });
});
