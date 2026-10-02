import { describe, expect, it } from 'vitest';
import { ownerRxSubject, rxSubmissionSchema } from './rxSubmission';

const valid = {
  first: 'Jane',
  last: 'Smith',
  email: 'jane@example.com',
  phone: '415-555-0100',
  patient: 'Alex Doe',
  appliance: 'Hawley Retainer U/L',
};

describe('rxSubmissionSchema', () => {
  it('accepts a submission with only the required fields', () => {
    expect(rxSubmissionSchema.safeParse(valid).success).toBe(true);
  });

  it.each(['first', 'last', 'email', 'phone', 'patient', 'appliance'] as const)(
    'rejects a missing %s',
    (field) => {
      const result = rxSubmissionSchema.safeParse({ ...valid, [field]: '' });
      expect(result.success).toBe(false);
    }
  );

  it('rejects whitespace-only required fields', () => {
    expect(rxSubmissionSchema.safeParse({ ...valid, patient: '   ' }).success).toBe(false);
  });

  it('rejects an appliance that is not in the list', () => {
    expect(rxSubmissionSchema.safeParse({ ...valid, appliance: 'Hydrax Rapid Palatal Expander' }).success).toBe(false);
  });

  it('accepts empty optional selects and rejects unknown options', () => {
    expect(rxSubmissionSchema.safeParse({ ...valid, color: '', clasp: '' }).success).toBe(true);
    expect(rxSubmissionSchema.safeParse({ ...valid, color: 'Lemon Yellow' }).success).toBe(true);
    expect(rxSubmissionSchema.safeParse({ ...valid, color: 'Turqouise' }).success).toBe(false);
  });

  it('accepts an ISO delivery date and rejects other formats', () => {
    expect(rxSubmissionSchema.safeParse({ ...valid, deliveryDate: '2026-10-20' }).success).toBe(true);
    expect(rxSubmissionSchema.safeParse({ ...valid, deliveryDate: '' }).success).toBe(true);
    expect(rxSubmissionSchema.safeParse({ ...valid, deliveryDate: '10/20/2026' }).success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(rxSubmissionSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
});

describe('ownerRxSubject', () => {
  it('includes patient and doctor last name', () => {
    expect(ownerRxSubject({ patient: 'Alex Doe', last: 'Smith' })).toBe('New RX: Alex Doe — Dr. Smith');
  });
});
