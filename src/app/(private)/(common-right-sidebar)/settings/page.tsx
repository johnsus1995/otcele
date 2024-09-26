'use client';

import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import { Switch } from '@/components/ui/switch';
import FeedbackModal from '@/components/utils/FeedbackModal';

import { userAtom } from '@/store/user.atom';

const ForgotPasswordModal = dynamic(
  () => import('@/components/utils/ForgotPasswordModal'),
);

const navLinks = [
  { name: 'Account', link: '/profile' },
  { name: 'Privacy Policy', link: '/privacyPolicy' },
  { name: 'Password and Security', link: '#' },
  { name: 'Payments', link: '/payment' },
  { name: 'About', link: '/about' },
];

const Settings = () => {
  const [, setUserState] = useRecoilState(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFeedback, setIsOpenFeedback] = useState<boolean>(false);

  const { setTheme, resolvedTheme } = useTheme();

  const onClickChangePassword = (link: string) => {
    if (link === '#') setIsOpen(true);
  };

  const handleChangeDarkMode = () => {
    if (resolvedTheme === 'light') {
      return setTheme('dark');
    }
    return setTheme('light');
  };

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'Settings' }));
  }, [setUserState]);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/settings', title: 'Settings' });
  }, []);

  return (
    <div className='w-full flex flex-col mt-[40px] md:mt-0'>
      <title>Settings</title>
      {/* <div className='md:w-[549px] bg-red-300'></div>
      <div className='hidden md:block md:w-[352px] bg-blue-300'>
      </div> */}
      {navLinks.map((nav) => (
        <Link
          href={nav.link}
          key={nav.name}
          className='flex px-2 justify-between items-center w-full h-[60px] hover:bg-gray-200 dark:hover:bg-gray-800'
          onClick={() => onClickChangePassword(nav.link)}
        >
          <p className='text-sm'>{nav.name}</p>
          <ChevronRight className='h-6 w-6' />
        </Link>
      ))}
      <button
        onClick={setIsOpenFeedback as any}
        className='flex px-2 justify-between items-center w-full h-[60px] text-sm hover:bg-gray-200 dark:hover:bg-gray-800'
      >
        <p className='text-sm'>Feedback</p>
        <ChevronRight className='h-6 w-6' />
      </button>
      <div className='flex px-2 justify-between items-center w-full h-[60px] text-sm'>
        <p>Dark mode</p>
        <Switch
          id='airplane-mode'
          onCheckedChange={handleChangeDarkMode}
          checked={resolvedTheme === 'dark'}
        />
      </div>
      <FeedbackModal isOpen={isOpenFeedback} setIsOpen={setIsOpenFeedback} />
      <ForgotPasswordModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Settings;
