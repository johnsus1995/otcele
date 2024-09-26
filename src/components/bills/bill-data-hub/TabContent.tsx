import React from 'react';

import { formatDateAPIpayload } from '@/lib/helper';

import Age from '@/components/bills/bill-data-hub/Age';
import Education from '@/components/bills/bill-data-hub/Education';
import Gender from '@/components/bills/bill-data-hub/Gender';
import PoliticalParty from '@/components/bills/bill-data-hub/PoliticalParty';
import Race from '@/components/bills/bill-data-hub/Race';
import TotalVotes from '@/components/bills/bill-data-hub/TotalVotes';
import VoteRate from '@/components/bills/bill-data-hub/VoteRate';

const tabContent = (
  activeTab: string,
  fromDate: Date,
  toDate: Date,
  billType: string,
  id: any,
) => {
  switch (activeTab) {
    case 'Total Votes':
      return {
        component: (
          <TotalVotes
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare your vote to fellow citizens',
      };
    case 'Age':
      return {
        component: (
          <Age
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across age groups',
      };
    case 'Gender':
      return {
        component: (
          <Gender
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes between genders',
      };
    case 'Race':
      return {
        component: (
          <Race
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across diverse backgrounds',
      };
    case 'Education':
      return {
        component: (
          <Education
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes across education levels',
      };
    case 'Political party':
      return {
        component: (
          <PoliticalParty
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Compare votes between parties',
      };
    case 'Vote Rate':
      return {
        component: (
          <VoteRate
            fromDate={formatDateAPIpayload(fromDate, 'yyyy-MM-dd')}
            toDate={formatDateAPIpayload(toDate, 'yyyy-MM-dd')}
            billType={billType}
            billId={id}
          />
        ),
        subHeading: 'Percentage of citizens who examined the bill and voted',
      };
    default:
      return null;
  }
};

export default tabContent;
