import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function Rxform() {
  return (
    <div className='bg-[#f1f1f1] pb-24 pt-36 lg:pb-44 lg:pt-48'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <h2 className='inline-block rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
            Please fill out and submit
          </h2>
          <p className='mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            RX Form
          </p>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            We use the highest quality Domestic and International materials,
            always at competitive prices
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <dl className='grid grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2'>
            <div className='bg-white flex items-center justify-center'>
              <Image src='/mouth.png' alt='mouth' width='400' height='500' />
            </div>
            <form action='#' method='POST'>
              <div className='p-8 bg-white'>
                <div className='bg-white grid grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-2'>
                  <input
                    type='text'
                    placeholder='First Name'
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    name='firstname'
                    id='firstname'
                    autoComplete='given-name'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='text'
                    placeholder='Last Name'
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    name='lastname'
                    id='lastname'
                    autoComplete='family-name'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='email'
                    name='email'
                    id='email'
                    autoComplete='email'
                    placeholder='Email'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='text'
                    placeholder='Street address'
                    name='street-address'
                    id='street-address'
                    autoComplete='street-address'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='text'
                    placeholder='ZIP or postal code (optional)'
                    name='postal-code'
                    id='postal-code'
                    autoComplete='postal-code'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='text'
                    placeholder='City'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='tel'
                    autoComplete='tel'
                    placeholder='Phone'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='text'
                    placeholder='Patient'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    type='date'
                    placeholder='Delivery Date'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />

                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Choose an Appliance
                      </option>
                      <option value='Hawley Retainer'>
                        Hawley Retainer U/L
                      </option>
                      <option value='Hawley Retainer'>
                        Hawley Retainer U/L 2X2 wire
                      </option>
                      <option value='Dugonni Retainer'>Dugonni Retainer</option>
                      <option value='wraparound Retainer'>
                        Wraparound Retainer
                      </option>
                      <option value='Dugonni Retainer'>
                        Modified Spring Retainer
                      </option>
                      <option value='Dugonni Retainer'>Schwarz</option>
                      <option value='Dugonni Retainer'>
                        Nance Holding Arch
                      </option>
                      <option value='Dugonni Retainer'>
                        Quad Helix Expansion W Arch
                      </option>
                      <option value='Dugonni Retainer'>
                        Hydrax Rapid Palatal Expander
                      </option>
                      <option value='Dugonni Retainer'>
                        Haas Palatal Seperator
                      </option>
                      <option value='Dugonni Retainer'>Bonded R.P.E</option>
                      <option value='Dugonni Retainer'>Habit Crib</option>
                      <option value='Dugonni Retainer'>6x6 Lingualarch</option>
                      <option value='Dugonni Retainer'>Space Maintainer</option>
                      <option value='Dugonni Retainer'>
                        Horseshoe Splint (BRUXISM)
                      </option>
                      <option value='Dugonni Retainer'>Gelb/Mora</option>
                      <option value='Dugonni Retainer'>
                        Invisible Retainer/Essex
                      </option>
                      <option value='Dugonni Retainer'>
                        Other - Specify Below
                      </option>
                      <option value='Schwartz'>Schwarz</option>
                    </select>
                  </div>

                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Upper / Lower / Both
                      </option>
                      <option value='Upper'>Upper</option>
                      <option value='Lower'>Lower</option>
                      <option value='Both'>Both</option>
                    </select>
                  </div>

                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Choose a Clasp
                      </option>
                      <option value='Adams Clasp'>Adams Clasp</option>
                      <option value='Ball Clasp'>Ball Clasp</option>
                      <option value='C Clasp'>C Clasp</option>
                      <option value='Other - Specify Below'>
                        Other - Specify Below
                      </option>
                    </select>
                  </div>
                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Spring or Specify Type
                      </option>
                      <option value='Spring'>Spring</option>
                      <option value='Specify Type Below'>
                        Specify Type Below
                      </option>
                    </select>
                  </div>
                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Appliance Color
                      </option>
                      <option value='Spring'>Any</option>
                      <option value='Spring'>Red</option>
                      <option value='Spring'>Blue</option>
                      <option value='Spring'>Green</option>
                      <option value='Spring'>Yellow</option>
                    </select>
                  </div>
                </div>
                <div className='bg-white grid grid-cols-1 lg:max-w-none pt-8'>
                  <textarea
                    name='message'
                    id='message'
                    placeholder='Additional Information'
                    rows={4}
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    defaultValue={''}
                  />
                </div>
                <div className='bg-white grid grid-cols-1 lg:max-w-none pt-8'>
                  <Button type='submit'>Submit</Button>
                </div>
              </div>
            </form>
          </dl>
        </div>
      </div>
    </div>
  );
}
