import React from 'react';
import { useRouter } from 'next/router';

import { auth } from '../firebase/app';

const Logout = () => {
  const router = useRouter();

  React.useEffect(() => {
    auth.signOut().then(() => {
      router.push('/login');
    });
  }, []);
  return (
    <div tw="flex flex-col justify-center h-full gap-y-5">Logging out...</div>
  );
};
export default Logout;
