'use client';

import { useQuery } from '@tanstack/react-query';
import { intlFormatDistance } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { useInView } from 'react-intersection-observer';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import BillCardSkeleton from '@/components/utils/BillCardSkeleton';

import { authState } from '@/store/auth.atom';
import { billState } from '@/store/bill.atom';
import { userAtom } from '@/store/user.atom';

import VotingDoneIcon from '@/../public/svg/voting-done.svg';
import { getFederalBills, getStateBills } from '@/apis/bills';
import { getProfile } from '@/apis/user';
// import Head from 'next/head';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

const BillCard = dynamic(() => import('@/components/bills/BillCard'), {
  loading: () => <BillCardSkeleton />,
});

const Modal = dynamic(() => import('@/components/utils/Modal'), {
  ssr: false,
});

const Bills = () => {
  const router = useNpRouter();
  const { ref, inView } = useInView();
  const [{ billType }] = useRecoilState(billState);
  const [, setUserState] = useRecoilState(userAtom);
  const [{ isNewUser }, setAuthStateValue] = useRecoilState(authState);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [bills, setBills] = useState<any>({
    federal: [],
    state: [],
  });

  const [isOpen, setIsOpen] = useState<any>(isNewUser);

  const billsPerType = billType === 'federal' ? bills.federal : bills.state;

  const onClickSkipTutorial = useCallback(() => {
    setIsOpen(false);
    setAuthStateValue((prev: any) => ({ ...prev, isNewUser: false }));
  }, [setAuthStateValue]);

  const onClickNextTutorial = useCallback(() => {
    router.push(`bills/${billsPerType[0]?.billId}?bill_type=${billType}`);
  }, [router, billsPerType, billType]);

  useQuery({
    queryKey: ['get-profile'],
    queryFn: async () => {
      const { user } = await getProfile();
      setUserState({ ...user });
      return user;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const getBills = async () => {
    setLoading(true);
    try {
      if (billType === 'state') {
        await getStateBills({ stateId: 1, pageNumber: currentPage }).then(
          async (response) => {
            setBills((prev: any) => ({
              ...prev,
              state: [...prev.state, ...response.data],
            }));
            setLoading(false);
          },
        );
        return;
      }
      await getFederalBills({ stateId: 1, pageNumber: currentPage }).then(
        async (response) => {
          setBills((prev: any) => ({
            ...prev,
            federal: [...prev.federal, ...response.data],
          }));
          setLoading(false);
        },
      );
    } catch (error) {
      toast('Something went wrong with fetching bills!');
      setLoading(false);
    }
  };

  const newBills = billsPerType.map((bill: any, index: number) => {
    const isLastItem = index === bills[billType].length - 3;
    const _ref = isLastItem ? ref : null;

    const time = intlFormatDistance(new Date(bill.createdAt), new Date());

    return (
      <div key={index} ref={_ref}>
        <BillCard
          description={bill.billText}
          type='latest'
          authors={bill?.authors || []}
          time={time}
          agreeVotes={bill.agreeVotes || 0}
          comments={bill.comments || 0}
          shares={bill.shares || 0}
          id={bill.billId}
          billType={billType}
        />
      </div>
    );
  });

  useEffect(() => {
    getBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, billType]);

  useEffect(() => {
    if (inView && (bills.state.length > 0 || bills.federal.length > 0)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    setCurrentPage(1);
    setBills({ federal: [], state: [] });
  }, [billType]);

  useEffect(() => {
    // firebaseAnalytics('page_view');
    ReactGA.send({ hitType: 'pageview', page: '/bills', title: 'Bills' });
  }, []);

  return (
    <div className=' md:h-[calc(100vh-160px)]'>
      {/* <Head> */}
      {/* <link rel='preconnect' href='https://server-api.electoai.com' /> */}
      {/* </Head> */}
      <title>Bills</title>
      <Modal
        contentClassName='md:max-w-[450px]'
        isOpen={isOpen}
        preventOutsideClick
        setIsOpen={setIsOpen}
        renderContent={
          <div className='flex flex-col   items-center gap-8 font-poppins'>
            <VotingDoneIcon className='max-w-[120px] max-h-[120px]' />
            <h3 className='font-semibold text-base'>Welcome to Electo!</h3>
            <p className='text-muted-foreground text-sm text-justify'>
              Dive into the heart of democracy where you can review bills, cast
              your votes, and make your voice heard every day. Earn points for
              your active participation and share your insights to shape the
              changes you want to see. Start your journey to influence and
              empower right here!
            </p>
            <div className='w-full flex justify-between'>
              <Button
                className='w-fit rounded-full mt-2 px-4 my-5'
                type='button'
                text='Next'
                variant='outline'
                onClick={onClickNextTutorial}
              />
              <Button
                className='w-fit rounded-full mt-2 px-4 my-5'
                type='button'
                text='Skip'
                variant='outline'
                onClick={onClickSkipTutorial}
              />
            </div>
          </div>
        }
      />
      <h4 className='text-base font-semibold border-b border-gray-200 dark:border-gray-800 py-2 pl-2'>
        Latest Bills
      </h4>
      <div className='flex w-full flex-col md:max-h-[calc(100vh_-_130px)] overflow-auto no-scrollbar'>
        {newBills.length ? (
          newBills
        ) : (
          <p
            className={cn(
              'block text-center mt-2 text-sm text-muted-foreground',
              {
                hidden: isLoading,
              },
            )}
          >
            No data to display
          </p>
        )}
        {isLoading && (
          <>
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default Bills;
