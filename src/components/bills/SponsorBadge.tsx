import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const SponsorBadge = (props: any) => {
  const { image, name, representativeId } = props;
  return (
    <Link
      href={
        representativeId
          ? `/account?name=${name}&id=${representativeId}&tab=biography`
          : '#'
      }
    >
      <div
        className={cn(
          'font-poppins flex gap-2 items-center border border-gray-200 dark:border-gray-800 rounded-3xl w-fit h-fit p-1',
          {
            'border-black': representativeId,
          },
        )}
      >
        <Avatar className='flex items-center w-8 h-8'>
          <AvatarImage src={image} alt='sponsor' />
          <AvatarFallback>
            {name[0] || ''}
            {name[1] || ''}
          </AvatarFallback>
        </Avatar>
        <p className='text-sm pr-1'>{name}</p>
      </div>
    </Link>
  );
};

export default SponsorBadge;
