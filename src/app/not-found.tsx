import { AlertOctagon } from 'lucide-react';
import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <AlertOctagon className='drop-shadow-glow animate-flicker text-red-500 h-32 w-32' />
          <h1 className='mt-4 text-2xl'>Page Not Found</h1>
          <a href='/' className='border border-gray-300 p-2 mt-4 rounded-xl'>
            Back to home
          </a>
        </div>
      </section>
    </main>
  );
}
