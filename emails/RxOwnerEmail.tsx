import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';
import { rxFieldLabels, type RxSubmissionInput } from '../convex/lib/rxSubmission';

// Basic owner notification (phase 1). Replaced by the paper-form layout in phase 4.
export default function RxOwnerEmail({ submission }: { submission: RxSubmissionInput }) {
  return (
    <Html>
      <Head />
      <Preview>{`New RX for ${submission.patient} from Dr. ${submission.last}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, padding: 24 }}>
          <Heading as='h2' style={{ color: '#4c1d95' }}>
            New RX Form
          </Heading>
          <Section>
            {rxFieldLabels.map(([key, label]) => (
              <Text key={key} style={{ margin: '4px 0' }}>
                <strong>{label}:</strong> {submission[key] || '—'}
              </Text>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
    spring: 'Spring',
    color: 'Purple',
    instructions: 'Please add a bite plane.',
  },
};
