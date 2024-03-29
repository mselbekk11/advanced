import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    name: 'Removable Appliances',
    src: '/A.png',
    description:
      'Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu. Phasellus praesent ligula sit faucibus.',
    href: '#',
  },
  {
    name: 'Fixed Appliances',
    src: '/B.png',
    description:
      'Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.',
    href: '#',
  },
  {
    name: 'TMJ Appliances',
    src: '/C.png',
    description:
      'Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod ut condimentum.',
    href: '#',
  },
];

export default function Appliances() {
  return (
    <div className='bg-[#f1f1f1] py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <h2 className='inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
            What we Offer
          </h2>
          <p className='mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Orthodontic Appliances
          </p>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            We use the highest quality Domestic and International materials,
            always at competitive prices
          </p>
        </div>
        <Link href='/appliances'>
          <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
            <dl className='grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className='flex flex-col bg-[#fff] items-center border-solid border-[#DFE4EA] border-2 rounded-md'
                >
                  <div className='flex w-full justify-center items-center py-4'>
                    <Image
                      src={feature.src}
                      alt='appliance'
                      width='194'
                      height='168'
                    />
                  </div>
                  <div className='flex items-center text-base font-semibold leading-7 text-gray-900 px-4 py-8 border-t-2 border-solid border-[#DFE4EA] w-full justify-center'>
                    <div>{feature.name}</div>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </Link>
        <div className='text-center mx-auto max-w-2xl lg:text-center mt-16 sm:mt-20'>
          <Link href='/appliances'>
            <Button>View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
