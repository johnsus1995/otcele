'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import React from 'react';

import Account from '@/../public/images/account.jpeg';
import DeleteAccountImage from '@/../public/images/deleteAccount.jpeg';

const DeleteAccountProcedure = () => {
  const router = useNpRouter();

  const onClickGoBack = () => {
    router.back();
  };

  return (
    <div className='m-auto md:m-0 pt-[50px] md:pt-[50px] pb-5 md:pl-[81px] max-w-[800px] px-10  font-poppins'>
      <ArrowLeft
        className='h-6 w-6  rounded-full box-content mb-6'
        role='button'
        onClick={onClickGoBack}
      />
      <h1 className='text-xl md:text-3xl font-bold'>
        Procedure for Deleting an Account on Electo
      </h1>
      <h3 className='mt-3 md:mt-4 text-lg md:text-xl font-semibold'>
        Steps to Delete Your Account
      </h3>
      <ul className='mt-4 ml-4 flex flex-col gap-3 list-none'>
        <li className='font-semibold before:content-["1."] before:mr-1'>
          Open the Electo Application
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          Launch the application on your mobile device.
        </li>
        <li className='font-semibold before:content-["2."] before:mr-1'>
          Access the Drawer Menu
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          Tap on your profile picture located in the top left corner of the
          screen to open the drawer menu.
        </li>

        <li className='font-semibold before:content-["2."] before:mr-1'>
          Select Settings
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          In the drawer menu, choose the 'Settings' option.
        </li>

        <li className='font-semibold before:content-["2."] before:mr-1'>
          Navigate to Account Settings
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          Inside the Settings menu, select <strong>'Account'</strong> to access
          your account-related options.
        </li>

        <li className='font-semibold before:content-["2."] before:mr-1'>
          Initiate Account Deletion
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          Scroll to the bottom of the Account settings page and tap on the
          <strong className='text-red-500'>'Delete Account'</strong> button.
        </li>

        <li className='font-semibold before:content-["2."] before:mr-1'>
          Confirm Deletion
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          A pop-up will appear asking for confirmation to delete your account.
        </li>
        <li className='list-inside list-disc text-sm ml-4'>
          Review the information provided and confirm your decision to proceed.
        </li>
      </ul>
      <h3 className='mt-3 md:mt-4 text-lg md:text-xl font-semibold'>
        Important Notes
      </h3>
      <li className='list-inside list-disc text-sm ml-4'>
        Once confirmed, your account and all associated data will be permanently
        deleted.
      </li>
      <div className='flex gap-3 flex-col lg:flex-row mt-8 '>
        <Image
          src={Account}
          alt='settings'
          width={300}
          height={800}
          className='mx-auto'
        />
        <Image
          src={DeleteAccountImage}
          alt='deleteAccount'
          width={300}
          height={800}
          className='mx-auto'
        />
      </div>
    </div>
  );
};

export default DeleteAccountProcedure;
