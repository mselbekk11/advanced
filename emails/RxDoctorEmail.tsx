import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties } from 'react';
import type { StoredRxSubmission } from '../convex/lib/rxSubmission';
import { formatDate } from './RxOwnerEmail';

// Confirmation sent to the doctor after an RX is saved: a thank-you, the order
// summary, the drawing (if any) and the names of the attached scans. Scan
// links are deliberately left out; only the lab gets those.

// public/logo-full-png.png (386x136, shown at half size for sharp retina
// rendering), hosted in the public Blob store like the owner email's logo.
const FULL_LOGO_URL = 'https://us3x6upisyj0hvfe.public.blob.vercel-storage.com/email/logo-full.png';

const purple = '#5631c4';
const ink = '#1f2937';
const muted = '#6b7280';
const rule = '#e5e7eb';
const font = 'Helvetica, Arial, sans-serif';

type Props = {
  submission: StoredRxSubmission;
  // The doctor's drawing on the arch (a `cid:` reference); omitted if none.
  drawingUrl?: string;
  scanFileNames?: string[];
};

const orderFields: [keyof StoredRxSubmission, string][] = [
  ['patient', 'Patient'],
  ['deliveryDate', 'Due date'],
  ['appliance', 'Appliance'],
  ['position', 'Arch'],
  ['clasp', 'Clasp'],
  ['spring', 'Spring'],
  ['color', 'Color'],
  ['instructions', 'Additional information'],
];

export default function RxDoctorEmail({ submission: s, drawingUrl, scanFileNames = [] }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`We received your RX for ${s.patient}`}</Preview>
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: font, margin: 0, padding: '16px 0' }}>
        <Container style={{ maxWidth: 560, width: '100%', backgroundColor: '#ffffff' }}>
          <Section style={{ padding: '40px 20px 32px', borderBottom: `1px solid ${rule}` }}>
            <Img
              src={FULL_LOGO_URL}
              alt='Advanced Ortho Lab'
              width='193'
              height='68'
              style={{ display: 'block', margin: '0 auto', width: 193, height: 68 }}
            />
          </Section>

          <Section style={{ padding: '20px 20px 8px' }}>
            <Text style={{ ...body, margin: '0 0 12px' }}>Dear Dr. {s.last},</Text>
            <Text style={{ ...body, margin: '0 0 12px' }}>
              Thank you for your order. We&apos;ve received your RX for <strong>{s.patient}</strong>. Here is a
              summary of what you sent. If anything needs changing, just reply to this email or call us at (415)
              661-9296.
            </Text>
          </Section>

          <Section style={{ padding: '0 20px 8px' }}>
            <Text style={heading}>ORDER SUMMARY</Text>
            {orderFields.map(([field, l]) => {
              const raw = s[field];
              const shown = field === 'deliveryDate' ? formatDate(raw) : raw;
              return (
                <Row key={field} style={{ borderBottom: `1px solid ${rule}` }} data-field={field}>
                  <Column style={{ width: 150, padding: '6px 8px 6px 0', verticalAlign: 'top' }}>
                    <Text style={{ ...small, margin: 0 }}>{l}</Text>
                  </Column>
                  <Column style={{ padding: '6px 0', verticalAlign: 'top' }}>
                    <Text style={{ ...value, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {shown || '—'}
                    </Text>
                  </Column>
                </Row>
              );
            })}
          </Section>

          {drawingUrl && (
            <Section style={{ padding: '8px 20px' }} data-section='drawing'>
              <Text style={heading}>YOUR DRAWING</Text>
              <Img
                src={drawingUrl}
                alt='Your drawing on the arch'
                width='200'
                style={{ display: 'block', width: '100%', maxWidth: 200, height: 'auto' }}
              />
            </Section>
          )}

          <Section style={{ padding: '8px 20px 16px' }} data-section='scans'>
            <Text style={heading}>SCANS</Text>
            {scanFileNames.length === 0 ? (
              <Text style={{ ...value, margin: 0 }}>None attached</Text>
            ) : (
              scanFileNames.map((name, i) => (
                <Text key={name + i} style={{ ...value, margin: '0 0 4px', wordBreak: 'break-all' }} data-scan={name}>
                  {name}
                </Text>
              ))
            )}
          </Section>

          <Section style={{ backgroundColor: purple }}>
            <Text
              style={{
                margin: 0,
                padding: '8px 16px',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              ✦ OVER 45 YEARS OF EXCELLENCE ✦
            </Text>
          </Section>
          <Text style={{ ...small, textAlign: 'center', padding: '10px 16px 14px', margin: 0 }}>
            1108 Vicente Street, Suite 102, San Francisco, CA 94116
            <br />
            advancedortholabsf@gmail.com &nbsp;|&nbsp; (415) 661-9296 &nbsp;|&nbsp; www.advancedortholabsf.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: CSSProperties = { color: ink, fontSize: 14, lineHeight: '21px' };
const heading: CSSProperties = { color: purple, fontSize: 12, fontWeight: 700, lineHeight: '16px', margin: '0 0 6px' };
const small: CSSProperties = { color: muted, fontSize: 12, lineHeight: '18px' };
const value: CSSProperties = { color: ink, fontSize: 13, lineHeight: '18px', fontWeight: 600 };

RxDoctorEmail.PreviewProps = {
  submission: {
    first: 'Jane',
    last: 'Smith',
    email: 'jane@example.com',
    phone: '(415) 555-0100',
    street: '1 Market St',
    city: 'San Francisco',
    zip: '94105',
    patient: 'Alex Doe',
    deliveryDate: '2026-10-20',
    appliance: 'Hawley Retainer U/L',
    position: 'Upper',
    clasp: 'Adams Clasp',
    spring: 'Spring - Specify Below',
    color: 'Purple',
    instructions: 'Please add a bite plane. Finger spring on UL2.',
  },
  drawingUrl: 'https://www.advancedortholabsf.com/mouth.png',
  scanFileNames: ['alex-doe-upper.stl', 'alex-doe-lower.ply'],
} satisfies Props;
