import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = () => (
  <div className='px-4 flex flex-col gap-3'>
    <Skeleton className='h-[275px] w-full' />
    <Skeleton className='h-[5px] w-1/2' />
    <Skeleton className='h-[30px] w-full' />
    <Skeleton className='h-[30px] w-full' />
    <Skeleton className='h-[30px] w-full' />
  </div>
);

export default ChartSkeleton;
