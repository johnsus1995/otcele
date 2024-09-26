'use client';

import { CircleUserRound, ScrollText } from 'lucide-react';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useEffect, useState } from 'react';

import { promiseOptions } from '@/components/utils/SearchInput';

const MobileSearch = (props: any) => {
  // debugger
  const router = useNpRouter();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [result, setResult] = useState<any>([]);

  const onclickEntity = (option: any) => {
    props.setIsOpen(false);
    if (option?.entity === 'bills') {
      return router.push(
        `/bills/${option.value}?bill_type=${option.bill_type}`,
      );
    }
    return router.push(`/account?name=${option?.label}&id=${option?.value}`);
  };

  useEffect(() => {
    promiseOptions(searchKeyword).then((res: any) => {
      setResult([...res]);
      return res;
    });
  }, [searchKeyword]);

  return (
    <div className='w-full h-[99%] relative shadow-2xl border-y-1'>
      <div className='px-4 py-3 border-b border-gray-200 w-full flex items-center'>
        <p className='font-semibold'>Search</p>
      </div>
      <input
        type='text'
        className='border-b border-gray-200 w-full px-2 py-2 text-sm shadow-xl'
        placeholder='Search by bill, official, sponsor, etc...'
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <div className=' h-full overflow-auto no-scrollbar flex flex-col gap-1 pb-28'>
        {result.map((item: any) => {
          return (
            <button
              key={item.value}
              onClick={() => onclickEntity(item)}
              className='bg-gray-100 pl-2 py-2 w-full'
            >
              <div className='flex justify-start items-start gap-2'>
                {item.entity === 'bills' ? (
                  <ScrollText className='w-5 h-5 text-gray-400' />
                ) : (
                  <CircleUserRound className='w-5 h-5 text-gray-400' />
                )}
                <p className='text-sm truncate'>{item.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSearch;
