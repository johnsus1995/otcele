import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSwitcher = (props: TabSwitcherProps) => {
  const { tabs, activeTab, setActiveTab } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]); // Array of refs for each tab

  const onClickScroll = (direction: string) => {
    const scrollAmount = direction === 'right' ? 100 : -100;

    containerRef.current?.scrollTo({
      left: (containerRef.current.scrollLeft || 0) + scrollAmount,
      behavior: 'smooth',
    });
  };

  const onClickTab = (tab: string, index: number) => {
    setActiveTab(tab);

    const item = tabRefs.current[index];

    if (item && containerRef.current) {
      const itemRect = item.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const offset =
        itemRect.left -
        containerRect.left +
        itemRect.width / 2 -
        containerRect.width / 2;

      containerRef.current.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='flex justify-between items-center gap-3'>
      <ChevronLeft
        className='w-6 h-5 bg-gray-200 rounded-2xl dark:bg-gray-900 dark:text-gray-600'
        role='button'
        onClick={() => onClickScroll('left')}
      />
      <div
        ref={containerRef}
        className='flex gap-1 md:gap-4 w-full overflow-auto no-scrollbar'
      >
        {tabs.map((tab: string, index: any) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)} // Assign ref to each tab
            onClick={() => onClickTab(tab, index)}
            style={{
              overflowWrap: 'normal',
              wordWrap: 'normal',
              whiteSpace: 'nowrap',
            }}
            className={cn(
              'py-1 px-2 border border-gray-300 dark:border-gray-800 text-muted-foreground rounded-2xl text-sm',
              {
                'border-black bg-black text-white dark:bg-gray-800':
                  activeTab === tab,
              },
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <ChevronRight
        className='w-6 h-5 bg-gray-200 rounded-full dark:bg-gray-900 dark:text-gray-600'
        role='button'
        onClick={() => onClickScroll('right')}
      />
    </div>
  );
};

export default TabSwitcher;
