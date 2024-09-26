import { LayoutList, NotepadText, SquareUserRound } from 'lucide-react';
import React from 'react';
import { useRecoilState } from 'recoil';

import RightSidebarListWidget from '@/components/others/RightSidebarListWidget';
import RightSidebarRouteWidget from '@/components/others/RightSidebarRouteWidget';

import { billState } from '@/store/bill.atom';

const RightSidebarCommon = () => {
  const [{ billType }] = useRecoilState(billState);

  return (
    <>
      <RightSidebarRouteWidget
        icon={<NotepadText />}
        label='My Voting Records'
        href='/voting-records'
      />
      <RightSidebarRouteWidget
        icon={<LayoutList />}
        label='General Polling'
        href='/general-polling'
      />
      <RightSidebarRouteWidget
        icon={<SquareUserRound />}
        label='Directory'
        href='/common-directory'
      />

      <div className='h-[calc(100vh_-_281px)] overflow-auto no-scrollbar flex flex-col gap-3 pb-4'>
        <RightSidebarListWidget
          title='Trending Bills'
          href={`trends?bill_type=${billType}&category=trendingBills`}
          category='trending'
        />
        <RightSidebarListWidget
          title='Popular topics'
          href={`trends?bill_type=${billType}&category=popularTopics`}
          category='popular'
        />
        <RightSidebarListWidget
          title='Common grounds'
          href={`trends?bill_type=${billType}&category=commonGrounds`}
          category='common'
        />
        <RightSidebarListWidget
          title='Disputed Areas'
          href={`trends?bill_type=${billType}&category=disputedAreas`}
          category='disputed'
        />
        <RightSidebarListWidget
          title='Officials and Voters'
          href={`trends?bill_type=${billType}&category=officialsAndVoters`}
          category='officals-vs-voters'
        />
      </div>
    </>
  );
};

export default RightSidebarCommon;
