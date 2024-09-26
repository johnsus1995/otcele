'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

const FederalBillMap = dynamic(
  () => import('@/components/bills/bill-map/federalMap'),
  {
    loading: () => <p>Loading...</p>,
  },
);

const MapSideBarAnalytics = dynamic(
  () => import('@/components/bills/bill-map/mapSideBarAnalytics'),
  {
    loading: () => <p>Loading...</p>,
  },
);

const MapSideBarComments = dynamic(
  () => import('@/components/bills/bill-map/MapSideBarComments'),
  {
    loading: () => <p>Loading...</p>,
  },
);

import dynamic from 'next/dynamic';
import ReactGA from 'react-ga4';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

export default function MapPage({ params }: any) {
  const searchParams = useSearchParams();
  const sheetView: any = searchParams.get('view');
  const bill_type = searchParams.get('bill_type');

  const [{ image, firstName, lastName }, setUserState] =
    useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const [showSheet, setShowSheet] = React.useState(false);
  const [chamber, setChamber] = React.useState('upper');
  const [overall, setOverall] = React.useState<any>([]);

  const onSelectStateCategory = (e: any) => {
    setChamber(e.target.value);
  };

  React.useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Electo Map' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (sheetView?.length) {
      setShowSheet(true);
    }
  }, [sheetView?.length]);

  React.useEffect(() => {
    setBranchState((prev: any) => ({
      ...prev,
      page: 'ElectoMap',
      entity: bill_type === 'federal' ? 'federalBill' : 'stateBill',
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'bill_map',
      deepLinkPath: '',
      desktopUrl: `${process.env.DESKTOP_URL}/bills/${params.id}/federal-map?bill_type=${bill_type}`,
      feature: 'bill-map',
    }));
  }, [bill_type, params.id, setBranchState]);

  React.useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: `/bills/${params.id}/federal-map?bill_type=${bill_type}`,
      title: 'Federal bill map',
    });
  }, [bill_type, params.id]);

  return (
    <div className='relative md:pl-4 mt-10 md:mt-0 md:h-[100%] overflow-hidden'>
      <title>Map</title>
      <div className='flex justify-between items-center pr-2 mb-4'>
        <div className='py-2 pl-2'>
          <p className='text-sm mb-2'>
            See how other citizens voted across the State.
          </p>
          <div className='flex gap-4'>
            <div className='flex items-center gap-2'>
              <span className='block w-2 h-2 bg-green-400 rounded-full' />
              <span className='block text-muted-foreground text-sm'>
                YAY : {overall?.at(0)?.agreePercentage || 0}%
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='block w-2 h-2 bg-red-400 rounded-full' />
              <span className='block text-muted-foreground text-sm'>
                NAY : {overall?.at(0)?.disagreePercentage || 0}%
              </span>
            </div>
          </div>
        </div>
        {bill_type === 'state' && (
          <select
            name='chamber'
            id='chamber'
            className='border border-gray-200 bg-white text-xs md:text-sm p-1 rounded-lg'
            onChange={onSelectStateCategory}
            value={chamber}
          >
            <option value='upper'>Upper Chamber</option>
            <option value='lower'>Lower Chamber</option>
          </select>
        )}
      </div>

      <FederalBillMap
        billId={params.id}
        setOverall={setOverall}
        chamber={chamber}
      />
      <div
        className={cn(
          'h-[calc(100vh_-_70px)] overflow-auto bg-white dark:bg-black shadow-lg absolute top-0 transition ease-in-out duration-300 hidden dark:border-r dark:border-gray-800',
          {
            ' transition ease-in-out -translate-x-[372px] duration-300 hidden border-r border-gray-200 dark:border-gray-800 md:block':
              showSheet,
            'w-[423px] left-[834px]': sheetView === 'comments',
            'w-[500px] left-[757px]': sheetView === 'chart',
          },
        )}
      >
        {sheetView === 'chart' && (
          <MapSideBarAnalytics setIsOpen={setShowSheet} bill_type={bill_type} />
        )}
        {sheetView === 'comments' && (
          <MapSideBarComments
            setIsOpen={setShowSheet}
            firstName={firstName || ''}
            lastName={lastName || ''}
            userImage={image}
            bill_type={bill_type}
          />
        )}
      </div>
    </div>
  );
}
