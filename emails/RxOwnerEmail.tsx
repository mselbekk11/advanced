import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties, ReactNode } from 'react';
import { applianceGroups, clasps, OTHER_APPLIANCE, positions, springs } from '../convex/lib/rxOptions';
import type { StoredRxSubmission } from '../convex/lib/rxSubmission';
import { formatBytes } from '../convex/lib/scans';

// Owner notification laid out like the paper RX form (public/rx-form.pdf).
// Built from tables (Section/Row/Column) and inline styles so it holds up in
// Gmail web and mobile. Images must be absolute URLs; Gmail doesn't render SVG.

const SITE_URL = 'https://www.advancedortholabsf.com';
export const BLANK_ARCH_URL = `${SITE_URL}/mouth.png`;
// public/logo-png.png, hosted in the public Blob store so it loads before the
// v2 cutover puts it on the production site.
export const LOGO_URL = 'https://us3x6upisyj0hvfe.public.blob.vercel-storage.com/email/logo.png';
const LOGO_SIZE = 64;

const purple = '#5631c4';
const purpleTint = '#efebfb';
const ink = '#1f2937';
const muted = '#6b7280';
const rule = '#d6d0ee';

const font = 'Helvetica, Arial, sans-serif';

// A scan without a url never finished uploading.
export type EmailScan = { fileName: string; size?: number; url?: string };

type Props = {
  submission: StoredRxSubmission;
  // Image shown in the left column: the doctor's drawing, or the blank arch.
  archImageUrl?: string;
  // Uploaded scans with their permanent download links.
  scans?: EmailScan[];
};

