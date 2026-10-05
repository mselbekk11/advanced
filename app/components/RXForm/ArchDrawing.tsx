'use client';

import { Eraser, Pencil, Redo2, Trash2, Undo2 } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DRAWING_EXPORT_SIZE } from '@/convex/lib/drawing';

const penColors = [
  { name: 'Black', value: '#111827' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Blue', value: '#2563eb' },
] as const;

const penWidths = [
  { name: 'Thin', value: 2 },
  { name: 'Thick', value: 5 },
] as const;

export type ArchDrawingHandle = {
  // True when at least one pen stroke is on the canvas.
  hasDrawing: () => boolean;
  // The strokes flattened onto the arch image, as a PNG.
  exportPng: () => Promise<Blob>;
  // Clears the strokes and the undo/redo history.
  reset: () => void;
};

// Drawing layer over the arch diagram (public/mouth.png). Works with mouse,
// touch and stylus; touch-action is off on the canvas so drawing doesn't
// scroll the page.
export const ArchDrawing = forwardRef<ArchDrawingHandle, { disabled?: boolean }>(
  function ArchDrawing({ disabled }, ref) {
    const canvas = useRef<ReactSketchCanvasRef>(null);
    const [erasing, setErasing] = useState(false);
    const [color, setColor] = useState<string>(penColors[0].value);
    const [width, setWidth] = useState<number>(penWidths[0].value);
    const [strokeCount, setStrokeCount] = useState(0);

    useImperativeHandle(ref, () => ({
      hasDrawing: () => strokeCount > 0,
      exportPng: async () => {
        const dataUrl = await canvas.current!.exportImage('png', DRAWING_EXPORT_SIZE);
        return (await fetch(dataUrl)).blob();
      },
      reset: () => {
        canvas.current?.resetCanvas();
        setErasing(false);
        canvas.current?.eraseMode(false);
      },
    }));

    const setMode = (erase: boolean) => {
      setErasing(erase);
      canvas.current?.eraseMode(erase);
    };

    return (
      <div className='w-full max-w-[400px]'>
        <p className='mb-8 text-center text-sm font-semibold text-zinc-600'>
          Design appliance below <span className='font-normal text-gray-500'>(optional)</span>
        </p>
        <div
          className='relative w-full touch-none select-none overscroll-contain'
          style={{ aspectRatio: '388 / 453' }}
        >
          <ReactSketchCanvas
            ref={canvas}
            width='100%'
            height='100%'
            backgroundImage='/mouth.png'
            exportWithBackgroundImage
            preserveBackgroundImageAspectRatio='xMidYMid meet'
            canvasColor='#ffffff'
            strokeColor={color}
            strokeWidth={width}
            eraserWidth={14}
            eraserMode='stroke'
            readOnly={disabled}
            onChange={(paths) => setStrokeCount(paths.filter((p) => p.drawMode).length)}
            style={{ border: '', borderRadius: 8, touchAction: 'none' }}
            svgStyle={{ touchAction: 'none' }}
          />
        </div>

        <div className='mt-8 flex w-full flex-wrap items-center justify-between gap-y-2 rounded-md border border-gray-200 p-2 shadow-md' aria-label='Drawing tools'>
          <ToolButton label='Pen' active={!erasing} onClick={() => setMode(false)} disabled={disabled}>
            <Pencil className='h-4 w-4' />
          </ToolButton>
          <ToolButton label='Eraser' active={erasing} onClick={() => setMode(true)} disabled={disabled}>
            <Eraser className='h-4 w-4' />
          </ToolButton>

          <span className='h-6 w-px bg-gray-200' aria-hidden />

          {penColors.map((c) => (
            <button
              key={c.value}
              type='button'
              title={c.name}
              aria-label={`${c.name} pen`}
              aria-pressed={!erasing && color === c.value}
              disabled={disabled}
              onClick={() => {
                setColor(c.value);
                setMode(false);
              }}
              className={cn(
                'h-6 w-6 rounded-full border-2 border-white ring-1 ring-gray-300 disabled:opacity-50',
                !erasing && color === c.value && 'ring-2 ring-indigo-600'
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}

          {penWidths.map((w) => (
            <ToolButton
              key={w.value}
              label={`${w.name} pen`}
              active={width === w.value}
              onClick={() => {
                setWidth(w.value);
                setMode(false);
              }}
              disabled={disabled}
            >
              <span className='block rounded-full bg-current' style={{ width: 16, height: w.value }} />
            </ToolButton>
          ))}

          <span className='h-6 w-px bg-gray-200' aria-hidden />

          <ToolButton label='Undo' onClick={() => canvas.current?.undo()} disabled={disabled}>
            <Undo2 className='h-4 w-4' />
          </ToolButton>
          <ToolButton label='Redo' onClick={() => canvas.current?.redo()} disabled={disabled}>
            <Redo2 className='h-4 w-4' />
          </ToolButton>
          <ToolButton label='Clear drawing' onClick={() => canvas.current?.clearCanvas()} disabled={disabled}>
            <Trash2 className='h-4 w-4' />
          </ToolButton>
        </div>
      </div>
    );
  }
);

function ToolButton({
  label,
  active,
  children,
  ...props
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type='button'
      size='icon'
      variant={active ? 'purple' : 'outline'}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className='h-7 w-7'
      {...props}
    >
      {children}
    </Button>
  );
}
