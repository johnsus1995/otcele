'use client';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const BillComments = dynamic(() => import('@/components/bills/BillComments'));
const RightSidebarCommon = dynamic(
  () => import('@/components/others/RightSidebarCommon'),
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const pathName = usePathname();
  const isMapPage =
    pathName.includes('/federal-map') || pathName.includes('/state-map');

  const renderRightSidebar = () => {
    if (isMapPage) return null;

    if (id) {
      return (
        <div className=''>
          <BillComments billId={id} />
        </div>
      );
    }
    return (
      <div className='flex flex-col gap-3 pl-[16px] pt-[16px] w-full'>
        <RightSidebarCommon />
      </div>
    );
  };

  return (
    <div className='flex justify-between w-full'>
      <Head>
        <link rel='preconnect' href='https://server-api.electoai.com' />
      </Head>
      <div
        className={cn(
          'md:w-[385px] md:overflow-auto w-full lg:w-[550px] md:border-r border-gray-200 dark:border-gray-800',
          {
            'border-none md:w-full lg:w-full': isMapPage,
          },
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'hidden md:flex justify-left  md:w-[235px] lg:w-[336px]',
          {
            'hidden md:!w-0': isMapPage,
          },
        )}
      >
        {renderRightSidebar()}
      </div>
    </div>
  );
}
