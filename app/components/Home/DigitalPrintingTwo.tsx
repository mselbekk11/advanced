import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import VideoOne from '../VideoOne';

export default function DigitalPrinting() {
  return (
    <div className='relative isolate overflow-hidden bg-white wallpaper'>
      <svg
        className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='0787a7c5-978c-4f66-83c7-11c213f99cb7'
            width={200}
            height={200}
            x='50%'
            y={-1}
            patternUnits='userSpaceOnUse'
          >
            <path d='M.5 200V.5H200' fill='none' />
          </pattern>
        </defs>
        <rect
          width='100%'
          height='100%'
          strokeWidth={0}
          fill='url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)'
        />
      </svg>
      <div className='mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:pt-48 lg:pb-44'>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 px-6 lg:col-span-6 lg:px-0 xl:col-span-6'>
          <div className='mt-24 sm:mt-32 lg:mt-16'>
            <a href='#' className='inline-flex space-x-6'>
              <span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
                What we Offer
              </span>
              <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600'></span>
            </a>
          </div>
          <h1 className='mt-10 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
            Digital Printing <br />
            Services
          </h1>
          <div className='mt-10 flex items-center gap-x-6'>
            <Button>View Details</Button>
          </div>
        </div>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 px-6 lg:col-span-6 lg:px-0 xl:col-span-6 flex items-center justify-center'>
          <Image
            src='/printer-small.png'
            alt='printer-small.png'
            width='300'
            height='300'
          />
        </div>
      </div>
    </div>
  );
}
