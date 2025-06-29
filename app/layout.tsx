import '@/app/ui/global.css';
import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | KiwiCare',
    default: 'Dashboard | KiwiCare',
  },
  description:
    'Your trusted platform for connecting providers and customers across New Zealand.',
  metadataBase: new URL('https://kiwicare.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>KiwiCare</title>
        <link rel="apple-touch-icon" href="/kiwicare-black.png" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
