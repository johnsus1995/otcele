'use client';

import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';

// import { firebaseAnalytics } from '@/lib/helper';
import { userAtom } from '@/store/user.atom';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

const Payment = () => {
  const [, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Payment' }));
  }, [setUserState]);

  useEffect(() => {
    // firebaseAnalytics('page_view');
    ReactGA.send({
      hitType: 'pageview',
      page: '/payment',
      title: 'Custom Title',
    });
  }, []);

  return (
    <div className='flex justify-center items-center w-full mt-20 md:mt-0'>
      <title>Payment</title>

      <script async src='https://js.stripe.com/v3/buy-button.js'></script>

      <stripe-buy-button
        buy-button-id='buy_btn_1Py7RkAYgOn7ZCj4Au7InUKA'
        publishable-key={process.env.STRIPE_P_K}
      ></stripe-buy-button>
    </div>
  );
};

export default Payment;
