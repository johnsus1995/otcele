import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import TextInput from '@/components/ui/TextInput';
import Modal from '@/components/utils/Modal';

import { addFeedback } from '@/apis/user';

interface FeedbackModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

type feedbackForm = {
  subject: string;
  message: string;
};

const schema = Yup.object().shape({
  subject: Yup.string().required('Required field!'),
  message: Yup.string().required('Required field!'),
});

const FeedbackModal = (props: FeedbackModalProps) => {
  const { isOpen, setIsOpen } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<feedbackForm>(schema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => addFeedback(payload),
    onSuccess: (res: any) => {
      toast.success(res?.message);
      onClose();
    },
    onError(err: any) {
      toast.error(err.response.data.message, {
        duration: 1500,
      });
    },
  });

  const onSubmitFeedback = (data: feedbackForm) => {
    mutate({
      subject: data.subject,
      message: data.message,
    });
  };

  const onClose = () => {
    setIsOpen(false);
    reset({
      message: '',
      subject: '',
    });
  };

  return (
    <Modal
      contentClassName='p-0 pb-4 max-w-[446px] forgotPasswordClose border-0 dark:border border-gray-800 !rounded-t-2xl'
      isOpen={isOpen}
      preventOutsideClick
      setIsOpen={setIsOpen}
      renderContent={
        <div className='font-poppins '>
          <div className='w-full bg-[#63667b] rounded-t-xl p-4 flex justify-between'>
            <p className='text-white font-bold text-xl'>Feedback</p>
            <X className='h-6 w-6 text-white' role='button' onClick={onClose} />
          </div>
          {/* <lassName='w-16 h-16 p-3 m-auto my-8 rounded-full bg-gray-200' /> */}
          <form
            onSubmit={handleSubmit(onSubmitFeedback as any)}
            className='flex w-full flex-col gap-4 px-4 mt-10'
          >
            <Controller
              control={control}
              name='subject'
              render={({ field }) => (
                <TextInput
                  label='Subject'
                  className='rounded-xl'
                  {...field}
                  error={errors.subject?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='message'
              render={({ field }) => (
                <div className='flex flex-col gap-1'>
                  <label className='font-normal text-sm text-muted-foreground'>
                    Message
                  </label>

                  <textarea
                    className='flex w-full rounded-xl border border-input 
                    bg-background px-3 py-2 text-sm ring-offset-background 
                    file:border-0 file:bg-transparent file:text-sm file:font-medium 
                    placeholder:text-muted-foreground focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-ring 
                    focus-visible:ring-offset-2 
                    disabled:cursor-not-allowed disabled:opacity-50 
                    disabled:bg-gray-100 dark:disabled:text-gray-400
                     dark:disabled:bg-gray-800'
                    rows={5}
                    {...field}
                  />
                  <p className='text-red-600 text-xs'>
                    {errors.message?.message}
                  </p>
                </div>
              )}
            />

            <Button
              className='w-full rounded-full mt-2'
              type='submit'
              disabled={isPending}
              text='Send'
              loading={isPending}
            />
          </form>
        </div>
      }
    />
  );
};

export default FeedbackModal;
