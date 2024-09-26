'use client';

import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { faqData } from '@/lib/constants'; // assuming the updated faqData structure is imported

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { userAtom } from '@/store/user.atom';

const FAQs = () => {
  const [, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev: any) => ({ ...prev, currentPageName: 'FAQs' }));
  }, [setUserState]);

  return (
    <div className='w-full p-2 md:p-4 pb-14 md:pb-5'>
      <p className='text-xs md:text-sm  pb-5'>
        Welcome to the Electo App FAQ page! Here, you will find answers to
        common questions about using our app, understanding the Electo Score,
        and participating in legislative advocacy. If you have any other
        questions, please feel free to contact our support team.
      </p>

      {/* Loop through each category with titles and FAQs */}
      {faqData.map((category, index) => (
        <div key={index} className='mb-4'>
          <h2 className='text-base font-semibold'>{category.title}</h2>

          <Accordion
            type='single'
            collapsible
            className='w-full text-xs md:text-sm'
          >
            {category.faqs.map((faq, i) => (
              <AccordionItem value={faq.question} key={i}>
                <AccordionTrigger className='py-3'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-xs'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
