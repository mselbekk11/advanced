import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { Navbar } from './components/Navbar';
import { NavbarTwo } from './components/NavbarTwo';
import FooterTwo from './components/Home/FooterTwo';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Advanced Ortho Lab',
  description:
    'Proudly serving the Dental Community for 3 generations. We use the highest quality materials available: the best German, Italian and American-made. All of our appliances have a one year unconditional guarantee.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/* <Navbar /> */}
        <ToastContainer />
        <NavbarTwo />
        {children}
        <Analytics />
        <FooterTwo />
      </body>
    </html>
  );
}
