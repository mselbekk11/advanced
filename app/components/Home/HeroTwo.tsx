import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import VideoOne from '../VideoOne';

export default function HeroTwo() {
  return (
    <div className='relative isolate overflow-hidden bg-white wallpaper'>
      {/* <div className='relative -mt-[5.75rem] overflow-hidden pb-16 pt-[5.75rem]'></div> */}
      {/* <Image
        alt='boom'
        src='/homepage.jpeg'
        width='1400'
        height='1400'
        className='absolute -top-[1rem] left-1/2 -ml-[40rem] w-[163.125rem] max-w-none sm:-ml-[67.5rem] z-0'
      /> */}
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
      <div className='mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pt-48 lg:pb-44'>
        <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0'>
          <div className='mt-24 sm:mt-32 lg:mt-16'>
            <a href='#' className='inline-flex space-x-6'>
              <span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
                Over 42 years of Exellence
              </span>
              <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600'>
                {/* <span>Just shipped v1.0</span> */}
                {/* <ChevronRightIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                /> */}
              </span>
            </a>
          </div>
          <h1 className='mt-10 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
            Advanced Orth Lab <br />
            San Francisco
          </h1>
          {/* <h1 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Advanced Orth Lab San Francisco
          </h1> */}
          <p className='mt-6 text-md leading-8 text-slate-700'>
            Proudly serving the Dental Community for 3 generations. We use the
            highest quality materials available: the best German, Italian and
            American-made. All of our appliances have a one year unconditional
            guarantee.
          </p>
          <div className='mt-10 flex items-center gap-x-6'>
            {/* <a
              href='#'
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Submit RX Form
            </a> */}
            <Button>Submit RX Form</Button>
            {/* <a
              href='#'
              className='text-sm font-semibold leading-6 text-gray-900'
            >
              Learn more <span aria-hidden='true'>→</span>
            </a> */}
          </div>
        </div>
        <div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none'>
          {/* <Image
            src='/GG-B2.png'
            alt='golden gate bridge'
            width='700'
            height='500'
            className='shadow-lg shadow-slate-400'
          /> */}
          <div className='lg:mt-16'>
            <VideoOne />
          </div>
          {/* <div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <img
                src='https://tailwindui.com/img/component-images/project-app-screenshot.png'
                alt='App screenshot'
                width={2432}
                height={1442}
                className='w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10'
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
