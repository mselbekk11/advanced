'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { Download, Loader2, Palette } from 'lucide-react';
import Image from 'next/image';
import { useForm, type FieldPath } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { applianceGroups, clasps, colors, positions, springs } from '@/convex/lib/rxOptions';
import { rxSubmissionSchema } from '@/convex/lib/rxSubmission';

type RxFormValues = z.input<typeof rxSubmissionSchema>;

const emptyValues: RxFormValues = {
  first: '',
  last: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  zip: '',
  patient: '',
  deliveryDate: '',
  appliance: '',
  position: '',
  clasp: '',
  spring: '',
  color: '',
  instructions: '',
};

type TextFieldConfig = {
  name: FieldPath<RxFormValues>;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

const textFields: TextFieldConfig[] = [
  { name: 'first', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'last', label: 'Last name', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Email', required: true, type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', required: true, type: 'tel', autoComplete: 'tel' },
  { name: 'street', label: 'Street address', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'zip', label: 'ZIP / postal code', autoComplete: 'postal-code' },
  { name: 'patient', label: 'Patient', required: true, autoComplete: 'off' },
];

type SelectFieldConfig = {
  name: FieldPath<RxFormValues>;
  label: string;
  placeholder: string;
  options: readonly string[];
};

const selectFields: SelectFieldConfig[] = [
  { name: 'position', label: 'Position', placeholder: 'Upper / Lower / Both', options: positions },
  { name: 'clasp', label: 'Clasp', placeholder: 'Choose a clasp', options: clasps },
  { name: 'spring', label: 'Spring', placeholder: 'Spring or specify type', options: springs },
];

function RequiredMark() {
  return (
    <span aria-hidden className='text-destructive'>
      {' '}
      *
    </span>
  );
}

export default function Rxform() {
  const submitRx = useMutation(api.rxSubmissions.submit);
  const form = useForm<RxFormValues>({
    resolver: zodResolver(rxSubmissionSchema),
    defaultValues: emptyValues,
  });
  const submitting = form.formState.isSubmitting;
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (values: RxFormValues) => {
    try {
      await submitRx(rxSubmissionSchema.parse(values));
      form.reset(emptyValues);
      toast.success('Form sent! We will be in touch shortly!');
    } catch (err) {
      console.error('RX submission failed', err);
      // Surface server-side validation errors on the matching fields.
      const issues =
        err instanceof ConvexError
          ? (err.data as { issues?: { path: string; message: string }[] }).issues
          : undefined;
      issues?.forEach((issue) =>
        form.setError(issue.path as FieldPath<RxFormValues>, { message: issue.message })
      );
      toast.error(
        'Sorry, your RX form could not be sent. Please try again or call us at (415) 661-9296.'
      );
    }
  };

  return (
    <div className='bg-[#f1f1f1] pb-24 pt-36 lg:pb-44 lg:pt-48'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <h2 className='inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
            Please fill out and submit
          </h2>
          <p className='mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            RX Form
          </p>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            We use the highest quality Domestic and International materials,
            always at competitive prices
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2'>
            <div className='bg-white flex flex-col items-center justify-center border-2 border-solid border-[#DFE4EA] rounded-lg p-8'>
              <Image src='/mouth.png' alt='teeth diagram' width='400' height='500' />
              <div className='mt-8 grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2'>
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href='https://uttkgexdc6.ufs.sh/f/l2Zi8yDbeJCS7J6b3uyMEHgFZOARtxbkeGYJsXWdj1zLyU42'
                    target='_blank'
                  >
                    <Download className='mr-2 h-4 w-4' />
                    Download Form
                  </a>
                </Button>
                <ColorChartDialog />
              </div>
            </div>

            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className='p-8 bg-white border-2 border-solid border-[#DFE4EA] rounded-lg space-y-6'
              >
                <p className='text-sm text-muted-foreground'>
                  Fields marked <span className='text-destructive'>*</span> are required.
                </p>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  {textFields.map((f) => (
                    <FormField
                      key={f.name}
                      control={form.control}
                      name={f.name}
                      render={({ field }) => (
                        <FormItem>
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
                    name='deliveryDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery date</FormLabel>
                        <FormControl>
                          <Input type='date' min={today} {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='appliance'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Appliance
                          <RequiredMark />
                        </FormLabel>
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger onBlur={field.onBlur}>
                              <SelectValue placeholder='Choose an appliance' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {applianceGroups.map((group) => (
                              <SelectGroup key={group.label}>
                                <SelectLabel>{group.label}</SelectLabel>
                                {group.items.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectFields.map((f) => (
                    <FormField
                      key={f.name}
                      control={form.control}
                      name={f.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{f.label}</FormLabel>
                          <Select value={field.value ?? ''} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger onBlur={field.onBlur}>
                                <SelectValue placeholder={f.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {f.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name='color'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appliance color</FormLabel>
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger onBlur={field.onBlur}>
                              <SelectValue placeholder='Choose a color' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='max-h-80'>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='instructions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder='Anything else we should know, including details for "Other" selections'
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Sending…
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorChartDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          <Palette className='mr-2 h-4 w-4' />
          View Color Chart
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Appliance color chart</DialogTitle>
          <DialogDescription>
            Pick a color with your patient, then choose it in the form.
          </DialogDescription>
        </DialogHeader>
        <Image
          src='/color-chart.jpeg'
          alt='Appliance color chart'
          width={4032}
          height={3024}
          sizes='(min-width: 1024px) 896px, 100vw'
          className='h-auto w-full rounded-md'
        />
      </DialogContent>
    </Dialog>
  );
}
