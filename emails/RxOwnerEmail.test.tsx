import { describe, expect, it } from 'vitest';
import { render } from '@react-email/render';
import { DRAWING_CID } from '../convex/lib/drawing';
import { appliances, OTHER_APPLIANCE } from '../convex/lib/rxOptions';
import RxOwnerEmail, { BLANK_ARCH_URL, formatDate } from './RxOwnerEmail';

const sample = RxOwnerEmail.PreviewProps.submission;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The checked state of the row for `name:option`, read from its data attributes.
function checkedState(html: string, name: string, option: string) {
  const attr = `${name}:${option}`.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return html.match(new RegExp(`data-option="${escapeRe(attr)}" data-checked="(true|false)"`))?.[1];
}

describe('RxOwnerEmail', () => {
  it('ticks the chosen appliance and leaves every other appliance unticked', async () => {
    const html = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />);
    for (const a of appliances) {
      expect(checkedState(html, 'appliance', a), a).toBe(a === sample.appliance ? 'true' : 'false');
    }
  });

  it('ticks the chosen clasp, spring and arch', async () => {
    const html = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />);
    expect(checkedState(html, 'clasp', 'Adams Clasp')).toBe('true');
    expect(checkedState(html, 'clasp', 'Ball Clasp')).toBe('false');
    expect(checkedState(html, 'spring', 'Spring - Specify Below')).toBe('true');
    expect(checkedState(html, 'spring', 'No Spring')).toBe('false');
    expect(checkedState(html, 'position', 'Upper')).toBe('true');
    expect(checkedState(html, 'position', 'Both')).toBe('false');
  });

  it('shows the doctor and patient details, colour and instructions', async () => {
    const text = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />, { plainText: true });
    expect(text).toContain('Jane Smith');
    expect(text).toContain('1 Market St, San Francisco 94105');
    expect(text).toContain('(415) 555-0100');
    expect(text).toContain('jane@example.com');
    expect(text).toContain('Alex Doe');
    expect(text).toContain('Oct 20, 2026');
    expect(text).toContain('Purple');
    expect(text).toContain('Please add a bite plane. Finger spring on UL2.');
    expect(text).toContain('ADDITIONAL INFORMATION:');
    expect(text).toContain('ARCH');
    expect(text).not.toMatch(/position|special instructions/i);
    expect(text).toContain('APPLIANCES PRESCRIPTION');
    expect(text).toContain('OVER 45 YEARS OF EXCELLENCE');
  });

  it('shows the blank arch by default', async () => {
    const html = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />);
    expect(html).toContain(`src="${BLANK_ARCH_URL}"`);
  });

  it('shows the drawing via its inline CID reference when one is passed', async () => {
    const html = await render(
      <RxOwnerEmail {...RxOwnerEmail.PreviewProps} archImageUrl={`cid:${DRAWING_CID}`} />
    );
    expect(html).toContain('src="cid:rx-drawing"');
    expect(html).not.toContain(BLANK_ARCH_URL);
  });

  it('shows the instructions next to "Other" when Other is chosen', async () => {
    const html = await render(
      <RxOwnerEmail
        submission={{ ...sample, appliance: OTHER_APPLIANCE, instructions: 'Twin block, see notes' }}
      />
    );
    expect(checkedState(html, 'appliance', OTHER_APPLIANCE)).toBe('true');
    expect(html).toMatch(/OTHER|Other/);
    expect(html.match(/Twin block, see notes/g)?.length).toBe(2);
  });

  it('shows a dash for empty fields (older rows may lack additional information)', async () => {
    const html = await render(
      <RxOwnerEmail submission={{ ...sample, color: '', instructions: undefined, deliveryDate: '' }} />
    );
    expect(html).toMatch(/data-field="color"[^>]*>—</);
    expect(html).toMatch(/data-field="instructions"[^>]*>—</);
  });
});

describe('formatDate', () => {
  it('formats ISO dates without timezone drift', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
    expect(formatDate('')).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('lists every scan with its name, readable size and download link', async () => {
    const html = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />);
    const text = await render(<RxOwnerEmail {...RxOwnerEmail.PreviewProps} />, { plainText: true });
    for (const scan of RxOwnerEmail.PreviewProps.scans) {
      expect(html).toContain(`data-scan="${scan.fileName}"`);
      expect(html).toContain(`href="${scan.url.replace(/&/g, '&amp;')}"`);
    }
    expect(text).toContain('46 MB');
    expect(text).toContain('203 MB');
  });

  it('says no scans were attached when there are none', async () => {
    const html = await render(<RxOwnerEmail submission={sample} />);
    expect(html).toContain('data-section="scans"');
    expect(html).toContain('None attached');
    expect(html).not.toContain('data-scan=');
  });

  it('flags a scan that never finished uploading, without a link', async () => {
    const html = await render(
      <RxOwnerEmail submission={sample} scans={[{ fileName: 'lost.stl' }]} />
    );
    expect(html).toContain('data-scan="lost.stl"');
    expect(html).toContain('Upload missing');
    expect(html).not.toContain('Download');
  });
});
