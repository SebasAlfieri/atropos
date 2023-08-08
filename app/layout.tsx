import '@/styles/globals.css';
import React from 'react';
import Script from 'next/script';
import localFont from 'next/font/local';

export type RootLayoutProps = {
  children: React.ReactNode;
};

// export const metadata = baseMetaData;

const Chakra = localFont({
  src: [
    {
      path: './fonts/ChakraPetch-Light.woff',
      weight: '100',
      style: 'normal'
    },
    {
      path: './fonts/ChakraPetch-Medium.woff',
      weight: 'normal',
      style: 'normal'
    },
    {
      path: './fonts/ChakraPetch-SemiBold.woff',
      weight: 'bold',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--f-chakra',
  preload: true
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${Chakra.variable}`}>{children}</body>
    </html>
  );
}
