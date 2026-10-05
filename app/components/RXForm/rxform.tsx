'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import {
  Check,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  Palette,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useId, useRef, useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import {
  applianceGroups,
  clasps,
  colors,
  NO_SPRING,
  positions,
  springs,
} from '@/convex/lib/rxOptions';
import { rxSubmissionSchema } from '@/convex/lib/rxSubmission';
import { cn } from '@/lib/utils';
import { ArchDrawing, type ArchDrawingHandle } from './ArchDrawing';
import { DueDateInput } from './DueDateInput';
import {
  ScanUpload,
  type ScanUploadHandle,
  type ScanUploadState,
} from './ScanUpload';

type RxFormValues = z.input<typeof rxSubmissionSchema>;

// Today as YYYY-MM-DD in the doctor's own timezone.
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// In the browser, a typed due date also can't be in the past. (Not on the
// server, whose "today" may be a different day in UTC.)
const clientSchema = rxSubmissionSchema.refine(
  (v) => !v.deliveryDate || v.deliveryDate >= localToday(),
  { path: ['deliveryDate'], message: 'Choose today or a later date' },
);

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
  spring: NO_SPRING,
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
  {
    name: 'first',
    label: 'First name',
    required: true,
    autoComplete: 'given-name',
  },
  {
    name: 'last',
    label: 'Last name',
    required: true,
    autoComplete: 'family-name',
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone',
    required: true,
    type: 'tel',
    autoComplete: 'tel',
  },
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
  {
    name: 'position',
    label: 'Arch',
    placeholder: 'Upper / Lower / Both',
    options: positions,
  },
  {
    name: 'clasp',
    label: 'Clasp',
    placeholder: 'Choose a clasp',
    options: clasps,
  },
  {
    name: 'spring',
    label: 'Spring',
    placeholder: 'Spring or no spring',
    options: springs,
  },
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
  const [scanState, setScanState] = useState<ScanUploadState>({
    uploading: 0,
    failed: 0,
  });
  const onScanStateChange = useCallback(
    (state: ScanUploadState) => setScanState(state),
    [],
  );
  const form = useForm<RxFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyValues,
  });
  const submitting = form.formState.isSubmitting;
  const today = localToday();
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
          ? (err.data as { issues?: { path: string; message: string }[] })
              .issues
          : undefined;
      issues?.forEach((issue) =>
        form.setError(issue.path as FieldPath<RxFormValues>, {
          message: issue.message,
        }),
      );
      // Problems not tied to a field (e.g. a rejected scan) go in the toast.
      const message =
        err instanceof ConvexError && !issues?.length
          ? (err.data as { message?: string }).message
          : undefined;
      toast.error(
        'Sorry, your RX form could not be sent. Please try again or call us at (415) 661-9296.',
        { description: message },
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
    <div className='bg-[#f1f1f1] pb-24 pt-36 lg:pb-24 lg:pt-48'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <p className='inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
            Please fill out and submit
          </p>
          <h1 className='mt-6 heading-1'>
            RX Form
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            We use the highest quality Domestic and International materials,
            always at competitive prices
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <PaperFormCalloutThree />
          <div className='mt-8 grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-start'>
            <div className='bg-white flex flex-col items-center border-2 border-solid border-gray-200 rounded-lg p-8 lg:sticky lg:top-8'>
              <ArchDrawing ref={drawingRef} disabled={submitting} />
            </div>

            <Form {...form}>
              <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className='p-8 bg-white border-2 border-solid border-gray-200 rounded-lg space-y-6'
              >
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
                        <FormLabel>
                          Due date
                          <RequiredMark />
                        </FormLabel>
                        <FormControl>
                          <DueDateInput
                            min={today}
                            {...field}
                            value={field.value ?? ''}
                          />
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
                        <Select
                          value={field.value ?? ''}
                          onValueChange={field.onChange}
                        >
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
                          <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
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
                          {f.name === 'spring' && field.value !== NO_SPRING && (
                            <FormDescription>
                              Describe the spring in Additional information
                              below.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <FormField
                    control={form.control}
                    name='color'
                    render={({ field }) => (
                      <FormItem className='relative'>
                        <FormLabel>Appliance color</FormLabel>
                        {/* Sits over the label row so the field lines up with its neighbours. */}
                        <div className='absolute right-0 top-0 !mt-0'>
                          <ColorChartDialog />
                        </div>
                        <ColorCombobox
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
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
                      <FormLabel>
                        Additional information
                        <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder='Spring details, details for "Other" selections, and anything else we should know'
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
                    Optional. Attach intraoral scans, or send them with iTero
                    (lab code 26235) or 3Shape.
                  </p>
                  <ScanUpload
                    ref={scansRef}
                    disabled={submitting}
                    onStateChange={onScanStateChange}
                  />
                </div>

                {scansBlocking && (
                  <p role='status' className='text-sm text-muted-foreground'>
                    {scansBlocking}
                  </p>
                )}
                <Button
                  type='submit'
                  className='w-full'
                  disabled={submitting || !!scansBlocking}
                >
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

function ColorCombobox({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur();
      }}
    >
      <PopoverTrigger asChild>
        <FormControl>
          <button
            type='button'
            role='combobox'
            aria-expanded={open}
            aria-controls={listId}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              !value && 'text-muted-foreground'
            )}
          >
            <span className='line-clamp-1 text-left'>
              {value || 'Choose a color'}
            </span>
            <ChevronDown className='h-4 w-4 shrink-0 opacity-50' />
          </button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        id={listId}
        className='w-[--radix-popover-trigger-width] p-0'
      >
        <Command>
          <CommandInput placeholder='Search colors…' />
          <CommandList>
            <CommandEmpty>No color found.</CommandEmpty>
            <CommandGroup>
              {colors.map((color) => (
                <CommandItem
                  key={color}
                  value={color}
                  onSelect={() => {
                    onChange(color);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === color ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {color}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ColorChartDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type='button'
          className='inline-flex items-center gap-1 text-sm font-medium leading-none text-indigo-600 hover:text-indigo-500 focus:outline-none focus-visible:underline'
        >
          <Palette className='h-3.5 w-3.5' />
          View chart
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Appliance color chart</DialogTitle>
          <DialogDescription>
            Find the color name on the chart, then pick it from Appliance
            color.
          </DialogDescription>
        </DialogHeader>
        <Image
          src='/colours.png'
          alt='Appliance color chart'
          width={1008}
          height={705}
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
          <p className='font-semibold text-gray-900'>
            Prefer paper? Download the RX form
          </p>
          <p className='mt-1 text-sm text-gray-600'>
            Print it, fill it in by hand and send it with your case.
          </p>
        </div>
      </div>
      <Button
        variant='purple'
        className='w-full shrink-0 sm:w-auto'
        asChild
      >
        <a href='/rx-form.pdf' download='advanced-ortho-lab-rx-form.pdf'>
          <Download className='mr-2 h-4 w-4' />
          Download PDF
        </a>
      </Button>
    </div>
  );
}

function PaperFormCalloutTwo() {
  return (
    <div className='relative flex flex-col gap-4 overflow-hidden rounded-lg border-2 border-indigo-600/20 bg-indigo-50 p-8 sm:flex-row sm:items-center sm:justify-between'>
      {/* Oversized, faint logo bleeding off the left, top and bottom edges. */}
      <Image
        src='/AOL.svg'
        alt=''
        aria-hidden
        width={386}
        height={136}
        className='pointer-events-none absolute -left-10 top-1/2 h-[180%] w-auto max-w-none -translate-y-[30%] select-none opacity-[0.07]'
      />
      <div className='relative flex items-start gap-4'>
        {/* <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600'>
          <FileText className='h-5 w-5' />
        </div> */}
        <div>
          <p className='font-semibold text-gray-900'>
            Prefer paper? Download the RX form
          </p>
          <p className='mt-1 text-sm text-gray-600'>
            Print it, fill it in by hand and send it with your case.
          </p>
        </div>
      </div>
      <Button
        variant='purple'
        className='relative w-full shrink-0 sm:w-auto'
        asChild
      >
        <a href='/rx-form.pdf' download='advanced-ortho-lab-rx-form.pdf'>
          <Download className='mr-2 h-4 w-4' />
          Download PDF
        </a>
      </Button>
    </div>
  );
}

function PaperFormCalloutThree() {
  return (
    <div className='relative flex flex-col gap-4 overflow-hidden rounded-lg border-2 border-indigo-600/20 bg-indigo-50 p-8 sm:flex-row sm:items-center sm:justify-between'>
      {/* Faint logo tiled across the whole background. */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 select-none bg-[url(/AOL.svg)] bg-[length:120px_auto] bg-repeat opacity-[0.04]'
      />

      <div className='relative flex items-start gap-4'>
        {/* <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600'>
          <FileText className='h-5 w-5' />
        </div> */}
        <div>
          <p className='font-semibold text-gray-900'>
            Prefer paper? Download the RX form
          </p>
          <p className='mt-1 text-sm text-gray-600'>
            Print it, fill it in by hand and send it with your case.
          </p>
        </div>
      </div>
      <Button
        variant='purple'
        className='relative w-full shrink-0 sm:w-auto'
        asChild
      >
        <a href='/rx-form.pdf' download='advanced-ortho-lab-rx-form.pdf'>
          <Download className='mr-2 h-4 w-4' />
          Download RX Form
        </a>
      </Button>
    </div>
  );
}
