'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { Download, FileText, Loader2, Palette } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
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
import type { Id } from '@/convex/_generated/dataModel';
import { applianceGroups, clasps, colors, positions, springs } from '@/convex/lib/rxOptions';
import { rxSubmissionSchema } from '@/convex/lib/rxSubmission';
import { ArchDrawing, type ArchDrawingHandle } from './ArchDrawing';
import { ScanUpload, type ScanUploadHandle, type ScanUploadState } from './ScanUpload';

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
  const generateUploadUrl = useMutation(api.rxSubmissions.generateUploadUrl);
  const drawingRef = useRef<ArchDrawingHandle>(null);
  const scansRef = useRef<ScanUploadHandle>(null);
  const [scanState, setScanState] = useState<ScanUploadState>({ uploading: 0, failed: 0 });
  const onScanStateChange = useCallback((state: ScanUploadState) => setScanState(state), []);
  const form = useForm<RxFormValues>({
    resolver: zodResolver(rxSubmissionSchema),
    defaultValues: emptyValues,
  });
  const submitting = form.formState.isSubmitting;
  const today = new Date().toISOString().slice(0, 10);
  const scansBlocking =
    scanState.uploading > 0
      ? `Please wait for ${scanState.uploading === 1 ? 'your scan' : `${scanState.uploading} scans`} to finish uploading.`
      : scanState.failed > 0
        ? 'Retry or remove the scans that failed to upload.'
        : null;

  const onSubmit = async (values: RxFormValues) => {
    try {
      const drawing = drawingRef.current?.hasDrawing()
        ? await uploadDrawing(await drawingRef.current.exportPng())
        : undefined;
      const scans = scansRef.current?.scans() ?? [];
      await submitRx({ ...rxSubmissionSchema.parse(values), drawing, scans });
      form.reset(emptyValues);
      drawingRef.current?.reset();
      scansRef.current?.reset();
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
      // Problems not tied to a field (e.g. a rejected scan) go in the toast.
      const message =
        err instanceof ConvexError && !issues?.length
          ? (err.data as { message?: string }).message
          : undefined;
      toast.error(
        'Sorry, your RX form could not be sent. Please try again or call us at (415) 661-9296.',
        { description: message }
      );
    }
  };

  // Uploads the flattened drawing straight to Convex storage.
  async function uploadDrawing(png: Blob) {
    const res = await fetch(await generateUploadUrl(), {
      method: 'POST',
      headers: { 'Content-Type': png.type || 'image/png' },
      body: png,
    });
    if (!res.ok) throw new Error(`Drawing upload failed (${res.status})`);
    const { storageId } = (await res.json()) as { storageId: Id<'_storage'> };
    return storageId;
  }

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
          <PaperFormCallout />
          <div className='mt-8 grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2'>
            <div className='bg-white flex flex-col items-center justify-center border-2 border-solid border-[#DFE4EA] rounded-lg p-8'>
              <ArchDrawing ref={drawingRef} disabled={submitting} />
              <div className='mt-8 w-full sm:w-auto'>
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

                <div className='space-y-2'>
                  <p className='text-sm font-medium leading-none'>Scans</p>
                  <p className='text-sm text-muted-foreground'>
                    Optional. Attach intraoral scans, or send them with iTero (lab code 26235) or 3Shape.
                  </p>
                  <ScanUpload ref={scansRef} disabled={submitting} onStateChange={onScanStateChange} />
                </div>

                {scansBlocking && (
                  <p role='status' className='text-sm text-muted-foreground'>
                    {scansBlocking}
                  </p>
                )}
                <Button type='submit' className='w-full' disabled={submitting || !!scansBlocking}>
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

function PaperFormCallout() {
  return (
    <div className='flex flex-col gap-4 rounded-lg border-2 border-indigo-600/20 bg-indigo-50 p-6 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-4'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600'>
          <FileText className='h-5 w-5' />
        </div>
        <div>
          <p className='font-semibold text-gray-900'>Prefer paper? Download the RX form</p>
          <p className='mt-1 text-sm text-gray-600'>
            Print it, fill it in by hand and send it with your case.
          </p>
        </div>
      </div>
      <Button className='w-full shrink-0 bg-indigo-600 hover:bg-indigo-500 sm:w-auto' asChild>
        <a href='/rx-form.pdf' download='advanced-ortho-lab-rx-form.pdf'>
          <Download className='mr-2 h-4 w-4' />
          Download PDF
        </a>
      </Button>
    </div>
  );
}
