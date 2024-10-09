'use client';

import {
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithPopup,
} from '@firebase/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import CryptoJS from 'crypto-js';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import * as React from 'react';
// import { firebaseAnalytics } from '@/lib/helper';
import ReactGA from 'react-ga4';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';
import * as Yup from 'yup';

ReactGA.initialize(process.env.GA_MEASUREMENT_ID as string);

import NextImage from '@/components/NextImage';
import { Button } from '@/components/ui/button';
import CheckboxInput from '@/components/ui/CheckboxInput';
import PasswordInput from '@/components/ui/PasswordInput';
import TextInput from '@/components/ui/TextInput';
import Loading from '@/components/utils/Loading';
import OTP from '@/components/utils/OTP';

import { authState } from '@/store/auth.atom';
import { userAtom } from '@/store/user.atom';

import { auth } from '@/../firebase';
import FacebookIcon from '@/../public/images/auth/facebook.png';
import GoogleIcon from '@/../public/images/auth/google.png';
import PhoneIcon from '@/../public/images/auth/phone.png';
import PhoneOtpIcon from '@/../public/images/auth/phoneOtpIcon.png';
import {
  facebookSignInCallback,
  getResetPasswordOtp,
  googleSignInCallback,
  setNewPassword,
  signIn,
  verifyResetPasswordOtp,
} from '@/apis/auth';

const Modal = dynamic(() => import('@/components/utils/Modal'), {
  ssr: false,
});

type LoginForm = {
  userName: string;
  password: string;
  rememberMe?: null | boolean;
};

type PasswordResetForm = {
  newPassword: string;
  confirmNewPassword: string;
};

const schema = Yup.object().shape({
  userName: Yup.string().required('Username is a required field!'),
  password: Yup.string().required('Password is a required field!'),
  rememberMe: Yup.boolean()
    .oneOf([true, false], 'You must accept the terms and conditions')
    .nullable(),
});

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password is required!')
    .min(8, 'Password must be at least 8 character long')
    .matches(
      RegExp('(.*[a-z].*)'),
      'Password should contain at least one lowercase character.',
    )
    .matches(
      RegExp('(.*[A-Z].*)'),
      'Password should contain at least one uppercase character.',
    )
    .matches(
      RegExp('(.*\\d.*)'),
      'Password should contain at least one number.',
    )
    .matches(
      RegExp('[!@#$%^&*(),.?":{}|<>]'),
      'Password should contain at least one special character.',
    ),
  confirmNewPassword: Yup.string()
    .required('Confirm password is required!')
    .test('passwords-match', 'Passwords do not match', function (value) {
      return this.parent.newPassword === value;
    }),
});

