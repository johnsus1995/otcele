'use client';

import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import TakeAction from '@/components/bills/TakeActon';

import { userAtom } from '@/store/user.atom';

const TakeActionPage = () => {
  const [, setUserState] = useRecoilState(userAtom);

  React.useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Take Action' }));
  }, [setUserState]);

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/take-action',
      title: 'Take Action',
    });
  }, []);

  // if (isFetching) return <Loading />;

  return (
    <div>
      <title>Take Action</title>
      <TakeAction />
    </div>
  );
};

export default TakeActionPage;
