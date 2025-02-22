import React, { useEffect } from 'react';
import LoginForm from './LoginForm';
import Head from 'next/head';
import { useRouter } from 'next/router';
const Login: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('hasura-jwt-token');
    if (token) {
      router.push('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-boxdark">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
              <div className="w-full">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                    Log In
                  </h2>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Login;
