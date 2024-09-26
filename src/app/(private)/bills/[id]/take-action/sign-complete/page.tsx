'use client';

import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';

import { userAtom } from '@/store/user.atom';

const SignComplete = (props: any) => {
  const sigPad: any = useRef();
  const router = useNpRouter();

  const { bill_name, bill_type, signType, authors } = props.searchParams;
  const [{ signature }, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      currentPageName: 'Sign Petition - Complete',
    }));
  }, [setUserState]);

  useEffect(() => {
    if (sigPad.current) {
      sigPad.current.fromDataURL(signature);
      sigPad.current.off();
    }
  }, [signature]);

  return (
    <div className='mt-12 md:mt-5 mx-2 md:mx-4 flex flex-col gap-3'>
      <p className='text-sm md:text-sm'>
        You have already signed the petition against this bill -{' '}
        <strong>{bill_name}</strong>{' '}
      </p>
      {signType === 'agree' && (
        <p className='text-xs md:text-sm font-semibold text-green-300'>
          You have chosen to support the bill.
        </p>
      )}
      {signType === 'disagree' && (
        <p className='text-xs md:text-sm font-semibold text-red-300'>
          You have chosen to oppose the bill.
        </p>
      )}
      <SignatureCanvas
        ref={sigPad}
        penColor='black'
        canvasProps={{
          className: 'border border-gray-400 signPad',
        }}
      />
      <p className='text-sm md:text-sm'>Reconsidered your vote?</p>
      <Button
        variant='outline'
        className='rounded-full font-semibold w-full mt-5'
        text='Resubmit the Petition'
        onClick={() =>
          router.push(
            `sign-petition?bill_type=${bill_type}&bill_name=${bill_name}&authors=${authors}`,
          )
        }
      />
    </div>
  );
};

export default SignComplete;