export default function RxOwnerEmail({ submission, archImageUrl = BLANK_ARCH_URL, scans = [] }: Props) {
  const s = submission;
  const address = [s.street, [s.city, s.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');

  return (
    <Html>
      <Head />
      <Preview>{`New RX for ${s.patient} from Dr. ${s.first} ${s.last}`}</Preview>
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: font, margin: 0, padding: '16px 0' }}>
        <Container style={{ maxWidth: 640, width: '100%', backgroundColor: '#ffffff' }}>
          {/* Header: lab details | doctor & patient block */}
          <Section style={{ padding: '20px 20px 16px' }}>
            <Row>
              <Column style={{ width: '44%', verticalAlign: 'top', paddingRight: 12 }}>
                <LabLogo />
                <Text style={small}>1108 Vicente Street, Suite 102</Text>
                <Text style={small}>San Francisco, CA 94116</Text>
                <Text style={small}>(415) 661-9296</Text>
                <Text style={small}>www.advancedortholabsf.com</Text>
              </Column>
              <Column style={{ width: '56%', verticalAlign: 'top', paddingLeft: 12, borderLeft: `2px solid ${rule}` }}>
                <HeaderField label='Dr.' value={`${s.first} ${s.last}`} />
                <HeaderField label='Address' value={address} />
                <HeaderField label='Phone' value={s.phone} />
                <HeaderField label='Email' value={s.email} />
                <HeaderField label='Patient' value={s.patient} />
                <HeaderField label='Due date' value={formatDate(s.deliveryDate)} />
              </Column>
            </Row>
          </Section>

          {/* Purple prescription bar */}
          <Section style={{ backgroundColor: purple }}>
            <Text
              style={{
                margin: 0,
                padding: '12px 16px',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              APPLIANCES PRESCRIPTION
            </Text>
          </Section>

          {/* Two columns: arch & options | appliance checklist */}
          <Section style={{ padding: '16px 20px 8px' }}>
            <Row>
              <Column style={{ width: '44%', verticalAlign: 'top', paddingRight: 12 }}>
                <Text style={{ ...label, margin: 0, textAlign: 'center' }}>DESIGN CASE ABOVE</Text>
                <Text style={{ ...small, textAlign: 'center', marginBottom: 6 }}>(USE SYMBOLS)</Text>
                <Img
                  src={archImageUrl}
                  alt='Arch diagram'
                  width='200'
                  style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: 200, height: 'auto' }}
                />

                <SubHeading>Clasp</SubHeading>
                {clasps.map((c) => (
                  <CheckRow key={c} name='clasp' option={c} checked={s.clasp === c} />
                ))}
                <SubHeading>Spring</SubHeading>
                {springs.map((sp) => (
                  <CheckRow key={sp} name='spring' option={sp} checked={s.spring === sp} />
                ))}
                <SubHeading>Arch</SubHeading>
                {positions.map((p) => (
                  <CheckRow key={p} name='position' option={p} checked={s.position === p} />
                ))}

                <Section
                  style={{ marginTop: 12, backgroundColor: purpleTint, borderRadius: 6, padding: '8px 10px' }}
                >
                  <Text style={{ ...label, margin: 0 }}>APPLIANCE COLOR:</Text>
                  <Text style={{ ...value, margin: '4px 0 0' }} data-field='color'>
                    {s.color || '—'}
                  </Text>
                </Section>
              </Column>

              <Column style={{ width: '56%', verticalAlign: 'top', paddingLeft: 12, borderLeft: `2px solid ${rule}` }}>
                {applianceGroups.map((group) => (
                  <Section key={group.label} style={{ marginBottom: 6 }}>
                    {group.label !== 'Other' && <GroupPill>{group.label}</GroupPill>}
                    {group.items.map((a) => (
                      <CheckRow
                        key={a}
                        name='appliance'
                        option={a === OTHER_APPLIANCE ? 'Other' : a}
                        value={a}
                        checked={s.appliance === a}
                        note={a === OTHER_APPLIANCE && s.appliance === a ? s.instructions : undefined}
                        ruled
                      />
                    ))}
                  </Section>
                ))}
                <Section
                  style={{ marginTop: 6, backgroundColor: purpleTint, borderRadius: 6, padding: '6px 10px' }}
                >
                  <Text style={{ ...label, margin: 0, fontSize: 11 }}>
                    FUNCTIONAL APPLIANCES AVAILABLE
                    <br />
                    RUSH ORDERS AVAILABLE
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Additional information box */}
          <Section style={{ padding: '4px 20px 16px' }}>
            <Section style={{ border: `2px solid ${purple}`, borderRadius: 8, padding: '8px 12px' }}>
              <Text style={{ ...label, margin: 0 }}>ADDITIONAL INFORMATION:</Text>
              <Text style={{ ...value, margin: '6px 0 0', whiteSpace: 'pre-wrap' }} data-field='instructions'>
                {s.instructions || '—'}
              </Text>
            </Section>
          </Section>

          {/* Scans: one row per uploaded file, with its download link */}
          <Section style={{ padding: '0 20px 16px' }} data-section='scans'>
            <Section style={{ border: `2px solid ${purple}`, borderRadius: 8, padding: '8px 12px' }}>
              <Text style={{ ...label, margin: 0 }}>SCANS:</Text>
              {scans.length === 0 ? (
                <Text style={{ ...value, margin: '6px 0 0' }}>None attached</Text>
              ) : (
                scans.map((scan, i) => (
                  <Row
                    key={scan.fileName + i}
                    data-scan={scan.fileName}
                    style={i < scans.length - 1 ? { borderBottom: `1px solid ${rule}` } : undefined}
                  >
                    <Column style={{ padding: '6px 8px 6px 0', verticalAlign: 'middle' }}>
                      <Text style={{ ...value, margin: 0, wordBreak: 'break-all' }}>{scan.fileName}</Text>
                      <Text style={{ ...small, margin: 0 }}>
                        {scan.url && scan.size !== undefined
                          ? formatBytes(scan.size)
                          : 'Upload missing. Please ask the doctor to resend this scan.'}
                      </Text>
                    </Column>
                    <Column style={{ width: 90, padding: '6px 0', verticalAlign: 'middle', textAlign: 'right' }}>
                      {scan.url && (
                      <Link
                        href={scan.url}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: purple,
                          color: '#ffffff',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Download
                      </Link>
                      )}
                    </Column>
                  </Row>
                ))
              )}
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: purple }}>
            <Text
              style={{
                margin: 0,
                padding: '8px 16px',
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 4,
              }}
            >
              ✦ OVER 45 YEARS OF EXCELLENCE ✦
            </Text>
          </Section>
          <Text style={{ ...small, textAlign: 'center', padding: '10px 16px 14px', margin: 0 }}>
            advancedortholabsf@gmail.com &nbsp;|&nbsp; (415) 661-9296 &nbsp;|&nbsp; www.advancedortholabsf.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// "2026-10-20" -> "Oct 20, 2026". Dates are calendar days, so format in UTC.
export function formatDate(date?: string) {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
}

function HeaderField({ label: l, value: v }: { label: string; value?: string }) {
  return (
    <Row style={{ borderBottom: `1px solid ${rule}` }}>
      <Column style={{ width: 72, padding: '5px 6px 5px 0', verticalAlign: 'bottom' }}>
        <Text style={{ ...small, margin: 0, fontSize: 11, lineHeight: '15px', textTransform: 'uppercase' }}>{l}</Text>
      </Column>
      <Column style={{ padding: '5px 0', verticalAlign: 'bottom' }}>
        <Text style={{ ...value, margin: 0, wordBreak: 'break-word' }}>{v || '—'}</Text>
      </Column>
    </Row>
  );
}

