'use client';

import { Step, Stepper, Typography } from '@material-tailwind/react';
import React, { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface StepperProgressBarProps {
  wrapperClassName: string;
  activeStep: number;
  setActiveStep?: any;
  trackers: any[];
  actualStatus: string;
}

const steps = ['Intro', 'Review', 'Debate', 'Resolve', 'Result'];

const StepperProgressBar = (props: StepperProgressBarProps) => {
  const { wrapperClassName, activeStep, trackers, actualStatus } = props;

  const [billProgressPopup, setBillProgressPopup] = useState({
    title: 'Debate',
    description: '',
  });

  const onClickStep = (step: string) => {
    const trackerItem = trackers.find((item) => item.state === step);

    setBillProgressPopup({
      title: trackerItem.state,
      description: trackerItem.description,
    });
  };

  return (
    <div className={`w-full  ${wrapperClassName}`}>
      <Stepper
        placeholder=''
        activeStep={activeStep}
        lineClassName='bg-gray-300'
        activeLineClassName='bg-green-300'
        onPointerEnterCapture={() => null}
        onPointerLeaveCapture={() => null}
      >
        {steps.map((step: string) => (
          <Step
            key={step}
            placeholder=''
            className='h-4 w-4 !bg-gray-300 text-gray-500 cursor-pointer'
            activeClassName='ring-0 !bg-green-500 text-gray-500'
            completedClassName='!bg-green-500 text-gray-500'
            onClick={() => onClickStep(step)}
          >
            <>
              <Popover>
                <PopoverTrigger className=' border-gray-200 dark:border-gray-800 py-5 z-0 w-full '>
                  <div className='absolute -top-[1.5rem] -left-[13px] w-max text-center text-xs'>
                    <Typography
                      placeholder=''
                      variant='small'
                      className='font-poppins font-normal'
                      color='inherit'
                    >
                      {step}
                    </Typography>
                  </div>
                </PopoverTrigger>
                <PopoverContent className='w-fit '>
                  <div
                    className=' font-normal
                  flex flex-col gap-2 max-w-[300px]
                  '
                  >
                    {steps[activeStep] === billProgressPopup.title && (
                      <p className='text-sm text-black font-bold'>
                        {step} / {actualStatus}
                      </p>
                    )}
                    <p className='underline text-sm font-semibold'>
                      {' '}
                      {billProgressPopup.title}
                    </p>
                    <p className='text-sm'> {billProgressPopup.description}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default StepperProgressBar;
