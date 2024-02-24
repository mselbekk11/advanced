import { Button } from '@/components/ui/button';

export default function RxForm() {
  return (
    <div className='bg-[#F9FAFB] py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <h2 className='inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
            Send us your
          </h2>
          <p className='mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            RX Form
          </p>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            We use the highest quality Domestic and International materials,
            <br />
            always at competitive prices
          </p>
        </div>
        <div className='mx-auto max-w-2xl lg:text-center mt-6 sm:mt-6'>
          <Button>Complete Form</Button>
        </div>
      </div>
    </div>
  );
}
