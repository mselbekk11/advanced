import { Button } from '@/components/ui/button';
import Image from 'next/image';

const About = () => {
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
                <h1 className='lg:mt-10 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
                  Proudly serving the Dental Community for <br />{' '}
                  <span className='text-indigo-600'>3 generations</span>
                </h1>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Since our founding in 1982, Advanced Ortho Lab has provided
                  quality Orthodontic Appliances accompanied by outstanding
                  customer service. As a result, we have accumulated a
                  competitive referral list and a reputation for excellence.
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  We, at Advanced Orthodontic Lab, have expanded our appliance
                  line to include Retainers, Expansion Appliances, Bionators, as
                  well as other specialty appliances.
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  We also provide pick-up and delivery at no additional charge,
                  5 days a week.
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  “Please rest assured that we will out-perform the competition
                  because our name depends on it. Looking forward to doing
                  business with you.”
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  Daniel Budovsky
                </p>
              </div>
            </div>

            <div className='w-full px-4 lg:w-1/2'>
              <Image
                src='/family.png'
                alt='family picture'
                width='700'
                height='500'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
