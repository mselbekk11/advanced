import { describe, expect, it } from 'vitest';
import { render } from '@react-email/render';
import ContactOwnerEmail from './ContactOwnerEmail';

const sample = ContactOwnerEmail.PreviewProps.message;

describe('ContactOwnerEmail', () => {
  it("shows the visitor's details and message", async () => {
    const text = await render(<ContactOwnerEmail message={sample} />, { plainText: true });
    expect(text).toContain('Sam Lee');
    expect(text).toContain('sam@example.com');
    expect(text).toContain('(415) 555-0199');
    expect(text).toContain('Hi, do you make night guards?');
    expect(text).toContain('We would like to send a few cases next week.');
  });

  it('links the email address and phone', async () => {
    const html = await render(<ContactOwnerEmail message={sample} />);
    expect(html).toContain('href="mailto:sam@example.com"');
    expect(html).toContain('href="tel:(415) 555-0199"');
  });

  it('shows a dash when no phone was given', async () => {
    const html = await render(<ContactOwnerEmail message={{ ...sample, phone: undefined }} />);
    expect(html).not.toContain('href="tel:');
    expect(html).toMatch(/data-field="phone"[\s\S]*?>—</);
  });

  it('escapes HTML in the message', async () => {
    const html = await render(<ContactOwnerEmail message={{ ...sample, message: '<script>x</script>' }} />);
    expect(html).not.toContain('<script>x</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
