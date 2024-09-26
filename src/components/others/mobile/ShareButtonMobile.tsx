import { useMutation } from '@tanstack/react-query';
import { Share2 } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { createBranchLink, initializeBranch } from '@/lib/branch';

import Loading from '@/components/utils/Loading';

import { branchAtom } from '@/store/branch.atom';

import { share } from '@/apis/branchIo';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

const ShareButtonMobile = () => {
  const [branchState, setBranchState] = useRecoilState(branchAtom);

  const { mutate: getBranchUrl, isPending: isPendingBranchUrl } = useMutation({
    mutationFn: async () => await createBranchLink(branchState),
    onSuccess: async (res: any) => {
      try {
        await navigator.clipboard.writeText(res);
        toast.success('Link copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy link to the clipboard!');
      }
    },
    onError(err: any) {
      toast(err.response.data.message, {});
    },
  });

  const { mutate: getShareInfo, isPending } = useMutation({
    mutationFn: async (payload: any) => share(payload),
    onSuccess: async (res: any) => {
      ReactGA.event({
        category: 'Share',
        action: res.message,
        label: res.title,
        value: 3,
      });

      await setBranchState((prev) => ({
        ...prev,
        title: res.title,
        imageUrl: res.image,
        desktopUrl: res.link,
      }));
      await getBranchUrl();
    },
    onError(err: any) {
      toast(err.response.data.message, {});
    },
  });

  const onClickShare = useCallback(async () => {
    getShareInfo({
      page: branchState.page,
      entity: branchState.entity,
      entityId: branchState.entityId,
    });
  }, [branchState, getShareInfo]);

  useEffect(() => {
    initializeBranch();
  }, []);

  return (
    <button onClick={onClickShare}>
      {isPending || isPendingBranchUrl ? (
        <Loading className='h-5 w-5' />
      ) : (
        <Share2 className='h-5 w-5' />
      )}
    </button>
  );
};

export default ShareButtonMobile;