function CheckRow({
  name,
  option,
  value: optionValue = option,
  checked,
  note,
  ruled,
}: {
  name: string;
  option: string;
  value?: string;
  checked: boolean;
  note?: string;
  ruled?: boolean;
}) {
  return (
    <Row
      style={ruled ? { borderBottom: '1px solid #eeeeee' } : undefined}
      data-option={`${name}:${optionValue}`}
      data-checked={checked ? 'true' : 'false'}
    >
      <Column style={{ width: 20, padding: '3px 0', verticalAlign: 'top' }}>
        <Box checked={checked} />
      </Column>
      <Column style={{ padding: '3px 0', verticalAlign: 'top' }}>
        <Text
          style={{
            margin: 0,
            fontSize: 12,
            lineHeight: '16px',
            textTransform: 'uppercase',
            color: checked ? purple : ink,
            fontWeight: checked ? 700 : 400,
          }}
        >
          {option}
          {note ? <span style={{ textTransform: 'none', fontWeight: 400, color: ink }}>: {note}</span> : null}
        </Text>
      </Column>
    </Row>
  );
}

// Drawn with a bordered table cell rather than ☐/☑, which some mail clients
// turn into emoji.
function Box({ checked }: { checked: boolean }) {
  return (
    <table cellPadding={0} cellSpacing={0} role='presentation' style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td
            style={{
              width: 12,
              height: 12,
              border: `1.5px solid ${checked ? purple : '#9ca3af'}`,
              backgroundColor: checked ? purple : '#ffffff',
              color: '#ffffff',
              fontSize: 10,
              lineHeight: '12px',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            {checked ? '✓' : ' '}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Logo on the left; name and "since 1982" stacked to the logo's height, like the paper form.
function LabLogo() {
  const line = <div style={{ height: 1, lineHeight: '1px', fontSize: 1, backgroundColor: purple }}>&nbsp;</div>;
  return (
    <Row style={{ marginBottom: 10 }}>
      <Column style={{ width: LOGO_SIZE, verticalAlign: 'middle', paddingRight: 10 }}>
        <Img
          src={LOGO_URL}
          alt='Advanced Ortho Lab'
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          style={{ display: 'block', width: LOGO_SIZE, height: LOGO_SIZE }}
        />
      </Column>
      {/* Shrinks to the name's width (the spacer column takes the rest), so the
          logo lines up with the address below and the rules span the name. */}
      <Column style={{ width: 1, whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
        <Text style={{ margin: 0, fontSize: 21, lineHeight: '23px', fontWeight: 800, color: '#111827' }}>
          Advanced
          <br />
          Ortho Lab
        </Text>
        <Row style={{ marginTop: 4 }}>
          <Column style={{ verticalAlign: 'middle' }}>{line}</Column>
          <Column style={{ width: 1, whiteSpace: 'nowrap', verticalAlign: 'middle', padding: '0 6px' }}>
            <Text style={{ ...label, margin: 0, fontSize: 10, lineHeight: '14px', letterSpacing: 1.5 }}>
              SINCE 1982
            </Text>
          </Column>
          <Column style={{ verticalAlign: 'middle' }}>{line}</Column>
        </Row>
      </Column>
      <Column />
    </Row>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <Text style={{ ...label, margin: '12px 0 2px' }}>{String(children).toUpperCase()}</Text>;
}

function GroupPill({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        display: 'inline-block',
        margin: '4px 0 4px',
        padding: '3px 8px',
        backgroundColor: purple,
        color: '#ffffff',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}

const label: CSSProperties = { color: purple, fontSize: 12, fontWeight: 700, lineHeight: '16px' };
const small: CSSProperties = { color: muted, fontSize: 12, lineHeight: '18px', margin: 0 };
const value: CSSProperties = { color: ink, fontSize: 13, lineHeight: '18px', fontWeight: 600 };

RxOwnerEmail.PreviewProps = {
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
  scans: [
    {
      fileName: 'alex-doe-upper.stl',
      size: 48_234_496,
      url: 'https://example.public.blob.vercel-storage.com/scans/a1/alex-doe-upper.stl?download=1',
    },
    {
      fileName: 'alex-doe-lower.ply',
      size: 212_860_928,
      url: 'https://example.public.blob.vercel-storage.com/scans/b2/alex-doe-lower.ply?download=1',
    },
  ],
} satisfies Props;
