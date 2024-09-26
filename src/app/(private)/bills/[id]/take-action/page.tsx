'use client';

import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import TakeAction from '@/components/bills/TakeActon';

const Page = ({ params, searchParams }: any) => {
  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: `bills/${params.id}/take-action?bill_type=${searchParams.bill_type}&authors=${searchParams.authors}`,
      title: 'Bill-Take Action',
    });
  }, [params.id, searchParams.authors, searchParams.bill_type]);

  return (
    <div>
      <title>Bill-Take Action</title>
      <TakeAction
        billId={params.id}
        billType={searchParams.bill_type}
        authors={searchParams.authors}
      />
    </div>
  );
};

export default Page;
