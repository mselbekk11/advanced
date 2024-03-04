import { Button } from '@/components/ui/button';
import Image from 'next/image';

const DigitalPrinting = () => {
  return (
    <>
      <section className='relative bg-white wallpaper isolate px-8 pt-36 pb-24 lg:pt-48 lg:pb-44'>
        <svg
          className='absolute inset-0 -z-10 h-full w-full stroke-gray-300 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
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
        <div className='max-w-7xl mx-auto lg:px-8'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full px-4 lg:w-1/2'>
              <div className='mb-12 max-w-[540px] lg:mb-0'>
                <span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
                  What we Offer
                </span>
                <h1 className='mt-10 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
                  Digital Printing
                </h1>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Advanced Ortho Lab uses Ortho Insight 3D software & Explore to
                  process your digital scans.
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Advanced Ortho Labs also uses the Structo DentaForm, The
                  orthodontic 3D printer with ridiculously high throughput.
                  Powered by Structo&apos;s proprietary MSLA technology,
                  DentaForm is a high throughput 3D printer that prints up to 10
                  orthodontic models in 30 minutes.
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Please upload files to Itero using our lab code: 26235
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Alternatively now accepting 3-Shape scans by email:
                </p>
                <p className='mt-6 text-md leading-8 text-blue-600'>
                  <a href='mailto:advancedortholabsf@gmail.com' target='_blank'>
                    advancedortholabsf@gmail.com
                  </a>
                </p>
                {/* <div className='mt-10 flex items-center gap-x-6'>
                  <Button>Learn More</Button>
                </div> */}
              </div>
            </div>

            <div className='w-full px-4 lg:w-1/2'>
              <div className='flex flex-wrap -mx-2 sm:-mx-4 lg:-mx-2 xl:-mx-4'>
                <div className='w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4'>
                  <div className='mb-4 sm:mb-8 sm:h-[400px] md:h-[540px] lg:h-[400px] xl:h-[500px] bg-[#3e4966] flex items-center justify-center shadow-lg shadow-gray-500 p-4'>
                    {/* <img
                      src='https://i.ibb.co/8mB6K20/image-01.jpg'
                      alt='about image'
                      className='object-cover object-center w-full h-full'
                    /> */}
                    <Image
                      src='/dp-a.png'
                      alt='digital printer'
                      width='225'
                      height='500'
                    />
                  </div>
                </div>
                <div className='w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4'>
                  <div className='mb-4 sm:mb-8 sm:h-[220px] md:h-[346px] lg:mb-4 lg:h-[225px] xl:mb-8 xl:h-[310px] bg-[#3E4966] flex items-center justify-center shadow-lg shadow-gray-500 p-4'>
                    {/* <img
                      src='https://i.ibb.co/fp6kRJc/image-02.jpg'
                      alt='about image'
                      className='object-cover object-center w-full h-full'
                    /> */}
                    <Image
                      src='/dp-b.png'
                      alt='digital printer'
                      width='225'
                      height='300'
                    />
                  </div>
                  <div className='bg-[#4f4c7f] relative z-10 mb-4 flex items-center justify-center overflow-hidden py-12 px-6 sm:mb-8 sm:h-[160px] sm:p-5 lg:mb-4 xl:mb-8 shadow-lg shadow-gray-500'>
                    <div>
                      <span className='block text-5xl font-extrabold text-white'>
                        42
                      </span>
                      {/* <span className='block text-base font-semibold text-white'>
                        We have
                      </span> */}
                      <span className='block text-base font-medium text-white text-opacity-70'>
                        Years of experience
                      </span>
                    </div>

                    {/* <div>
                      <span className='absolute top-0 left-0 -z-10'>
                        <svg
                          width='106'
                          height='144'
                          viewBox='0 0 106 144'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <rect
                            opacity='0.1'
                            x='-67'
                            y='47.127'
                            width='113.378'
                            height='131.304'
                            transform='rotate(-42.8643 -67 47.127)'
                            fill='url(#paint0_linear_1416_214)'
                          />
                          <defs>
                            <linearGradient
                              id='paint0_linear_1416_214'
                              x1='-10.3111'
                              y1='47.127'
                              x2='-10.3111'
                              y2='178.431'
                              gradientUnits='userSpaceOnUse'
                            >
                              <stop stop-color='white' />
                              <stop
                                offset='1'
                                stop-color='white'
                                stop-opacity='0'
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className='absolute top-0 right-0 -z-10'>
                        <svg
                          width='130'
                          height='97'
                          viewBox='0 0 130 97'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <rect
                            opacity='0.1'
                            x='0.86792'
                            y='-6.67725'
                            width='155.563'
                            height='140.614'
                            transform='rotate(-42.8643 0.86792 -6.67725)'
                            fill='url(#paint0_linear_1416_215)'
                          />
                          <defs>
                            <linearGradient
                              id='paint0_linear_1416_215'
                              x1='78.6495'
                              y1='-6.67725'
                              x2='78.6495'
                              y2='133.937'
                              gradientUnits='userSpaceOnUse'
                            >
                              <stop stop-color='white' />
                              <stop
                                offset='1'
                                stop-color='white'
                                stop-opacity='0'
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className='absolute bottom-0 right-0 -z-10'>
                        <svg
                          width='175'
                          height='104'
                          viewBox='0 0 175 104'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <rect
                            opacity='0.1'
                            x='175.011'
                            y='108.611'
                            width='101.246'
                            height='148.179'
                            transform='rotate(137.136 175.011 108.611)'
                            fill='url(#paint0_linear_1416_216)'
                          />
                          <defs>
                            <linearGradient
                              id='paint0_linear_1416_216'
                              x1='225.634'
                              y1='108.611'
                              x2='225.634'
                              y2='256.79'
                              gradientUnits='userSpaceOnUse'
                            >
                              <stop stop-color='white' />
                              <stop
                                offset='1'
                                stop-color='white'
                                stop-opacity='0'
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalPrinting;
