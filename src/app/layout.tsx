import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Poppins, Syncopate } from 'next/font/google';
// import Head from 'next/head';
import * as React from 'react';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/sonner';

import { siteConfig } from '@/constant/config';

const ProgressBarProvider = dynamic(
  () => import('@/components/providers/ProgressBarProvider'),
);
const ReactQueryProvider = dynamic(
  () => import('@/components/providers/ReactQueryProvider'),
);
const RecoilContextProvider = dynamic(
  () => import('@/components/providers/RecoilContextProvider'),
);
const NextThemeProvider = dynamic(
  () => import('@/components/providers/ThemeProvider'),
);

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: 'https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA',
        width: 1200,
        height: 630,
        alt: 'electo-image',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      `https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA`,
    ],
    creator: '@ileaf_solutions',
  },
  authors: [
    {
      name: 'Jaison John',
      url: 'https://google.com',
    },
  ],
};

const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

const SyncopateFont = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-syncopate',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${PoppinsFont.variable} ${SyncopateFont.variable}`}
      suppressHydrationWarning
    >
      {/* <Head>
        <meta
          property='og:image'
          content='https://server.electoai.com/og-image.png'
        />
        <meta property='og:image:width' content='500' />
        <meta property='og:image:height' content='500' />
        <meta property='og:title' content='your website page title' />
        <meta property='og:url' content='ps://server.electoai.com' />
        <meta property='og:site_name' content='site name and content etc' />
        <meta property='og:description' content='description of site' />
        <meta property='og:type' content='Website' />
      </Head> */}
      <body>
        <NextThemeProvider>
          <ReactQueryProvider>
            <RecoilContextProvider>
              <Toaster />
              <ProgressBarProvider>{children}</ProgressBarProvider>
            </RecoilContextProvider>
          </ReactQueryProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
