import { describe, expect, it } from 'vitest';
import { render } from '@react-email/render';
import RxOwnerEmail from './RxOwnerEmail';

describe('RxOwnerEmail', () => {
  it('renders every submitted field', async () => {
    const html = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />);
    expect(html).toContain('Alex Doe');
    expect(html).toContain('Hawley Retainer U/L');
    expect(html).toContain('jane@example.com');
    expect(html).toContain('Please add a bite plane.');
  });

  it('shows a dash for empty optional fields', async () => {
    const text = await render(
      <RxOwnerEmail
        submission={{ ...RxOwnerEmail.PreviewProps.submission, clasp: undefined }}
      />,
      { plainText: true }
    );
    expect(text).toContain('Clasp: —');
  });
});
