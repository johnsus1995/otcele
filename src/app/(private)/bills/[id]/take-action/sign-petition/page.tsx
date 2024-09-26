'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import Modal from 'react-modal';
import SignatureCanvas from 'react-signature-canvas';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import { Button } from '@/components/ui/button';

import { userAtom } from '@/store/user.atom';

import { giveConsentForPetition, signPetition } from '@/apis/bills';

const customStyles = {
  content: {
    top: '54%',
    bottom: '50px',
    left: '50%',
    right: 'auto',
    height: '75%',
    width: '95%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '999',
    // backgroundColor: 'white',
    padding: '0',
    boxShadow: '10px 5px 20px gray',
  },
  overlay: {
    backgroundColor: '#656565',
  },
};

const SignPetition = (props: any) => {
  const { id } = props.params;
  const { bill_type, bill_name, authors } = props.searchParams;

  const router = useNpRouter();
  const sigPad: any = useRef();

  const [
    { selectedBillVote, userName, firstName, lastName, consentForESign },
    setUserState,
  ] = useRecoilState(userAtom);

  const [modalIsOpen, setIsOpen] = useState(!consentForESign);
  const [checkbox, setCheckBox] = useState(false);
  const [step, setStep] = useState(1);
  const [isSignSubmitDisabled, setIsSignSubmitDisabled] = useState(true);

  function closeModal() {
    router.push(`/bills/${id}/take-action?bill_type=${bill_type}`);
  }

  const { mutate: mutatePetition, isPending: petitionPending } = useMutation({
    mutationFn: async (payload: any) => signPetition(payload),
    onSuccess: (res: any) => {
      setUserState((prev: any) => ({
        ...prev,
        signature: sigPad.current.toDataURL(),
      }));
      toast.success(res.message || '');
      setStep(3);
    },
    onError(err: any) {
      toast.error(err.response.data.message);
    },
  });

  const onEndSign = () => {
    sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    setIsSignSubmitDisabled(false);
  };

  const onClearSignPad = () => {
    sigPad.current.clear();
    setIsSignSubmitDisabled(true);
  };

  const { mutate: giveConsent, isPending: consentLoading } = useMutation({
    mutationFn: async (payload: any) => giveConsentForPetition(payload),
    onSuccess: (res: any) => {
      toast.success(res.message || '');
      setIsOpen(false);
    },
    onError(err: any) {
      toast.error(err.response.data.message);
    },
  });

  const onSubmitSign = () => {
    mutatePetition({
      billId: id,
      billType: bill_type,
      signature: sigPad.current.toDataURL(),
      signType: selectedBillVote,
    });
  };

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      currentPageName: 'Sign Petition',
    }));
    if (selectedBillVote === 'agree') {
      setStep(1);
    } else {
      setStep(2);
    }
  }, [selectedBillVote, setUserState]);

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/sign-petition',
      title: 'Sign Petition',
    });
  }, []);

  return (
    <div className='mt-10 md:mt-0'>
      {/* <button onClick={openModal}>clickMe</button> */}
      <title>Sign Petition</title>
      {step !== 3 && (
        <div className='signInPetition p-2 md:p-4'>
          <div className='mt-4 mb-5 md:mt-0'>
            {step === 1 && (
              <YayPetition
                bill_name={bill_name}
                userName={userName}
                authors={authors}
              />
            )}
            {step === 2 && (
              <NayPetition
                bill_name={bill_name}
                userName={userName}
                authors={authors}
              />
            )}

            <p className='my-2 text-xs text-gray-600'>
              Please provide your electronic signature below.
            </p>
            <SignatureCanvas
              ref={sigPad}
              penColor='green'
              canvasProps={{
                className: 'border border-gray-400 signPad',
              }}
              onEnd={onEndSign}
            />
          </div>

          <div className='flex gap-3 items-base mt-4 mb-20 md:mb-0 '>
            <Button
              className='rounded-full font-semibold text-xs md:text-sm'
              text='Submit Petition'
              loading={petitionPending}
              disabled={petitionPending || isSignSubmitDisabled}
              onClick={onSubmitSign}
            />
            <Button
              variant='outline'
              className='rounded-full font-semibold text-xs md:text-sm'
              text='Clear'
              onClick={onClearSignPad}
            />
            <Button
              variant='outline'
              className='rounded-full font-semibold ml-auto text-xs md:text-sm'
              text='May be Later'
              onClick={closeModal}
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className='p-2 md:p-4'>
          <ThankYou />
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='consent-modal'
        className='relative max-w-6xl bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded flex flex-col justify-between'
        shouldCloseOnOverlayClick={false}
      >
        <div className='p-4 md: px-10 md:pt-10 font-poppins h-fit overflow-auto'>
          <header className='py-2'>
            <h4 className='font-bold text-lg mb-4 text-center underline'>
              Consent for Electronic Signature Authorization
            </h4>
            <p className='text-xs md:text-sm'>
              To help you take action on important legislative matters, we
              request your permission to electronically sign petitions on your
              behalf.
            </p>
          </header>
          <article>
            <h4 className='font-semibold text-sm mt-3'>
              Purpose of Authorization:{' '}
            </h4>
            <p className='text-xs md:text-sm'>
              By providing consent, you allow us to:
            </p>
            <ul className='list-disc ml-6 mb-3'>
              <li className='text-xs md:text-sm'>
                Sign petitions for or against legislative bills.
              </li>
              <li className='text-xs md:text-sm'>
                Participate in related advocacy activities.
              </li>
            </ul>
            <h4 className='font-semibold text-sm'>Your Rights:</h4>
            <ul className='list-disc ml-6 text-sm'>
              <li className='text-xs md:text-sm'>
                <strong>Voluntary Consent:</strong>You can revoke this consent
                anytime by notifying us.
              </li>
              <li className='text-xs md:text-sm'>
                <strong>Privacy:</strong>Your signature and information will be
                used securely and only for the stated purposes.
              </li>
              <li className='text-xs md:text-sm'>
                <strong>Transparency:</strong>You will be notified of any
                actions taken on your behalf.
              </li>
            </ul>
            <h4 className='font-semibold text-sm mt-3'>Consent Statement:</h4>
            <p className='text-xs md:text-sm mt-2'>
              "I, {firstName} {lastName}({userName}), authorize Electo Holdings
              Inc. to use my electronic signature for signing petitions and
              documents related to legislative actions. I understand I can
              revoke this consent anytime by notifying info@electoai.com."
            </p>
            <div className='flex items-center gap-3 my-4'>
              <input
                type='checkbox'
                id='consent'
                name='consent'
                className='w-4 h-4'
                checked={checkbox}
                onChange={() => setCheckBox(!checkbox)}
              />
              <label htmlFor='consent' className='text-sm'>
                I Agree
              </label>
            </div>

            <p className='text-xs md:text-sm'>
              By selecting "I Agree," you consent to the use of your electronic
              signature as described.
            </p>
          </article>
        </div>
        <div className='actionControlButtons flex gap-2 ml-[40px] mb-10  md:mb-[40px]'>
          <Button
            variant='outline'
            className='rounded-full font-semibold'
            text='Go Back'
            onClick={closeModal}
          />
          <Button
            className='rounded-full font-semibold w-[140px]'
            text='Submit Consent'
            onClick={() => giveConsent({ consentGiven: checkbox })}
            loading={consentLoading}
            disabled={consentLoading || !checkbox}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SignPetition;

const YayPetition = ({ bill_name, userName, authors }: any) => {
  return (
    <>
      <h3 className='text-sm font-semibold mb-4'>
        Subject: Collective Support for the Bill{' '}
        <span className='font-semibold'>{bill_name}</span>
      </h3>
      <div className='text-xs md:text-sm flex flex-col gap-3'>
        <p>Dear {authors},</p>
        <p>
          We, the undersigned residents and voters of your district, are writing
          to collectively express our enthusiastic support for{' '}
          <span className='font-semibold'>{bill_name}</span>. We believe this
          bill holds significant promise for the future of our community and the
          well-being of all its residents.
        </p>
        <p>
          By passing this legislation, we can achieve advancements in various
          sectors, leading to a brighter, more prosperous future for everyone.
          This bill represents a crucial step forward in addressing pivotal
          issues, and we are confident it will bring long-lasting benefits that
          will positively impact our community and beyond.
        </p>
        <p>
          We urge you to vote in favor of{' '}
          <span className='font-semibold'>{bill_name}</span> and champion its
          passage with the vigor and dedication that you have consistently
          demonstrated in your service. Your leadership on this issue is vital,
          and we trust that you will consider the collective voice and
          aspirations of your constituents, who are eagerly looking forward to a
          positive change.
        </p>
        <p>
          Thank you for your time, consideration, and unwavering commitment to
          serving our community. Together, we can make a significant difference.
        </p>
        <p>Sincerely,</p>
        <p>{userName}</p>
      </div>
    </>
  );
};

const NayPetition = ({ bill_name, userName, authors }: any) => {
  return (
    <>
      <h3 className='text-sm font-semibold mb-4'>
        Subject: Collective Opposition to Bill-
        <span className='font-semibold'>{bill_name}</span>
      </h3>
      <div className='text-xs md:text-sm flex flex-col gap-3'>
        <p>Dear {authors},</p>
        <p>
          We, the undersigned residents and voters of your district, are writing
          to collectively express our deep concern and strong opposition to
          <span className='font-semibold'>{bill_name}</span>. We believe this
          bill poses substantial risks and could have detrimental effects on the
          well-being of our community.
        </p>
        <p>
          If passed, this legislation could lead to significant negative
          consequences that would undermine the progress we have made in key
          areas.
        </p>
        <p>
          We urge you to vote against{' '}
          <span className='font-semibold'>{bill_name}</span> and prevent its
          passage. Your steadfast commitment to the well-being of our community
          is essential, and we trust that you will consider the collective
          concerns and the potential long-term consequences of this bill.
        </p>
        <p>
          Thank you for your time, attention, and dedication to serving our
          community. Your leadership is critical in protecting the interests and
          future of your constituents.
        </p>
        <p>Sincerely,</p>
        <p>{userName}</p>
      </div>
    </>
  );
};

const ThankYou = () => {
  return (
    <div>
      <h3 className='text-sm font-semibold mb-4'>Petition Signed</h3>
      <div className='text-sm flex flex-col gap-4'>
        <p>
          Thank you for signing the petition! Your support helps make a
          difference.
        </p>
        <p>
          Feel free to explore more ways to <span>take action</span> and stay
          engaged with important issues
        </p>
        <div className='flex gap-2'>
          <Link href='/bills'>
            <Button
              className='rounded-full font-semibold '
              variant='outline'
              text='Back To Home'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
