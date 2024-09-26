'use client';

import { useQuery } from '@tanstack/react-query';
import { Globe, Mail, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { cn } from '@/lib/utils';

import BillCardSkeleton from '@/components/utils/BillCardSkeleton';

const FundingResources = dynamic(
  () => import('@/components/account/FundingResources'),
  {
    loading: () => <BillCardSkeleton />,
  },
);

const VotingRecords = dynamic(
  () => import('@/components/account/VotingRecords'),
  {
    loading: () => <BillCardSkeleton />,
  },
);

import { useRouter } from 'next/navigation';
import ReactGA from 'react-ga4';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import { formatTickNumber } from '@/lib/helper';

import NewBarChart from '@/components/bills/bill-data-hub/charts/NewBarChart';
import ErrorBoundary from '@/components/utils/ErrorBoundary';
import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import ProfileAvatar from '@/../public/images/auth/profile-avatar-big.png';
import { getRepresentative } from '@/apis/user';

const Account = ({ searchParams }: any) => {
  const { id, name, tab } = searchParams;

  const router = useRouter();

  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const [fundGraphData, setFundGraphData] = useState([]);

  const { data, isFetching } = useQuery({
    queryKey: ['get-representative-profile'],
    queryFn: () => getRepresentative(id),
    refetchOnWindowFocus: false,
  });

  const renderProfileImage = () => {
    if (data?.representative?.image) return data?.representative?.image;

    return ProfileAvatar;
  };

  const onChangeTab = (tab: string) => {
    router.replace(`/account?name=${name}&id=${id}&tab=${tab}`);
  };

  const renderTabContent = () => {
    if (tab === 'funding-resources') {
      return (
        <FundingResources
          representativeId={id}
          setFundGraphData={setFundGraphData}
        />
      );
    } else if (tab === 'voting-records') {
      return <VotingRecords representativeId={id} />;
    }

    return (
      <p className='text-muted-foreground text-sm px-4 pb-5'>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>
    );
  };

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: name }));
  }, [name, setUserState]);

  useEffect(() => {
    setBranchState({
      page: 'Representatives',
      entity: null,
      entityId: id,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'share-representative',
      deepLinkPath:
        tab === 'funding-resources'
          ? '/representatives/funding-source'
          : '/representatives',
      desktopUrl: `${process.env.DESKTOP_URL}/account?name=${name}&id=${id}&tab=${tab}`,
      description: 'Get to see the details of the representative',
      feature: 'representative',
      repId: id,
    });
  }, [id, name, setBranchState, tab]);

  useEffect(() => {
    if (tab) return;
    router.replace(`/account?name=${name}&id=${id}&tab=biography`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: `/account?name=${name}&id=${id}&tab=${tab}`,
      title: `${name}`,
    });
  }, [id, name, tab]);

  const [profilePicLoading, setProfilePicLoading] = useState(true);

  const handleLoadProfilePic = () => {
    setProfilePicLoading(false);
  };

  const addDefaultImg = (e: any) => {
    e.target.srcset =
      'https://www.aurubis.com/.resources/aurubis-light-module/webresources/assets/img/image-avatar-avatar-fallback.svg';
  };

  if (isFetching) return <Loading />;

  return (
    <div className='flex flex-col flex-1 w-full mt-[41px] md:mt-0 max-h-[calc(100vh_-_180px)]'>
      <title>{name}</title>
      <div className='h-full md:h-[190px] bg-[#F7F7F8] dark:bg-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-1 sm:p-4'>
        <div className='flex  gap-3'>
          <ErrorBoundary>
            <Image
              src={
                profilePicLoading
                  ? 'https://i.gifer.com/ZKZg.gif'
                  : renderProfileImage()
              }
              alt='rep-img'
              className=' max-h-[160px] max-w-[150px] object-cover'
              height={0}
              width={160}
              onError={addDefaultImg}
              onLoad={handleLoadProfilePic}
            />
          </ErrorBoundary>

          <div className='flex  flex-col justify-center'>
            <h4 className='text-base font-semibold'>
              {data?.representative?.firstName} {data?.representative?.lastName}
            </h4>
            <p className='text-muted-foreground text-sm mb-4'>
              {data?.representative?.title} | {data?.representative?.state} |{' '}
              {data?.representative?.party}
            </p>
            <div className='flex gap-2 mt-2 items-center'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.phones.map((phone: string) => (
                  <p className='text-muted-foreground text-sm' key={phone}>
                    {phone}
                  </p>
                ))}
                {!data?.representative?.phones.length && (
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Not available
                  </p>
                )}
              </div>
            </div>
            <div className='flex gap-2 mt-2 items-center'>
              <Globe className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.urls.map((url: string) => (
                  <Link
                    href={url}
                    target='_blank'
                    className='text-muted-foreground text-sm max-w-[200px] truncate'
                    key={url}
                  >
                    {url}
                  </Link>
                ))}
                {!data?.representative?.urls.length && (
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Not available
                  </p>
                )}
              </div>
            </div>
            <div className='flex gap-2 mt-2 items-center'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <div className='flex flex-col gap-1'>
                {data?.representative?.emails.map((mail: string) => (
                  <a
                    href={`mailto:${mail}`}
                    title={mail}
                    key={mail}
                    className='text-muted-foreground text-sm max-w-[200px] truncate '
                  >
                    {mail}
                  </a>
                ))}
                {!data?.representative?.emails.length && (
                  <p className='text-xs text-gray-600 dark:text-gray-400'>
                    Not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white md:w-[352px] md:h-[118px] md:mr-9 border border-gray-200 dark:border-gray-800 flex'>
          <div className='p-4 lg:p-0 h-full w-full flex flex-col items-center justify-center gap-1 sm:gap-2 border-r border-gray-200 dark:border-gray-700  dark:bg-gray-600'>
            <h1 className='font-semibold text-xl lg:text-3xl dark:text-gray-4'>
              {data?.representative.score ?? 0}/100
            </h1>
            <p className='text-sm text-muted-foreground'>Elector Score</p>
          </div>
          <div className='p-4 lg:p-0 h-full w-full flex flex-col items-center justify-center gap-1 sm:gap-2 dark:bg-gray-600'>
            <h1 className='font-semibold text-xl lg:text-3xl dark:text-gray-400'>
              {data?.representative.matchRate ?? 0}%
            </h1>
            <p className='text-sm text-muted-foreground'>Voter Match Rate</p>
          </div>
        </div>
      </div>
      {/*   */}
      <div className='flex flex-col md:flex-row md:w-full'>
        <div className='md:w-[385px] lg:w-[550px] border-r border-gray-200 dark:border-gray-800  w-full '>
          <div className='px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 h-[50px]'>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'biography',
                'font-semibold text-black dark:text-white': tab === 'biography',
              })}
              onClick={() => onChangeTab('biography')}
            >
              <span>Biography</span>{' '}
            </button>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'voting-records',
                'font-semibold text-black dark:text-white':
                  tab === 'voting-records',
              })}
              onClick={() => onChangeTab('voting-records')}
            >
              <span>Voting Records</span>{' '}
            </button>
            <button
              className={cn('relative text-sm text-muted-foreground', {
                accountActiveTab: tab === 'funding-resources',
                'font-semibold text-black dark:text-white':
                  tab === 'funding-resources',
              })}
              onClick={() => onChangeTab('funding-resources')}
            >
              <span>Funding Sources</span>{' '}
            </button>
          </div>
          <div className='pt-4 md:h-[calc(100vh_-_321px)] overflow-y-auto'>
            {renderTabContent()}
          </div>
        </div>
        {/* <p>right</p> */}
        {!!fundGraphData.length && (
          <div className='pt-4 border-t border-gray-200 md:border-none'>
            <p className='md:ml-4 pl-4 md:pl-0  border-b border-gray-200 dark:border-gray-800 dark:text-muted-foreground pb-2.5 font-normal text-sm'>
              Total Raised vs. Average Raised
            </p>
            <div className='h-[275px] w-full md:w-[340px] pr-4 md:pr-0 mt-4'>
              <NewBarChart
                data={fundGraphData}
                bar1DataKey='raised'
                bar2DataKey='avg'
                // yAxisTickDomain={[0, 100]}
                yAxisTickFormatter={formatTickNumber}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
