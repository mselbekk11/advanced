// 'use client';

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Appliances', href: '/appliances' },
  { name: 'Digital Printing', href: '/digital-printing' },
  { name: 'About', href: '/about' },
  { name: 'RX Form', href: '/rxform' },
];

export async function Navbar() {
  const { isAuthenticated } = getKindeServerSession();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='inset-x-0 top-0 z-50 absolute'>
      <nav
        className='max-w-7xl container flex items-center justify-between p-6 lg:px-8'
        aria-label='Global'
      >
        <div className='flex lg:flex-1'>
          <Link href='/'>
            <h1 className='font-bold text-2xl'>Advanced</h1>
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
            // onClick={() => setMobileMenuOpen(true)}
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
        {(await isAuthenticated()) ? (
          <div className='hidden lg:flex lg:flex-1 lg:justify-end gap-x-5'>
            <LogoutLink>
              <Button>Log out</Button>
            </LogoutLink>
          </div>
        ) : (
          <div className='hidden lg:flex lg:flex-1 lg:justify-end gap-x-5'>
            <LoginLink>
              <Button>Sign in</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant='secondary'>Sign up</Button>
            </RegisterLink>
          </div>
        )}
      </nav>
      {/* <Dialog
        as='div'
        className='lg:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-50' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <Link href='/'>
              <h1 className='font-bold text-2xl'>Advanced</h1>
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
                    className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className='py-6'>
                <div className='flex items-center gap-x-5'>
                  <Button>Sign in</Button>
                  <Button variant='secondary'>Sign up</Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog> */}
    </header>
  );
}
