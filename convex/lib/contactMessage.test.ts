import { describe, expect, it } from 'vitest';
import { contactMessageSchema, contactSubject } from './contactMessage';

const valid = { first: 'Sam', last: 'Lee', email: 'sam@example.com', message: 'Do you make night guards?' };

describe('contactMessageSchema', () => {
  it('accepts a message without a phone number', () => {
    expect(contactMessageSchema.safeParse(valid).success).toBe(true);
  });

  it.each(['first', 'last', 'email', 'message'] as const)('rejects a missing %s', (field) => {
    expect(contactMessageSchema.safeParse({ ...valid, [field]: '' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(contactMessageSchema.safeParse({ ...valid, email: 'sam@' }).success).toBe(false);
  });

  it('rejects a whitespace-only message', () => {
    expect(contactMessageSchema.safeParse({ ...valid, message: '   ' }).success).toBe(false);
  });

  it('trims fields', () => {
    expect(contactMessageSchema.parse({ ...valid, first: '  Sam ' }).first).toBe('Sam');
  });
});

describe('contactSubject', () => {
  it('names the visitor', () => {
    expect(contactSubject(valid)).toBe('New contact message: Sam Lee');
  });
});
