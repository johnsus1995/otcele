import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import Modal from '@/components/utils/Modal';

import { deleteAccount } from '@/apis/user';

const DeleteAccount = () => {
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false);

  const onClickDeleteAccount = () => {
    setDeleteAccountModal(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (res: any) => {
      Cookies.remove('electo_u_tok');
      window.location.pathname = '/sign-in';
      localStorage.removeItem('authDetails');
      localStorage.removeItem('userDetails');
      toast.success(res.message, {
        description: '',
        duration: 3000,
      });
    },
    onError(err: any) {
      toast.error('Oops!', {
        description: err.response.data.message,
        duration: 3000,
      });
    },
  });

  const confirmDeleteModalContent = (
    <div className='flex flex-col items-center py-5 gap-5 px-2 md:py-10 md:px-5'>
      <Trash2 className='bg-[#EE7C7CBF] rounded-full p-4 w-20 h-20 text-white' />
      <h2 className='font-bold text-2xl'>Delete Your Account?</h2>
      <h3 className='text-center text-muted-foreground'>
        Do you really wish to delete your account? This process can not be
        undone.
      </h3>
      <div className='flex gap-2 w-full'>
        <Button
          variant='outline'
          className='w-full rounded-full mt-2 font-semibold'
          type='button'
          disabled={isPending}
          text='Cancel'
          onClick={() => setDeleteAccountModal(false)}
        />
        <Button
          className='w-full rounded-full mt-2 bg-red-700 font-semibold'
          type='button'
          disabled={isPending}
          text='Yes, Confirm'
          loading={isPending}
          onClick={() => mutate()}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className='w-full h-[60px] text-sm'>
        <button onClick={onClickDeleteAccount} className='text-red-500'>
          Delete Account
        </button>
      </div>
      <Modal
        isOpen={deleteAccountModal}
        renderContent={confirmDeleteModalContent}
        setIsOpen={setDeleteAccountModal}
        preventOutsideClick={true}
      ></Modal>
    </div>
  );
};

export default DeleteAccount;
