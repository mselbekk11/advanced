'use client';

import { useMutation } from 'convex/react';
import { CheckCircle2, FileBox, RotateCw, Upload, X, XCircle } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type DragEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { formatBytes, MAX_SCAN_BYTES, MAX_SCANS, SCAN_ACCEPT, scanContentType, scanFileProblem } from '@/convex/lib/scans';

type ScanItem = {
  key: string;
  file: File;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  storageId?: Id<'_storage'>;
  error?: string;
};

export type UploadedScan = { storageId: Id<'_storage'>; fileName: string };

export type ScanUploadState = { uploading: number; failed: number };

export type ScanUploadHandle = {
  // Scans that finished uploading, ready to pass to the submit mutation.
  scans: () => UploadedScan[];
  // Clears the list (after a successful submit).
  reset: () => void;
};

type Props = {
  disabled?: boolean;
  // Called whenever the number of in-flight or failed uploads changes, so the
  // form can block submit until every scan is uploaded.
  onStateChange: (state: ScanUploadState) => void;
};

// Drag-and-drop / picker for intraoral scans. Each file uploads straight to
// Convex storage as soon as it's added, with its own progress bar; failed
// uploads can be retried and any file can be removed before submit. Removed
// and abandoned uploads are deleted later by the storage sweep.
export const ScanUpload = forwardRef<ScanUploadHandle, Props>(function ScanUpload(
  { disabled, onStateChange },
  ref
) {
  const generateUploadUrl = useMutation(api.rxSubmissions.generateUploadUrl);
  const [items, setItems] = useState<ScanItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requests = useRef(new Map<string, XMLHttpRequest>());

  const update = (key: string, patch: Partial<ScanItem>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  const uploading = items.filter((it) => it.status === 'uploading').length;
  const failed = items.filter((it) => it.status === 'error').length;
  useEffect(() => onStateChange({ uploading, failed }), [uploading, failed, onStateChange]);

  // Abort anything still uploading if the form goes away.
  useEffect(() => {
    const inFlight = requests.current;
    return () => inFlight.forEach((xhr) => xhr.abort());
  }, []);

  useImperativeHandle(ref, () => ({
    scans: () =>
      items
        .filter((it) => it.status === 'done' && it.storageId)
        .map((it) => ({ storageId: it.storageId!, fileName: it.file.name })),
    reset: () => {
      requests.current.forEach((xhr) => xhr.abort());
      requests.current.clear();
      setItems([]);
    },
  }));

  async function upload(key: string, file: File) {
    update(key, { status: 'uploading', progress: 0, error: undefined });
    try {
      const url = await generateUploadUrl();
      const storageId = await postWithProgress(url, file, (progress) => update(key, { progress }), (xhr) =>
        requests.current.set(key, xhr)
      );
      update(key, { status: 'done', progress: 100, storageId });
    } catch (err) {
      if (err instanceof UploadAborted) return;
      console.error(`Scan upload failed: ${file.name}`, err);
      update(key, { status: 'error', error: 'Upload failed' });
    } finally {
      requests.current.delete(key);
    }
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_SCANS - items.length;
    const accepted: ScanItem[] = [];
    for (const file of Array.from(files)) {
      const problem = scanFileProblem(file);
      if (problem) {
        toast.error(`${file.name} was not added`, { description: problem });
      } else if (accepted.length >= room) {
        toast.error(`${file.name} was not added`, { description: `Attach at most ${MAX_SCANS} scans` });
      } else {
        accepted.push({ key: crypto.randomUUID(), file, status: 'uploading', progress: 0 });
      }
    }
    setItems((prev) => [...prev, ...accepted]);
    accepted.forEach((it) => upload(it.key, it.file));
  }

  function remove(key: string) {
    requests.current.get(key)?.abort();
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  return (
    <div className='space-y-3'>
      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-4 py-8 text-center transition-colors hover:border-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          dragging && 'border-indigo-500 bg-indigo-50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <Upload className='h-6 w-6 text-muted-foreground' />
        <p className='text-sm font-medium'>Drop scans here or click to choose files</p>
        <p className='text-xs text-muted-foreground'>.stl or .ply, up to {formatBytes(MAX_SCAN_BYTES)} each</p>
        <input
          ref={inputRef}
          type='file'
          multiple
          accept={SCAN_ACCEPT}
          className='hidden'
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className='space-y-2'>
          {items.map((it) => (
            <li key={it.key} className='rounded-md border border-input p-3'>
              <div className='flex items-center gap-3'>
                <FileBox className='h-5 w-5 shrink-0 text-muted-foreground' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{it.file.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatBytes(it.file.size)}
                    {it.status === 'uploading' && ` · Uploading ${Math.round(it.progress)}%`}
                    {it.status === 'error' && (
                      <span className='text-destructive'> · {it.error}</span>
                    )}
                  </p>
                </div>
                {it.status === 'done' && (
                  <CheckCircle2 aria-label='Uploaded' className='h-5 w-5 shrink-0 text-green-600' />
                )}
                {it.status === 'error' && <XCircle aria-hidden className='h-5 w-5 shrink-0 text-destructive' />}
                {it.status === 'error' && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={disabled}
                    onClick={() => upload(it.key, it.file)}
                  >
                    <RotateCw className='mr-1 h-3.5 w-3.5' />
                    Retry
                  </Button>
                )}
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 shrink-0'
                  disabled={disabled}
                  onClick={() => remove(it.key)}
                  aria-label={`Remove ${it.file.name}`}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              {it.status === 'uploading' && (
                <Progress value={it.progress} className='mt-2 h-2' aria-label={`Uploading ${it.file.name}`} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

class UploadAborted extends Error {}

// fetch() can't report upload progress, so scans go up with XMLHttpRequest.
// The content type comes from the extension so the server can verify it.
function postWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
  onStart: (xhr: XMLHttpRequest) => void
) {
  return new Promise<Id<'_storage'>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', scanContentType(file.name)!);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) return reject(new Error(`Upload failed (${xhr.status})`));
      try {
        resolve((JSON.parse(xhr.responseText) as { storageId: Id<'_storage'> }).storageId);
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.onabort = () => reject(new UploadAborted());
    onStart(xhr);
    xhr.send(file);
  });
}
