import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

// DÁP theme and reset are imported inside globals.css, into cascade layers
import '@/app/(frontend)/globals.css';
import ClientApplication from '@/app/(frontend)/components/ClientApplication';

const inter = localFont({
  src: './fonts/InterVariable.woff2',
  display: 'swap',
  weight: '500 700',
  style: 'normal',
  declarations: [
    { prop: 'font-feature-settings', value: "'liga' 1,'calt' 1,'ss02' 1" },
    { prop: 'font-variation-settings', value: "'slnt' 0" },
    { prop: 'font-optical-sizing', value: 'auto' },
  ],
});

export const metadata: Metadata = {
  description: 'Álláskeresők Digitális Kiskönyve (Demo)',
  title: 'Digi Kiskönyv',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="hu" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ClientApplication>
          <main>{children}</main>
        </ClientApplication>
      </body>
    </html>
  );
}
