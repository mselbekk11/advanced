import { describe, expect, it } from 'vitest';
import { ownerAddress, routeEmail } from './emailRouting';

const email = { to: 'doctor@example.com', subject: 'New RX: A — Dr. B' };

describe('routeEmail', () => {
  it('sends to the real recipient when no override is set', () => {
    expect(routeEmail({ EMAIL_FROM: 'rx@lab.com' }, email)).toEqual({
      from: 'rx@lab.com',
      to: 'doctor@example.com',
      subject: 'New RX: A — Dr. B',
    });
  });

  it('redirects to the override address with a [STAGING] prefix', () => {
    expect(
      routeEmail({ EMAIL_FROM: 'onboarding@resend.dev', EMAIL_OVERRIDE_TO: 'dev@example.com' }, email)
    ).toEqual({
      from: 'onboarding@resend.dev',
      to: 'dev@example.com',
      subject: '[STAGING] New RX: A — Dr. B',
    });
  });

  it('ignores a blank override', () => {
    expect(routeEmail({ EMAIL_FROM: 'rx@lab.com', EMAIL_OVERRIDE_TO: '  ' }, email).to).toBe('doctor@example.com');
  });

  it('throws when EMAIL_FROM is missing', () => {
    expect(() => routeEmail({}, email)).toThrow('EMAIL_FROM');
  });
});

describe('ownerAddress', () => {
  it('returns EMAIL_TO_OWNER', () => {
    expect(ownerAddress({ EMAIL_TO_OWNER: 'owner@lab.com' })).toBe('owner@lab.com');
  });

  it('throws when unset', () => {
    expect(() => ownerAddress({})).toThrow('EMAIL_TO_OWNER');
  });
});
