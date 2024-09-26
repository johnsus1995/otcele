import { ArrowRightSquare, Map, MessageSquareMore, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

import BillCommentsMobile from '@/components/others/mobile/BillComments.mob';
import MobileSearch from '@/components/others/mobile/Search.mobile';
import ShareButtonMobile from '@/components/others/mobile/ShareButtonMobile';
import FullPageModal from '@/components/utils/FullPageModal';

const searchNotEnabledPages = [
  'election-center',
  'settings',
  'profile',
  'take-action',
  'voting-records',
  'common-directory',
  'payment',
  'poll-map',
  'officials',
  'my-officials',
  'bills',
];
interface FooterNavMobileProps {
  billId: any;
}

const FooterNavMobile = (props: FooterNavMobileProps) => {
  const { billId } = props;

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const page = pathName.split('/').at(pathName.split('/').length - 1);

  const bill_type = searchParams.get('bill_type');
  const authors = searchParams.get('authors');

  return (
    <div className='w-full h-14 bg-white  shadow-inner flex gap-5 items-center justify-around'>
      {billId && (
        <FullPageModal
          renderTrigger={<MessageSquareMore className='h-6 w-6' />}
        >
          <BillCommentsMobile billId={billId} />
        </FullPageModal>
      )}
      <FullPageModal renderTrigger={<Search className='h-6 w-6' />}>
        <MobileSearch />
      </FullPageModal>
      {/* <FullPageModal renderTrigger={<BarChart2 className='h-6 w-6' />}>
        <DataHubMobile billId={billId}/>
      </FullPageModal>
      <Link href={`${billId}/map`}>
        <Map className='h-6 w-6' />
      </Link> */}

      {pathName.includes('data-hub') && (
        <Link
          href={`${bill_type === 'state' ? 'state-map' : 'federal-map'}?bill_type=${bill_type}&authors=${authors}`}
        >
          <Map className='h-6 w-6' />
        </Link>
      )}

      {(pathName.includes('federal-map') ||
        pathName.includes('state-map') ||
        pathName.includes('data-hub')) && (
        <Link
          href={`/bills/${billId}/take-action?bill_type=${bill_type}&authors=${authors}`}
        >
          <ArrowRightSquare className='h-6 w-6' />
        </Link>
      )}

      {!searchNotEnabledPages.includes(page as string) && <ShareButtonMobile />}
    </div>
  );
};

export default FooterNavMobile;
