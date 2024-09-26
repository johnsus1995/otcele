'use client'; // Error components must be Client Components

import { AlertTriangle } from 'lucide-react';
import * as React from 'react';
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
    ReactGA.event({
      category: 'unhandled_rejection',
      action: 'page_load',
      nonInteraction: true,
    });
  }, [error]);

  return (
    <main>
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <AlertTriangle className='drop-shadow-glow animate-flicker text-red-500 w-32 h-32' />
          <h1 className='mt-4 text-2xl'>Oops, something went wrong!</h1>
          <div className='flex gap-2'>
            <button
              onClick={reset}
              className='mt-4 border border-gray-300 p-2 rounded-xl'
            >
              Try again
            </button>
            <a
              href='/bills'
              className='border border-gray-300 p-2 mt-4 rounded-xl'
            >
              Back to home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
