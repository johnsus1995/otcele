'use client';
import React from 'react';
import ReactGA from 'react-ga4';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import FAQs from '@/components/faq/FAQs';

const FAQsPage = () => {
  React.useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/faq', title: 'FAQs' });
  }, []);
  return (
    <div className='max-h-[calc(100vh_-_128px)] md:max-h-[calc(100vh_-_100px)] overflow-auto mt-11 md:mt-0'>
      <title>FAQs</title>
      <FAQs />
    </div>
  );
};

export default FAQsPage;
