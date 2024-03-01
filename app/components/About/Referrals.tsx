import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Referrals = () => {
  return (
    <>
      <section className='relative py-24 bg-[#f1f1f1] isolate md:px-8 px-8'>
        <div className='max-w-7xl mx-auto lg:px-8'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full px-4 lg:w-1/2'>
              <div className='mb-12 max-w-[540px] lg:mb-0'>
                <span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
                  Trusted Customer
                </span>
                <h1 className='mt-10 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
                  Referrals
                </h1>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  We are known for the Excellent Quality of our cases and we
                  have the Fastest TurnaroundTime in the area; “5 business days”
                  (with rush available upon request for no extra charge)
                </p>
                <p className='mt-6 text-md leading-8 text-slate-700'>
                  We only use the most expensive domestic and imported materials
                  for production to guarantee success and client happiness. Here
                  is a partial list of our current and former clients. We will
                  be happy to provide you with contact numbers upon request.
                </p>
              </div>
            </div>

            <div className='w-full px-4 lg:w-1/2'>
              {/* <div className='flex flex-wrap -mx-2 sm:-mx-4 lg:-mx-2 xl:-mx-4'> */}
              <div className='grid grid-cols-1 w-full lg:grid-cols-2 text-sm leading-8 text-gray-600 italic rounded-lg border-2 border-solid border-[#DFE4EA] bg-[#fff]'>
                <div className='flex flex-col lg:h-full p-4 border-b-2 lg:border-b-0 lg:border-r-2 border-solid border-[#DFE4EA] '>
                  <p>Image Orthodontics</p>
                  <p>Choice Care</p>
                  <p>Axelrode Orthodontics</p>
                  <p>Dr. Scott Chong DDS, MS</p>
                  <p>Dr. Charlenne Rocha DDS, MSD</p>
                  <p>Dr. Maureen Valley DMD, MPH, MS</p>
                  <p>Dr. Bella Shen Garnett DDS, MS</p>
                  <p>Dr. Elizabeth Ubaldo DDS</p>
                  <p>Dr. Glen Young DDS</p>
                  <p>Dr. Rodney Lee DDS</p>
                  <p>Dr. Scott Lebus DDS, MS</p>
                </div>

                <div className='flex flex-col lg:h-full p-4'>
                  <p>Dr. Winton J. Quock DMD</p>
                  <p>Dr. Yan Kalika DDS, MS</p>
                  <p>Dr. Peter Lee DDS, MS</p>
                  <p>Dr. Alan Marcus DDS, MSD</p>
                  <p>Dr. Michael Chang DDS</p>
                  <p>Dr. Monica Chmiel DDS, MS</p>
                  <p>Dr. Tony Cucalon DDS</p>
                  <p>Dr. Kathleen Tavarez DDS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Referrals;
