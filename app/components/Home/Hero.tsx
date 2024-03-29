import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className='flex justify-center bg-background w-full bg-gradient-to-b from-indigo-100/20'>
      {/* <div className='relative -mt-[5.75rem] overflow-hidden pb-16 pt-[5.75rem]'>
        <Image
          alt='boom'
          src='/homepage.jpeg'
          width='1400'
          height='1400'
          className='absolute -top-[1rem] left-1/2 -ml-[40rem] w-[163.125rem] max-w-none sm:-ml-[67.5rem]'
        /> */}

      <div className='relative isolate overflow-hidden'>
        <div className='mx-auto max-w-8xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40'>
          <div className='px-6 lg:px-0 lg:pt-4'>
            <div className='mx-auto max-w-2xl'>
              <div className='max-w-xlg'>
                <div className='mt-24 sm:mt-32 lg:mt-16'>
                  <a href='#' className='inline-flex space-x-6'>
                    <span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
                      Over 42 years of excellence
                    </span>
                  </a>
                </div>
                <h1 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
                  Advanced Orth Lab <br />
                  San Francisco
                </h1>
                <p className='mt-6 text-lg leading-8 text-gray-600'>
                  Proudly serving the Dental Community for 3 generations. We use
                  the highest quality materials available: the best German,
                  Italian and American-made. All of our appliances have a one
                  year unconditional guarantee.
                </p>
                <div className='mt-10 flex items-center gap-x-6'>
                  <a
                    href='#'
                    className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Documentation
                  </a>
                  <a
                    href='#'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    View on GitHub <span aria-hidden='true'>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen'>
            <Image src='/GG-B.png' alt='SF Bridge' width='644' height='455' />
            {/* <div
              className='absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36'
              aria-hidden='true'
            /> */}
            {/* <div className='shadow-lg md:rounded-3xl'>
              <div className='bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]'>
                <div className='relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0'>
                  <div className='mx-auto max-w-2xl md:mx-0 md:max-w-none'>
                    <div className='w-screen overflow-hidden rounded-tl-xl bg-gray-900'>
                      <div className='flex bg-gray-800/40 ring-1 ring-white/5'>
                        <div className='-mb-px flex text-sm font-medium leading-6 text-gray-400'>
                          <div className='border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white'>
                            NotificationSetting.jsx
                          </div>
                          <div className='border-r border-gray-600/10 px-4 py-2'>
                            App.jsx
                          </div>
                        </div>
                      </div>
                      <div className='px-6 pb-14 pt-6'>
                      </div>
                    </div>
                  </div>
                  <div
                    className='pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl'
                    aria-hidden='true'
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32' />
      </div>
      {/* </div> */}
    </div>
  );
}
