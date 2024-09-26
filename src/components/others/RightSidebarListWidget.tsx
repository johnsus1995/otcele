'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';

import { billState } from '@/store/bill.atom';
import { userAtom } from '@/store/user.atom';

import { getTrendingFederalBills, getTrendingStateBills } from '@/apis/bills';

interface RightSidebarListWidgetProps {
  title: string;
  href: string;
  category: string;
}

const RightSidebarListWidget = (props: RightSidebarListWidgetProps) => {
  const { title, href, category } = props;
  const [{ billType }] = useRecoilState(billState);
  const [user] = useRecoilState(userAtom);

  const { data, isLoading } = useQuery({
    queryKey: ['get-trending-bills-home', billType, category],
    queryFn: async () => {
      const billsData =
        billType === 'federal'
          ? await getTrendingFederalBills({}, category)
          : await getTrendingStateBills({ stateId: user.state }, category);

      return await billsData?.data;
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return null;

  if (!data.length && !isLoading) return null;

  return (
    <div className='bg-secondaryAsh dark:bg-gray-800 h-fit py-[16px] rounded-2xl flex flex-col gap-3'>
      <h4 className='font-semibold text-base px-[16px] dark:text-muted-foreground'>
        {title}
      </h4>
      <ul className='flex flex-col'>
        {data?.slice(0, 5)?.map((bill: any, index: any) => (
          <Link
            href={`/bills/${bill?.billId}?bill_type=${billType}`}
            key={bill.billId}
          >
            <li className='hover:bg-[#efeff1] dark:hover:bg-gray-700 px-[16px] py-[10px]  text-sm'>
              <p className='mb-1 dark:text-gray-500'>{`#${index + 1}- ${bill.identifier}`}</p>
              <p className='text-muted-foreground'>{bill.billTitle}</p>
            </li>
          </Link>
        ))}
      </ul>
      <Link href={`/${href}`} className='w-[120px] px-[16px]'>
        <Button
          className=' rounded-full mt-2 dark:bg-black dark:text-gray-400'
          type='button'
          disabled={false}
          text='View All'
          loading={false}
        />
      </Link>
    </div>
  );
};

export default RightSidebarListWidget;
