'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { Loader2 } from 'lucide-react';
import { useForm, type FieldPath } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { contactMessageSchema } from '@/convex/lib/contactMessage';

type ContactValues = z.input<typeof contactMessageSchema>;

const emptyValues: ContactValues = { first: '', last: '', email: '', phone: '', message: '' };

type FieldConfig = {
  name: FieldPath<ContactValues>;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  wide?: boolean;
};

const fields: FieldConfig[] = [
  { name: 'first', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'last', label: 'Last name', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Email', required: true, type: 'email', autoComplete: 'email', wide: true },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', wide: true },
];

function RequiredMark() {
  return (
    <span aria-hidden className='text-destructive'>
      {' '}
      *
    </span>
  );
}

export default function ContactForm() {
  const sendMessage = useMutation(api.contactMessages.submit);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: emptyValues,
  });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async (values: ContactValues) => {
    try {
      await sendMessage(contactMessageSchema.parse(values));
      form.reset(emptyValues);
      toast.success('Message sent. Thank you for reaching out!');
    } catch (err) {
      console.error('Contact message failed', err);
      const issues =
        err instanceof ConvexError
          ? (err.data as { issues?: { path: string; message: string }[] }).issues
          : undefined;
      issues?.forEach((issue) =>
        form.setError(issue.path as FieldPath<ContactValues>, { message: issue.message })
      );
      toast.error(
        'Sorry, your message could not be sent. Please try again or email us at advancedortholabsf@gmail.com.'
      );
    }
  };

  return (
    <div id='contact' className='relative isolate bg-white'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2'>
        <div className='relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48'>
          <div className='mx-auto max-w-xl lg:mx-0 lg:max-w-lg'>
            <div className='absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2'>
              <svg
                className='absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
                aria-hidden='true'
              >
                <defs>
                  <pattern
                    id='83fd4e5a-9d52-42fc-97b6-718e5d7ee527'
                    width={200}
                    height={200}
                    x='100%'
                    y={-1}
                    patternUnits='userSpaceOnUse'
                  >
                    <path d='M130 200V.5M.5 .5H200' fill='none' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' strokeWidth={0} fill='white' />
                <svg x='100%' y={-1} className='overflow-visible fill-gray-50'>
                  <path d='M-470.5 0h201v201h-201Z' strokeWidth={0} />
                </svg>
                <rect
                  width='100%'
                  height='100%'
                  strokeWidth={0}
                  fill='url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)'
                />
              </svg>
            </div>
            <h2 className='heading-2'>
              Get in touch
            </h2>
            <dl className='mt-10 space-y-4 text-base leading-7 text-gray-600'>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Address</span>
                  <BuildingOffice2Icon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>1108 Vicente St Ste 102, San Francisco, CA 94116</dd>
              </div>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Email</span>
                  <EnvelopeIcon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  <a
                    className='hover:text-gray-900'
                    href='mailto:advancedortholabsf@gmail.com'
                  >
                    advancedortholabsf@gmail.com
                  </a>
                </dd>
              </div>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Telephone</span>
                  <PhoneIcon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  <a
                    className='hover:text-gray-900'
                    href='tel:+1 (415) 661-9296'
                  >
                    Office: 415-661-9296
                  </a>
                </dd>
              </div>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Telephone</span>
                  <PhoneIcon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  <a
                    className='hover:text-gray-900'
                    href='tel:+1 (415) 370-3344'
                  >
                    Mobile: 415-370-3344
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* FORM */}

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className='px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48'
          >
            <div className='mx-auto max-w-xl lg:mr-0 lg:max-w-lg'>
              <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
                {fields.map((f) => (
                  <FormField
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem className={f.wide ? 'sm:col-span-2' : undefined}>
                        <FormLabel>
                          {f.label}
                          {f.required && <RequiredMark />}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={f.type ?? 'text'}
                            autoComplete={f.autoComplete}
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem className='sm:col-span-2'>
                      <FormLabel>
                        Message
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mt-8 flex lg:justify-end justify-center'>
                <Button type='submit' disabled={submitting}>
                  {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {submitting ? 'Sending…' : 'Send message'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
