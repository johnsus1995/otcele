'use client';

import Cookies from 'js-cookie';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';

/**
 *
 * @param param0
 * @returns
 * unauthenticated user when accessing a shared url gets navigated to the corresponding page from login screen
 * but when the back button is clicked on the browser the middleware does not work to check of token
 * this is a workaround for the same
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useNpRouter();
  const token = Cookies.get('electo_u_tok');

  useEffect(() => {
    if (token) {
      router.push('/bills');
    }
  }, [router, token]);

  if (token) return null;

  return <>{children}</>;
}
