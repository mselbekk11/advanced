import { Body, Column, Container, Head, Html, Link, Preview, Row, Section, Text } from '@react-email/components';
import type { CSSProperties } from 'react';
import type { ContactMessageInput } from '../convex/lib/contactMessage';

// Footer contact-form message, sent to the owner. Reply-to is the visitor, so
// replying in Gmail answers them directly.

const purple = '#5631c4';
const ink = '#1f2937';
const muted = '#6b7280';
const rule = '#e5e7eb';
const font = 'Helvetica, Arial, sans-serif';

type Props = { message: ContactMessageInput };

export default function ContactOwnerEmail({ message: m }: Props) {
  const name = `${m.first} ${m.last}`;
  return (
    <Html>
      <Head />
      <Preview>{`New message from ${name}`}</Preview>
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: font, margin: 0, padding: '16px 0' }}>
        <Container style={{ maxWidth: 560, width: '100%', backgroundColor: '#ffffff' }}>
          <Section style={{ backgroundColor: purple, padding: '16px 20px' }}>
            <Text style={{ margin: 0, color: '#ffffff', fontSize: 18, fontWeight: 800 }}>
              New contact form message
            </Text>
          </Section>

          <Section style={{ padding: '16px 20px 8px' }}>
            <Field label='Name' field='name'>
              {name}
            </Field>
            <Field label='Email' field='email'>
              <Link href={`mailto:${m.email}`} style={{ color: purple }}>
                {m.email}
              </Link>
            </Field>
            <Field label='Phone' field='phone'>
              {m.phone ? (
                <Link href={`tel:${m.phone}`} style={{ color: purple }}>
                  {m.phone}
                </Link>
              ) : (
                '—'
              )}
            </Field>
          </Section>

          <Section style={{ padding: '8px 20px 20px' }}>
            <Text style={{ ...labelStyle, margin: '0 0 6px' }}>MESSAGE</Text>
            <Text
              style={{ ...value, margin: 0, fontWeight: 400, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              data-field='message'
            >
              {m.message}
            </Text>
          </Section>

          <Text style={{ ...small, textAlign: 'center', padding: '10px 16px 14px', margin: 0, borderTop: `1px solid ${rule}` }}>
            Sent from the contact form on www.advancedortholabsf.com. Reply to this email to answer {m.first}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Field({ label, field, children }: { label: string; field: string; children: React.ReactNode }) {
  return (
    <Row style={{ borderBottom: `1px solid ${rule}` }} data-field={field}>
      <Column style={{ width: 90, padding: '6px 8px 6px 0', verticalAlign: 'top' }}>
        <Text style={{ ...small, margin: 0 }}>{label}</Text>
      </Column>
      <Column style={{ padding: '6px 0', verticalAlign: 'top' }}>
        <Text style={{ ...value, margin: 0, wordBreak: 'break-word' }}>{children}</Text>
      </Column>
    </Row>
  );
}

const labelStyle: CSSProperties = { color: purple, fontSize: 12, fontWeight: 700, lineHeight: '16px' };
const small: CSSProperties = { color: muted, fontSize: 12, lineHeight: '18px' };
const value: CSSProperties = { color: ink, fontSize: 14, lineHeight: '20px', fontWeight: 600 };

ContactOwnerEmail.PreviewProps = {
  message: {
    first: 'Sam',
    last: 'Lee',
    email: 'sam@example.com',
    phone: '(415) 555-0199',
    message: 'Hi, do you make night guards?\nWe would like to send a few cases next week.',
  },
} satisfies Props;