export default function SignIn() {
  const router = useNpRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [userAuthState, setAuthStateValue] = useRecoilState(authState);
  const [, setUserState] = useRecoilState(userAtom);

  const [hydrated, setHydrated] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [passwordResetOtp, setPasswordResetOtp] = React.useState('');
  const [passwordReset, setPasswordReset] = React.useState({
    email: '',
    otp: '',
    step: 'getOtp',
    error: '',
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userName: '',
      password: '',
      rememberMe: false,
    },
  });

  const {
    control: controlPasswordReset,
    handleSubmit: handleSubmitPasswordReset,
    setValue: setValuePasswordReset,
    formState: { errors: errorsPasswordReset },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginForm) => signIn(data),
    onSuccess: (res: any) => {
      setUserState((prev: any) => ({ ...prev, id: res.user.id }));

      ReactGA.event({
        category: 'Authentication',
        action: 'Sign in',
        label: 'Email',
        value: 1,
      });

      toast(res.message, {
        description: '',
        duration: 2000,
      });

      if (!res?.user?.interests.length) {
        router.push('/interests');
        return;
      }

      if (redirectTo) {
        return router.push(redirectTo as string);
      }

      router.push('/bills');
    },
    onError(err: any) {
      toast(err.response.data.message, {
        description: '',
        duration: 2000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      if (
        err?.response?.status === 403 &&
        err.response.data.isVerified === false
      ) {
        setAuthStateValue((prev: any) => ({
          ...prev,
          email: err?.response?.data?.user?.email,
          phone: err?.response?.data?.user?.phoneNumber,
          isNewUser: false,
          verification: err.response.data.isVerified
            ? 'verified'
            : 'not-verified',
        }));
        router.push('/about-you');
      }
    },
  });

  const onSubmitLogin = (data: LoginForm) => {
    // debugger;
    if (data.rememberMe) {
      const encryptedPw = CryptoJS.AES.encrypt(
        data.password,
        process.env.CRYPTO_SECRET as string,
      ).toString();
      setAuthStateValue((prev: any) => ({
        ...prev,
        username: data.userName,
        password: encryptedPw,
        rememberMe: data.rememberMe,
      }));
    } else {
      setAuthStateValue((prev: any) => ({
        ...prev,
        username: '',
        password: '',
        rememberMe: false,
      }));
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    const { rememberMe, ...rest } = data;
    mutate(rest);
  };

  React.useEffect(() => {
    if (!userAuthState.rememberMe) return;
    const decryptedPw = CryptoJS.AES.decrypt(
      userAuthState.password,
      process.env.CRYPTO_SECRET as string,
    ).toString(CryptoJS.enc.Utf8);

    setValue('userName', userAuthState.username);
    setValue('password', decryptedPw);
    setValue('rememberMe', true);
  }, [setValue, userAuthState]);

  const onChangePasswordReset = (e: any) => {
    const { name, value } = e.target;
    setPasswordReset((prev: any) => ({ ...prev, [name]: value }));
  };

  const {
    mutate: mutateGetResetPasswordOtp,
    isPending: isPendingGetResetPasswordOtp,
  } = useMutation({
    mutationFn: async (data: any) => getResetPasswordOtp(data),
    onSuccess: (res: any) => {
      setPasswordReset((prev: any) => ({ ...prev, step: 'verifyOtp' }));
      toast('Password Reset', {
        description: res.message,
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
    onError(err: any) {
      setPasswordReset((prev: any) => ({
        ...prev,
        error: err?.response?.data?.message,
      }));
    },
  });

  const {
    mutate: mutateVerifyResetPasswordOtp,
    isPending: isPendingVerifyResetPasswordOtp,
  } = useMutation({
    mutationFn: async (data: any) => verifyResetPasswordOtp(data),
    onSuccess: (res: any) => {
      setPasswordReset((prev: any) => ({ ...prev, step: 'resetPassword' }));
      toast('Password Reset', {
        description: res.message,
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
    onError(err: any) {
      // debugger
      setPasswordReset((prev: any) => ({
        ...prev,
        error: err.response.data.message,
      }));
    },
  });

  const { mutate: mutateSetNewPassword, isPending: isPendingSetNewPassword } =
    useMutation({
      mutationFn: async (data: any) => setNewPassword(data),
      onSuccess: (res: any) => {
        setIsOpen(false);
        setPasswordReset((prev: any) => ({ ...prev, step: 'getOtp' }));
        toast('Password Reset', {
          description: res.message,
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
        setValuePasswordReset('newPassword', '');
        setValuePasswordReset('confirmNewPassword', '');
      },
      onError(err: any) {
        toast('Password Reset', {
          description: err.response.data.message,
          duration: 3000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
    });

  const onCompleteOtp = () => {
    setPasswordReset((prev: any) => ({ ...prev, error: '' }));
    mutateVerifyResetPasswordOtp({
      email: passwordReset.email,
      otp: Number(passwordResetOtp),
    });
  };

  const passwordResetFlow = () => {
    setPasswordReset((prev: any) => ({ ...prev, error: '' }));
    if (passwordReset.step === 'getOtp') {
      return mutateGetResetPasswordOtp({ email: passwordReset.email });
    } else if (passwordReset.step === 'verifyOtp') {
      return onCompleteOtp();
    }
  };

  const onSubmitPasswordReset = (data: PasswordResetForm) => {
    const reqData = {
      email: passwordReset.email,
      otp: passwordResetOtp,
      password: data.newPassword,
      confirmPassword: data.confirmNewPassword,
    };
    mutateSetNewPassword(reqData);
  };

  const onClickNewAccount = () => {
    setAuthStateValue({ verification: '' } as any);
  };

  const resetAuthStateAboutYouValues = () => {
    setAuthStateValue((prev: any) => ({
      ...prev,
      maritalStatus: '',
      children: 0,
      employmentStatus: '',
      levelOfEducation: '',
      jobIndustry: '',
      race: '',
      veteran: '',
      politicalViews: '',
    }));
  };

  React.useEffect(() => {
    if (!isOpen) {
      setPasswordReset((prev: any) => ({
        ...prev,
        step: 'getOtp',
        email: '',
        otp: '',
        error: '',
      }));
      setPasswordResetOtp('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    setHydrated(true);
    resetAuthStateAboutYouValues();
    setAuthStateValue((prev: any) => ({ ...prev, socialSignOnLoading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: mutateFbLogin, isPending: isPendingFbLogin } = useMutation({
    mutationFn: async (data: any) => facebookSignInCallback(data),
    onSuccess: (res: any) => {
      setAuthStateValue((prev: any) => ({
        ...prev,
        isSocialAuth: true,
        id: res.user.id,
        email: res.user.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        image: res.user.image,
      }));
      if (res.firstUser) return router.push('sign-up');
      if (!res.user.interests.length) return router.push('interests');
      router.push('bills');
      // firebaseAnalytics('login', {
      //   method: 'facebook',
      //   success: true,
      // });
      ReactGA.event({
        category: 'Authentication',
        action: 'Sign in',
        label: 'Facebook',
        value: 1,
      });
    },
    onError(_err: any) {
      toast('Error!', {
        description: '(FB)-Something went wrong!',
        duration: 2000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    },
  });

  const handleAuthError = async (error: any) => {
    const email = error.customData.email;
    const pendingCred = error.credential;
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    if (signInMethods.length > 0) {
      if (signInMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        linkPendingCredential(result.user, pendingCred);
      } else if (signInMethods.includes(FacebookAuthProvider.PROVIDER_ID)) {
        const facebookProvider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, facebookProvider);
        linkPendingCredential(result.user, pendingCred);
      }
    }
  };

  const linkPendingCredential = async (user: any, pendingCred: any) => {
    try {
      await linkWithCredential(user, pendingCred);
    } catch (_linkError) {
      //
    }
  };

  const onClickFacebookLogin = async () => {
    setAuthStateValue((prev: any) => ({
      ...prev,
      socialSignOnMode: 'facebook',
    }));
    try {
      const provider = new FacebookAuthProvider();
      provider.setCustomParameters({ display: 'popup' });
      const result: any = await signInWithPopup(auth, provider);
      const reqData = {
        accessToken: result?._tokenResponse?.oauthAccessToken,
        fromApp: false,
      };
      await mutateFbLogin(reqData);
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        handleAuthError(error); //it might not be needed, changed firebase authentication settings
      }
      toast('Firebase Error!', {
        description: error?.message,
        duration: 2000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    }
  };

  /**GOOGLE LOGIN */
  const { mutate: mutateGoogleLogin, isPending: isPendingGoogleLogin } =
    useMutation({
      mutationFn: async (data: any) => googleSignInCallback(data),
      onSuccess: (res: any) => {
        setAuthStateValue((prev: any) => ({
          ...prev,
          isSocialAuth: true,
          id: res.user.id,
          email: res.user.email,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          image: res.user.image,
        }));

        if (res.firstUser) return router.push('sign-up');
        if (!res.user.interests.length) return router.push('interests');
        // firebaseAnalytics('login', {
        //   method: 'google',
        //   success: true,
        // });

        ReactGA.event({
          category: 'Authentication',
          action: 'Sign in',
          label: 'Google',
          value: 1,
        });

        router.push('bills');
      },
      onError(_err: any) {
        toast('Error!', {
          description: 'Something went wrong!',
          duration: 2000,
          action: {
            label: 'Close',
            onClick: () => null,
          },
        });
      },
    });

  const onClickGoogleLogin = async () => {
    setAuthStateValue((prev: any) => ({
      ...prev,
      socialSignOnMode: 'google',
    }));
    try {
      const provider = new GoogleAuthProvider();
      const reqData: any = {};
      provider.addScope('email');
      await signInWithPopup(auth, provider).then(async (res: any) => {
        reqData['idToken'] = res?._tokenResponse?.oauthIdToken;
        (reqData['firstName'] = res?.user.displayName.split(' ')[0]),
          (reqData['lastName'] = res?.user.displayName.split(' ')[1]),
          (reqData['image'] = res?.user.photoURL);
        reqData['email'] = res?.user?.email;

        if (!res?.user?.email) {
          const moreInfo = await getAdditionalUserInfo(res); //since email is in the result variable
          reqData['email'] = moreInfo?.profile?.email;
        }
      });

      await mutateGoogleLogin(reqData);
    } catch (error) {
      toast('Firebase Error!', {
        description: 'Firebase auth interrupted!',
        duration: 2000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
    }
  };

  if (!hydrated) return null;

  return (
    <div className='m-auto h-screen md:m-0 pt-[55px] md:pt-[109px] md:pl-[81px] max-w-[440px] px-10 md:px-0'>
      {/* <button onClick={onClickFacebookLogin} className='bg-blue-gray-300'>
        fbLogin
      </button> */}
      <h1 className='text-2xl font-semibold pb-[40px] md:pb-[78px]'>Sign in</h1>
      <form
        onSubmit={handleSubmit(onSubmitLogin as any)}
        className='flex w-full flex-col gap-4'
      >
        <div className='flex flex-col gap-5'>
          <Controller
            control={control}
            name='userName'
            render={({ field }) => (
              <TextInput
                placeholder=''
                className='rounded-xl'
                type='text'
                disabled={isPending}
                label='Username'
                error={errors.userName?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field }) => (
              <PasswordInput
                className='rounded-xl'
                label='Password'
                disabled={isPending}
                error={errors.password?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className='flex justify-between gap-2 mt-3 flex-col md:flex-row'>
          <Controller
            control={control}
            name='rememberMe'
            render={({ field }) => (
              <div className='flex flex-col gap-1'>
                <CheckboxInput
                  {...field}
                  label='Remember me'
                  defaultChecked={userAuthState.rememberMe}
                />
                {errors.rememberMe?.message && (
                  <p className='text-red-600 text-xs'>
                    {errors.rememberMe?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Link
            href='#'
            className='text-muted-foreground font-normal text-sm'
            onClick={() => setIsOpen(true)}
          >
            Forgot password?
          </Link>
        </div>
        <Button
          className='w-full rounded-full mt-8'
          type='submit'
          disabled={isPending}
          loading={isPending}
          text='Sign in'
        />
      </form>
      <p className='text-muted-foreground font-normal text-sm text-center mt-8'>
        OR
      </p>
      {isPendingGoogleLogin || isPendingFbLogin ? (
        <div className='mt-8 flex gap-3 justify-center'>
          <Loading />
        </div>
      ) : (
        <div className='mt-8 flex gap-3 justify-center'>
          <button onClick={onClickFacebookLogin}>
            <NextImage
              alt='logo'
              src={FacebookIcon}
              width={50}
              height={50}
              className='cursor-pointer dark:border dark:border-gray-800 dark:rounded-full'
            />
          </button>
          {/* <button onClick={() => handelSocialSignIn('google')}> */}
          <button onClick={onClickGoogleLogin}>
            <NextImage
              alt='logo'
              src={GoogleIcon}
              width={50}
              height={50}
              className='cursor-pointer dark:border  dark:border-gray-800 dark:rounded-full'
            />
          </button>
          <Link href='/sign-in-phone' prefetch>
            <NextImage
              alt='logo'
              role='button'
              src={PhoneIcon}
              width={50}
              height={50}
              className='company-logo dark:border dark:border-muted dark:rounded-full'
            />
          </Link>
        </div>
      )}
      <p className='text-muted-foreground font-normal text-sm text-center mt-8'>
        New User?{' '}
        <Link
          href='/sign-up'
          onClick={onClickNewAccount}
          className='text-black underline dark:text-white'
          prefetch
        >
          <strong>Create Account</strong>
        </Link>
      </p>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        preventOutsideClick={true}
        contentClassName='md:!rounded-2xl'
        renderContent={
          <div className='flex flex-col justify-center items-center gap-5 p-4 font-poppins'>
            <Image
              src={PhoneOtpIcon}
              alt='otp'
              width={76}
              height={94}
              className=''
            />
            <h3 className='font-semibold text-xl'>Forgot password</h3>
            {passwordReset.step === 'getOtp' && (
              <p className='text-muted-foreground text-sm text-center'>
                Please enter your email address to receive an OTP to reset your
                password.
              </p>
            )}
            {passwordReset.step === 'verifyOtp' && (
              <p className='text-muted-foreground text-sm text-center'>
                Please enter the OTP you received on your email.
              </p>
            )}

            {passwordReset.step === 'resetPassword' && (
              <p className='text-muted-foreground text-sm text-center'>
                Set your new password.
              </p>
            )}

            {passwordReset.step === 'getOtp' && (
              <div className='flex gap-2 items-center justify-center flex-col w-full mt-5'>
                <p className='text-muted-foreground text-sm'>Enter Email</p>
                <TextInput
                  name='email'
                  placeholder='Email'
                  className='rounded-xl'
                  type='email'
                  value={passwordReset.email}
                  onChange={onChangePasswordReset}
                />
              </div>
            )}

            {passwordReset.step === 'verifyOtp' && (
              <div className='flex gap-5 items-center justify-center flex-col w-full mt-5'>
                <p className='text-muted-foreground text-sm'>OTP</p>
                <OTP
                  name='otp'
                  value={passwordResetOtp}
                  onChange={setPasswordResetOtp}
                  onComplete={onCompleteOtp}
                />
              </div>
            )}

            {passwordReset.error && (
              <p className='text-xs text-red-500'>{passwordReset.error}</p>
            )}

            {passwordReset.step === 'resetPassword' && (
              <form
                onSubmit={handleSubmitPasswordReset(onSubmitPasswordReset)}
                className='flex w-full flex-col gap-4'
              >
                <div className='flex flex-col gap-2'>
                  <Controller
                    control={controlPasswordReset}
                    name='newPassword'
                    render={({ field }) => (
                      <PasswordInput
                        className='rounded-xl'
                        placeholder='New Password'
                        error={errorsPasswordReset.newPassword?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    control={controlPasswordReset}
                    name='confirmNewPassword'
                    render={({ field }) => (
                      <PasswordInput
                        className='rounded-xl'
                        placeholder='Confirm New Password'
                        error={errorsPasswordReset.confirmNewPassword?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
                <Button
                  className='w-full rounded-full mt-2'
                  type='submit'
                  text='Set New Password'
                  disabled={isPendingSetNewPassword}
                  loading={isPendingSetNewPassword}
                />
              </form>
            )}

            {passwordReset.step !== 'resetPassword' && (
              <Button
                className='w-full rounded-full mt-2'
                type='submit'
                text={passwordReset.step === 'getOtp' ? 'Get OTP' : 'Verify'}
                onClick={passwordResetFlow}
                disabled={!passwordReset.email}
                loading={
                  isPendingGetResetPasswordOtp ||
                  isPendingVerifyResetPasswordOtp
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
}
