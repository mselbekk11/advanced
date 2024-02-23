// export default function DigitalPrinting() {
//   return (
//     <div className='mx-auto max-w-7xl grid grid-cols-2 px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pt-24 lg:pb-44'>
//       <div className='relative z-10 order-last col-span-1 space-y-6'>
//         <h1>digital printing</h1>
//       </div>
//       <div className='relative col-span-1'>
//         <h1>digital printing</h1>
//       </div>
//     </div>
//   );
// }

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function DigitalPrinting() {
  return (
    <div className='relative bg-white digitalprinting'>
      <div className='mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8'>
        <div className='px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <div className='hidden sm:mt-32 sm:flex lg:mt-16'>
              <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-white'>
                What we offer
              </div>
            </div>
            <h1 className='mt-24 text-4xl font-bold tracking-tight text-white sm:mt-10 sm:text-6xl'>
              Digital Printing Service
            </h1>
            <p className='mt-6 text-lg leading-8 text-white'>
              Advanced Ortho Lab, uses Ortho Insight 3D software <br />{' '}
              & Explore to process your digital scans
            </p>
            <div className='mt-10 flex items-center gap-x-6'>
              <Button>View Details</Button>
            </div>
          </div>
        </div>
        {/* <div className='px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <div className='hidden sm:mt-32 sm:flex lg:mt-16'>
              <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-white'>
                What we offer
              </div>
            </div>
            <h1 className='mt-24 text-4xl font-bold tracking-tight text-white sm:mt-10 sm:text-6xl'>
              Digital Printing Service
            </h1>
            <p className='mt-6 text-lg leading-8 text-white'>
              Advanced Ortho Lab, uses Ortho Insight 3D software & Explore to
              process your digital scans
            </p>
            <div className='mt-10 flex items-center gap-x-6'>
              <Button>View Details</Button>
            </div>
          </div>
        </div> */}
        <div className='relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0'>
          <div className='flex items-center aspect-[3/2] w-full bg-white object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full'>
            {/* <img className='' src='/printer.png' alt='' /> */}
            <Image
              src='/printer.png'
              alt='digital printer'
              width='700'
              height='500'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
