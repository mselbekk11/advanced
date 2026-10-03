import { describe, expect, it } from 'vitest';
import { render } from '@react-email/render';
import { DRAWING_CID } from '../convex/lib/drawing';
import { doctorRxSubject } from '../convex/lib/rxSubmission';
import RxDoctorEmail from './RxDoctorEmail';

const props = RxDoctorEmail.PreviewProps;
const sample = props.submission;

describe('RxDoctorEmail', () => {
  it('thanks the doctor and summarises the order', async () => {
    const text = await render(<RxDoctorEmail {...props} />, { plainText: true });
    expect(text).toContain('Dear Dr. Smith');
    expect(text).toContain('Thank you for your order');
    for (const v of ['Alex Doe', 'Oct 20, 2026', 'Hawley Retainer U/L', 'Upper', 'Adams Clasp', 'Spring - Specify Below', 'Purple', 'Please add a bite plane. Finger spring on UL2.']) {
      expect(text).toContain(v);
    }
    expect(text).toContain('Arch');
    expect(text).toContain('Additional information');
    expect(text).not.toMatch(/position|special instructions/i);
  });

  it('shows the drawing via its inline CID reference', async () => {
    const html = await render(<RxDoctorEmail {...props} drawingUrl={`cid:${DRAWING_CID}`} />);
    expect(html).toContain('data-section="drawing"');
    expect(html).toContain('src="cid:rx-drawing"');
  });

  it('leaves the drawing out when nothing was drawn', async () => {
    const html = await render(<RxDoctorEmail submission={sample} />);
    expect(html).not.toContain('data-section="drawing"');
    expect(html.match(/<img/g)).toHaveLength(1); // just the logo
    expect(html).toContain('email/logo-full.png');
  });

  it('names each scan without linking to it', async () => {
    const html = await render(<RxDoctorEmail {...props} />);
    for (const name of props.scanFileNames) expect(html).toContain(`data-scan="${name}"`);
    expect(html).not.toContain('/scans/');
    expect(html).not.toMatch(/<a\s/);
  });

  it('says no scans were attached when there are none', async () => {
    const html = await render(<RxDoctorEmail submission={sample} />);
    expect(html).toContain('None attached');
    expect(html).not.toContain('data-scan=');
  });

  it('shows a dash for empty optional fields', async () => {
    const html = await render(<RxDoctorEmail submission={{ ...sample, color: '', instructions: undefined }} />);
    expect(html).toMatch(/data-field="color"[\s\S]*?>—</);
    expect(html).toMatch(/data-field="instructions"[\s\S]*?>—</);
  });
});

describe('doctorRxSubject', () => {
  it('names the patient', () => {
    expect(doctorRxSubject({ patient: 'Alex Doe' })).toBe('RX received: Alex Doe — Advanced Ortho Lab');
  });
});
