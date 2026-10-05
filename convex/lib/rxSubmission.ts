import { z } from 'zod';
import { appliances, clasps, colors, positions, springs } from './rxOptions';

// Optional select: empty string (nothing chosen) or one of the listed options.
const optionalChoice = (options: readonly [string, ...string[]]) =>
  z.union([z.literal(''), z.enum(options)], 'Choose an option from the list').optional();

// Shared validation for an RX form submission. Used by the Convex `submit`
// mutation and (from phase 2) by the client form.
export const rxSubmissionSchema = z.object({
  first: z.string().trim().min(1, 'First name is required'),
  last: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Enter a valid email'),
  phone: z.string().trim().min(1, 'Phone is required'),
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  zip: z.string().trim().optional(),
  patient: z.string().trim().min(1, 'Patient is required'),
  // Shown to the doctor as "Due date"; the stored key predates the rename.
  deliveryDate: z.iso.date('Choose a due date'),
  appliance: z.enum(appliances as [string, ...string[]], 'Choose an appliance'),
  position: optionalChoice(positions),
  clasp: optionalChoice(clasps),
  spring: z.enum(springs, 'Choose spring or no spring'),
  color: optionalChoice(colors),
  // Shown to the doctor as "Additional information"; the stored key predates the rename.
  instructions: z.string().trim().min(1, 'Additional information is required'),
});

export type RxSubmissionInput = z.infer<typeof rxSubmissionSchema>;

// A stored submission. Rows saved before the due date, spring and additional
// information became required may not have them.
export type StoredRxSubmission = Omit<RxSubmissionInput, 'deliveryDate' | 'spring' | 'instructions'> & {
  deliveryDate?: string;
  spring?: string;
  instructions?: string;
};

// Ordered, human-readable labels for every field, used by the email template.
export const rxFieldLabels: [keyof RxSubmissionInput, string][] = [
  ['first', 'First name'],
  ['last', 'Last name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['street', 'Street'],
  ['city', 'City'],
  ['zip', 'ZIP'],
  ['patient', 'Patient'],
  ['deliveryDate', 'Due date'],
  ['appliance', 'Appliance'],
  ['position', 'Arch'],
  ['clasp', 'Clasp'],
  ['spring', 'Spring'],
  ['color', 'Color'],
  ['instructions', 'Additional information'],
];

export function ownerRxSubject(input: Pick<RxSubmissionInput, 'patient' | 'last'>) {
  return `New RX: ${input.patient} — Dr. ${input.last}`;
}

export function doctorRxSubject(input: Pick<RxSubmissionInput, 'patient'>) {
  return `RX received: ${input.patient} — Advanced Ortho Lab`;
}
