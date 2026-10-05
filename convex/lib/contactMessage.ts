import { z } from 'zod';

// Shared validation for the footer contact form. Used by the client form and
// the Convex `contactMessages.submit` mutation.
export const contactMessageSchema = z.object({
  first: z.string().trim().min(1, 'First name is required').max(100),
  last: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.email('Enter a valid email'),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export function contactSubject(input: Pick<ContactMessageInput, 'first' | 'last'>) {
  return `New contact message: ${input.first} ${input.last}`;
}
