import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    name: 'Removable Appliances',
    src: '/A.png',
    subname: 'Retainers',
    products: [
      {
        one: 'Hawley Retainer',
        two: 'Wraparound Retainer',
        three: 'Wraparound San Antonio types',
        four: 'Dugoni Retainer',
        five: 'Phase I Retainer (AOL Design)',
        six: 'Phase I Standard Retainer (2x2)',
        seven: 'Spring Retainer',
        eight: 'Modified Spring Retainer',
        nine: 'Other (or Custom Design)',
        ten: 'Schwarz Appliance',
        eleven: 'Sagittal Appliance',
        twelve: 'Class III Sagittal Appliance',
        thirteen: 'NORD Appliance',
        fourteen: 'Ant. Post. Active Expansion Appliance',
        fifteen: 'Other (or Custom Design)',
      },
    ],
  },
  {
    name: 'Fixed Appliances',
    src: '/B.png',
    subname: 'Functional',
    products: [
      {
        one: 'Nance Holding',
        two: 'Quad Helix Expansion with Arch',
        three: 'Hyrax Rapid Palatal Expanders',
        four: 'Haas Palatal Separator',
        five: 'Bonded R.P.E.',
        six: 'Habit Crib',
        seven: '6x6 Lingual Arch',
        eight: 'Space Maintainer',
        nine: 'Bionators',
        ten: 'Twinblock Retainers',
        eleven: 'Twinblock Expansion',
        twelve: 'Other (or Custom)',
      },
    ],
  },
  {
    name: 'TMJ Appliances',
    src: '/C.png',
    subname: 'Splint',
    products: [
      {
        one: 'Horseshoe Splint (Bruxism)',
        two: 'Gelb/Mora',
        three: 'Athletic Mouthguard',
        four: 'Bleaching Tray',
        five: 'Invisible Retainer/Essex',
        six: 'Other (or Custom)',
      },
    ],
  },
];

export default function Appliances() {
  return (
    <div className='bg-[#f1f1f1] pb-24 pt-36 lg:pb-44 lg:pt-48'>
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
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <dl className='grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
            {features.map((feature) => (
              <div
                key={feature.name}
                className='flex flex-col bg-[#fff] items-center border-2 border-solid border-[#DFE4EA] rounded-lg'
              >
                <div className='flex items-center text-base font-semibold leading-7 text-gray-900 px-4 py-8 border-b-2 border-solid border-[#DFE4EA] w-full justify-center'>
                  <div>{feature.name}</div>
                </div>

                <div className='flex w-full justify-center items-center py-4'>
                  <Image
                    src={feature.src}
                    alt='appliance'
                    width='194'
                    height='168'
                  />
                </div>

                <div className='pb-4 lg:pb-4 w-full'>
                  <div className='flex items-center text-base font-semibold leading-7 text-indigo-600 px-4 py-8 border-t-2 border-solid border-[#DFE4EA] w-full justify-center'>
                    <div>{feature.subname}</div>
                  </div>

                  <div className='flex lg:items-center text-base px-4 py-8w-full lg:justify-center'>
                    {feature.products.map((product, index) => (
                      <div key={index}>
                        {Object.entries(product).map(([key, value]) => (
                          <div
                            key={key}
                            className='flex items-center p-2 w-full'
                          >
                            <CheckCircle2
                              color='#00940F'
                              size={20}
                              className='mr-2'
                            />
                            <p className='text-md leading-8 text-gray-600'>{`${value}`}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
