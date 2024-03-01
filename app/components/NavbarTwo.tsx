'use client';

// import {
//   RegisterLink,
//   LoginLink,
//   LogoutLink,
// } from '@kinde-oss/kinde-auth-nextjs/components';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Phone } from 'lucide-react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Appliances', href: '/appliances' },
  { name: 'Digital Printing', href: '/digital-printing' },
  { name: 'About', href: '/about' },
  { name: 'RX Form', href: '/rxform' },
];

export function NavbarTwo() {
  // const { isAuthenticated, getUser } = getKindeServerSession();
  // const user = await getUser();
  // user?.picture;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='inset-x-0 top-0 z-50 absolute'>
      <nav
        className='max-w-7xl container flex items-center justify-between p-6 lg:px-8'
        aria-label='Global'
      >
        <div className='flex lg:flex-1'>
          <Link href='/'>
            <Image src='/logo.svg' alt='logo' width='170' height='50' />
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-12'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='text-xs font-semibold leading-6 text-slate-900'
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className='hidden lg:flex lg:flex-1 lg:justify-end gap-x-5'>
          <a href='tel:+1 (415) 661-9296'>
            <Button>
              <Phone color='white' size='16' className='mr-2' />
              +1 (415) 661-9296
            </Button>
          </a>
        </div>
      </nav>
      <Dialog
        as='div'
        className='lg:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-50' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <Link href='/'>
              {/* <h1 className='font-bold text-2xl'>Advanced</h1> */}
              <Image src='/logo.svg' alt='logo' width='170' height='50' />
            </Link>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='py-6'>
                <div className='flex items-center gap-x-5'>
                  <a href='tel:+1 (415) 661-9296'>
                    <Button>
                      <Phone color='white' size='16' className='mr-2' />
                      Call +1 (415) 661-9296
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
