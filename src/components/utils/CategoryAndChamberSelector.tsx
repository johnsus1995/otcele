'use client';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CategoryAndChamberSelector(props: any) {
  const { trigger, open, onOpenChange, onSelect, selectable, resetFilter } =
    props;

  return (
    <DropdownMenu open={open} onOpenChange={() => onOpenChange(!open)}>
      <DropdownMenuTrigger asChild={false}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={5}
        align='end'
        alignOffset={15}
        className='p-0'
      >
        <DropdownMenuLabel className='flex justify-between items-center '>
          <p>Filter</p>
          <div className='flex gap-2 items-center'>
            {selectable.category && (
              <button onClick={resetFilter} className='text-xs font-semibold'>
                Reset
              </button>
            )}
            <X
              className='h-5 w-5 text-black dark:text-gray-600'
              role='button'
              onClick={() => onOpenChange(!open)}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='mb-0 ' />
        <div className='flex text-sm text-muted-foreground '>
          <div className='border-r border-r-gray-200 dark:border-gray-800 flex flex-col justify-between items-start'>
            <button
              onClick={() => onSelect('federal', 'category')}
              className={cn(
                'hover:bg-gray-200 p-2 w-full text-start h-full dark:hover:bg-gray-800',
                {
                  'bg-gray-200 dark:bg-gray-600':
                    selectable.category === 'federal',
                },
              )}
            >
              Federal
            </button>
            <button
              onClick={() => onSelect('state', 'category')}
              className={cn(
                'hover:bg-gray-200 p-2 w-full text-start h-full dark:hover:bg-gray-800',
                {
                  'bg-gray-200 dark:bg-gray-600':
                    selectable.category === 'state',
                },
              )}
            >
              State
            </button>
          </div>
          <div className='flex flex-col justify-between items-start'>
            <button
              onClick={() => onSelect('lower', 'chamber')}
              className={cn(
                'hover:bg-gray-200 p-2 w-full text-start h-full dark:hover:bg-gray-800',
                {
                  'bg-gray-200 dark:bg-gray-600':
                    selectable.chamber === 'lower',
                },
              )}
            >
              House of Representatives (lower)
            </button>
            <button
              onClick={() => onSelect('upper', 'chamber')}
              className={cn(
                'hover:bg-gray-200 p-2 w-full text-start h-full dark:hover:bg-gray-800',
                {
                  'bg-gray-200 dark:bg-gray-600':
                    selectable.chamber === 'upper',
                },
              )}
            >
              Senate (upper)
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
