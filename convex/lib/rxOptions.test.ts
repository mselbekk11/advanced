import { describe, expect, it } from 'vitest';
import { appliances, applianceGroups, clasps, colors, positions, springs } from './rxOptions';

const allOptions = [...appliances, ...positions, ...clasps, ...springs, ...colors];

// Misspellings from the v1 form that must not come back.
const misspellings = [
  'Dugonni',
  'Hydrax',
  'Seperator',
  'Lingualarch',
  'Fluoresent',
  'Route Beer',
  'Persimon',
  'Turqouise',
  'Saphire',
  'Colbat',
  'Prutple',
  'Sunriuse',
  'Lavander',
];

describe('rx option lists', () => {
  it.each(misspellings)('contains no "%s" misspelling', (bad) => {
    expect(allOptions.filter((o) => o.includes(bad))).toEqual([]);
  });

  it('has no duplicate entries within a list', () => {
    for (const list of [appliances, positions, clasps, springs, colors]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });

  it('includes Lemon Yellow as its own color', () => {
    expect(colors).toContain('Lemon Yellow');
  });

  it('groups appliances like the paper form', () => {
    expect(applianceGroups.map((g) => g.label)).toEqual([
      'Orthodontic & Pediatric Appliances',
      'Splint / T.M.J. Appliances',
      'Other',
    ]);
    expect(applianceGroups[0].items).toHaveLength(14);
    expect(applianceGroups[1].items).toEqual([
      'Horseshoe Splint (Bruxism)',
      'Gelb/Mora',
      'Invisible Retainer/Essex',
    ]);
  });
});
