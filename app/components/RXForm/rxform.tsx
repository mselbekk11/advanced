'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Download, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { postData } from '@/app/utils/postData';

export default function Rxform() {
  let currentDate = new Date().toJSON().slice(0, 10);
  console.log(currentDate); // "2022-06-17"

  const [open, setOpen] = useState(false);

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');

  const [street, setStreet] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');

  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState('');
  const [date, setDate] = useState('');

  const [appliance, setAppliance] = useState('');
  const [position, setPosition] = useState('');
  const [clasp, setClasp] = useState('');
  const [spring, setSpring] = useState('');
  const [color, setColor] = useState('');

  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log(
      'Data',
      first,
      last,
      email,
      street,
      zip,
      city,
      phone,
      patient,
      date,
      appliance,
      position,
      clasp,
      spring,
      color,
      message
    );

    try {
      const res = await fetch('/api/rxform', {
        method: 'POST',
        body: JSON.stringify({
          first,
          last,
          email,
          street,
          zip,
          city,
          phone,
          patient,
          date,
          appliance,
          position,
          clasp,
          spring,
          color,
          message,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });

      setFirst('');
      setLast('');
      setEmail('');
      setStreet('');
      setZip('');
      setCity('');
      setPhone('');
      setPatient('');
      setDate('');
      setAppliance('');
      setPosition('');
      setClasp('');
      setSpring('');
      setColor('');
      setMessage('');
    } catch (err: any) {
      console.log('Err', err);
    }
  };

  const showToast = () => {
    toast.success('Form sent! We will be in touch shortly!');
  };

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
            <div className='bg-white flex flex-col items-center justify-center border-2 border-solid border-[#DFE4EA] rounded-lg p-8'>
              <Image src='/mouth.png' alt='mouth' width='400' height='500' />
              <div className='mt-8'>
                <a
                  href='https://res.cloudinary.com/dtjasyr7k/image/upload/v1709579163/rx-form_c9eaoh.pdf'
                  target='_blank'
                >
                  <Button variant='outline' className='mr-2'>
                    <Download className='mr-2 h-4 w-4' />
                    Download Form
                  </Button>
                </a>
                <Button
                  variant='outline'
                  className='ml-2'
                  onClick={() => setOpen(true)}
                >
                  <Palette className='mr-2 h-4 w-4' />
                  View Color Chart
                </Button>
              </div>
            </div>
            <form method='POST' onSubmit={onSubmit}>
              <div className='p-8 bg-white border-2 border-solid border-[#DFE4EA] rounded-lg'>
                <div className='bg-white grid grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-2'>
                  <input
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    type='text'
                    placeholder='First Name'
                    name='firstname'
                    id='firstname'
                    autoComplete='given-name'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    name='email'
                    id='email'
                    autoComplete='email'
                    placeholder='Email'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    type='text'
                    placeholder='Street address'
                    name='streetaddress'
                    id='street-address'
                    autoComplete='street-address'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    type='text'
                    placeholder='ZIP or postal code (optional)'
                    name='postalcode'
                    id='postal-code'
                    autoComplete='postal-code'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    type='text'
                    placeholder='City'
                    name='city'
                    id='city'
                    autoComplete='address-level2'
                    required
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type='tel'
                    autoComplete='tel'
                    placeholder='Phone'
                    required
                    name='phone'
                    id='phone'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  <input
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    type='text'
                    placeholder='Patient'
                    required
                    name='patient'
                    id='patient'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                  {/* <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <label htmlFor='date'>Pick up date</label>
                    <input
                      value={currentDate}
                      onChange={(e) => setDate(e.target.value)}
                      type='date'
                      placeholder={currentDate}
                      name='date'
                      id='date'
                      className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div> */}

                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      value={appliance}
                      onChange={(e) => setAppliance(e.target.value)}
                      id='appliance'
                      name='appliance'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Choose an Appliance
                      </option>
                      <option value='Hawley Retainer U/L'>
                        Hawley Retainer U/L
                      </option>
                      <option value='Hawley Retainer U/L 2X2 wire'>
                        Hawley Retainer U/L 2X2 wire
                      </option>
                      <option value='Dugonni Retainer'>Dugonni Retainer</option>
                      <option value='wraparound Retainer'>
                        Wraparound Retainer
                      </option>
                      <option value='Modified Spring Retainer'>
                        Modified Spring Retainer
                      </option>
                      <option value='Schwarz'>Schwarz</option>
                      <option value='Nance Holding Arch'>
                        Nance Holding Arch
                      </option>
                      <option value='Quad Helix Expansion W Arch'>
                        Quad Helix Expansion W Arch
                      </option>
                      <option value='Hydrax Rapid Palatal Expander'>
                        Hydrax Rapid Palatal Expander
                      </option>
                      <option value='Haas Palatal Seperator'>
                        Haas Palatal Seperator
                      </option>
                      <option value='Bonded R.P.E'>Bonded R.P.E</option>
                      <option value='Habit Crib'>Habit Crib</option>
                      <option value='6x6 Lingualarch'>6x6 Lingualarch</option>
                      <option value='Space Maintainer'>Space Maintainer</option>
                      <option value='Horseshoe Splint (BRUXISM)'>
                        Horseshoe Splint (BRUXISM)
                      </option>
                      <option value='Gelb/Mora'>Gelb/Mora</option>
                      <option value='Invisible Retainer/Essex'>
                        Invisible Retainer/Essex
                      </option>
                      <option value='Other - Specify Below'>
                        Other - Specify Below
                      </option>
                    </select>
                  </div>

                  <div className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      id='position'
                      name='position'
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
                      value={clasp}
                      onChange={(e) => setClasp(e.target.value)}
                      id='clasp'
                      name='clasp'
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
                      value={spring}
                      onChange={(e) => setSpring(e.target.value)}
                      id='spring'
                      name='spring'
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
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      id='color'
                      name='color'
                      required
                      className='w-full'
                    >
                      <option value='' disabled selected hidden>
                        Appliance Color
                      </option>
                      <option value='Any'>Any</option>
                      <option value='Wine'>Wine</option>
                      <option value='Black Cherry'>Black Cherry</option>
                      <option value='Fluoresent Pink'>Fluoresent Pink</option>
                      <option value='Raspberry'>Raspberry</option>
                      <option value='Cranberry'>Cranberry</option>
                      <option value='Cherry'>Cherry</option>
                      <option value='Route Beer Brown'>Route Beer Brown</option>
                      <option value='Persimon'>Persimon</option>
                      <option value='Tangerine'>Tangerine</option>
                      <option value='Gold'>Gold</option>
                      <option value='Amber'>Amber</option>

                      <option value='Any'>Lemon Yellow</option>
                      <option value='Fluorescent Yellow'>
                        Fluorescent Yellow
                      </option>
                      <option value='Apple Green'>Apple Green</option>
                      <option value='Grass Green'>Grass Green</option>
                      <option value='Emerald Green'>Emerald Green</option>
                      <option value='Teal Green'>Teal Green</option>
                      <option value='Aqua Blue'>Aqua Blue</option>
                      <option value='Turqouise'>Turqouise</option>
                      <option value='Caribbean Blue'>Caribbean Blue</option>
                      <option value='Ice Blue'>Ice Blue</option>
                      <option value='Special Med Blue'>Special Med Blue</option>

                      <option value='Saphire Blue'>Saphire Blue</option>
                      <option value='Colbat Blue'>Colbat Blue</option>
                      <option value='Light Prutple'>Light Prutple</option>
                      <option value='Purple'>Purple</option>
                      <option value='Light Violet'>Light Violet</option>
                      <option value='Violet'>Violet</option>
                      <option value='Black Onyx Liquid'>
                        Black Onyx Liquid
                      </option>
                      <option value='Crystal Clear'>Crystal Clear</option>
                      <option value='Standard Pink'>Standard Pink</option>
                      <option value='Tinted Clear'>Tinted Clear</option>

                      <option value='Luminary Red'>Luminary Red</option>
                      <option value='Luminary Pink'>Luminary Pink</option>
                      <option value='Luminary Coral Red'>
                        Luminary Coral Red
                      </option>
                      <option value='Luminary Orange'>Luminary Orange</option>
                      <option value='Luminary Blaze Yellow'>
                        Luminary Blaze Yellow
                      </option>
                      <option value='Luminary Yellow'>Luminary Yellow</option>
                      <option value='Luminary Green'>Luminary Green</option>
                      <option value='Luminary Teal Green'>
                        Luminary Teal Green
                      </option>
                      <option value='Luminary Blue'>Luminary Blue</option>
                      <option value='Luminary Blueberry'>
                        Luminary Blueberry
                      </option>
                      <option value='Luminary Purple'>Luminary Purple</option>
                      <option value='Luminary Chartreuse'>
                        Luminary Chartreuse
                      </option>

                      <option value='Royal Red'>Royal Red</option>
                      <option value='Royal Pink'>Royal Pink</option>
                      <option value='Royal Coral Red'>Royal Coral Red</option>
                      <option value='Royal Orange'>Royal Orange</option>
                      <option value='Royal Blaze Yellow'>
                        Royal Blaze Yellow
                      </option>
                      <option value='Royal Yellow'>Royal Yellow</option>
                      <option value='Royal Green'>Royal Green</option>
                      <option value='Royal Teal Green'>Royal Teal Green</option>
                      <option value='Royal Blue'>Royal Blue</option>
                      <option value='Royal Blueberry'>Royal Blueberry</option>
                      <option value='Royal Purple'>Royal Purple</option>

                      <option value='Crimson Red'>Crimson Red</option>
                      <option value='Candy Apple Red'>Candy Apple Red</option>
                      <option value='Cameo Pink'>Cameo Pink</option>
                      <option value='Sunriuse Orange'>Sunriuse Orange</option>
                      <option value='Mustard Yellow'>Mustard Yellow</option>
                      <option value='Banana Yellow'>Banana Yellow</option>
                      <option value='Shamrock Green'>Shamrock Green</option>
                      <option value='Fern Green'>Fern Green</option>
                      <option value='Watermelon Green'>Watermelon Green</option>
                      <option value='Sky Blue'>Sky Blue</option>

                      <option value='Baby Blue'>Baby Blue</option>
                      <option value='Lapis Blue'>Lapis Blue</option>
                      <option value='Nautical Blue'>Nautical Blue</option>
                      <option value='Amethyst'>Amethyst</option>
                      <option value='Dove Gray'>Dove Gray</option>
                      <option value='Dolphin Gray'>Dolphin Gray</option>
                      <option value='Black Opaque'>Black Opaque</option>
                      <option value='White Opaque'>White Opaque</option>
                      <option value='Caramel Tan'>Caramel Tan</option>
                      <option value='Chocolate Brown'>Chocolate Brown</option>

                      <option value='Pink Pearl'>Pink Pearl</option>
                      <option value='Peach Pearl'>Peach Pearl</option>
                      <option value='Yellow Pearl'>Yellow Pearl</option>
                      <option value='Green Pearl'>Green Pearl</option>
                      <option value='Aqua Pearl'>Aqua Pearl</option>
                      <option value='Blue Pearl'>Blue Pearl</option>
                      <option value='Lavander Pearl'>Lavander Pearl</option>
                      <option value='Lilac Pearl'>Lilac Pearl</option>
                      <option value='Pearl White'>Pearl White</option>
                      <option value='Midnight Black'>Midnight Black</option>

                      <option value='Opalescent Sparkle'>
                        Opalescent Sparkle
                      </option>
                      <option value='Silver Sparkle'>Silver Sparkle</option>
                      <option value='Red Sparkle'>Red Sparkle</option>
                      <option value='Golden Orange'>Golden Orange</option>
                      <option value='Copper Sparkle'>Copper Sparkle</option>
                      <option value='Salmon Pink'>Salmon Pink</option>
                      <option value='Aztec Gold'>Aztec Gold</option>
                      <option value='Kiwi Sparkle'>Kiwi Sparkle</option>
                      <option value='Green Sparkle'>Green Sparkle</option>
                      <option value='Hunter Green'>Hunter Green</option>
                      <option value='Aqua Sparkle'>Aqua Sparkle</option>
                      <option value='Crystal Blue'>Crystal Blue</option>
                      <option value='Turquoise Sparkle'>
                        Turquoise Sparkle
                      </option>

                      <option value='Blue Sparkle'>Blue Sparkle</option>
                      <option value='Purple Sparkle'>Purple Sparkle</option>
                      <option value='Lavender'>Lavender</option>
                      <option value='Fuchsia'>Fuchsia</option>
                      <option value='Black Sparkle'>Black Sparkle</option>
                      <option value='Red Hatter'>Red Hatter</option>
                      <option value='Tutti Frutti'>Tutti Frutti</option>
                      <option value='Carnival Blue'>Carnival Blue</option>
                      <option value='Miss Priss'>Miss Priss</option>
                      <option value='Peacock'>Peacock</option>
                      <option value='Pastel Rainbow'>Pastel Rainbow</option>
                      <option value='Disco Rainbow'>Disco Rainbow</option>
                      <option value='USA Sparkle'>USA Sparkle</option>
                    </select>
                  </div>
                </div>

                <div className='bg-white grid grid-cols-1 lg:max-w-none pt-2'>
                  <label htmlFor='date' className='text-xs p-2'>Pick up date</label>
                  <input
                    value={currentDate}
                    onChange={(e) => setDate(e.target.value)}
                    type='date'
                    placeholder={currentDate}
                    name='date'
                    id='date'
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>

                <div className='bg-white grid grid-cols-1 lg:max-w-none pt-8'>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name='message'
                    id='message'
                    placeholder='Additional Information'
                    rows={4}
                    className='block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
                <div className='bg-white grid grid-cols-1 lg:max-w-none pt-8'>
                  <Button type='submit' onClick={showToast}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </dl>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[1000px] sm:p-6'>
                  <div>
                    {/* <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                      <CheckIcon
                        className='h-6 w-6 text-green-600'
                        aria-hidden='true'
                      />
                    </div> */}
                    <div className='text-center'>
                      <Dialog.Title
                        as='h3'
                        className='text-base font-semibold leading-6 text-gray-900'
                      >
                        Color Chart
                      </Dialog.Title>
                      <div className='mt-2'>
                        <Image
                          src='/color-chart.jpeg'
                          alt='color chart'
                          width='1000'
                          height='400'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6'>
                    <Button
                      type='button'
                      className='inline-flex w-full justify-center '
                      onClick={() => setOpen(false)}
                    >
                      Go back to RX Form
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
