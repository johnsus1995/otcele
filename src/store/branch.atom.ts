import { atom } from 'recoil';

type TDefaultValues = {
  page: string;
  entity?: string | null;
  entityId?: string | null;
  campaign: string;
  alias: string;
  feature: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  desktopUrl: string;
  deepLinkPath: string;
  iosUrl: string;
  androidUrl: string;
  customEntity?: string | null;
  billId?: string | null;
  repId?: string | null;
  questionId?: string | null;
};

const defaultValues: TDefaultValues = {
  page: 'BillVote',
  entity: null,
  entityId: null,
  campaign: 'bill_awareness',
  alias: 'electo-bill',
  feature: 'billSummary',
  title: '',
  description: '',
  imageUrl: '',
  desktopUrl: 'https://server.electoai.com/',
  deepLinkPath: '',
  iosUrl: 'https://apps.apple.com/in/app/electo/6480498847',
  androidUrl:
    'https://play.google.com/store/apps/details?id=com.electo.app.electo',
  customEntity: '',
  billId: null,
  repId: null,
  questionId: null,
};

export const branchAtom = atom({
  key: 'branchState',
  default: defaultValues,
});
