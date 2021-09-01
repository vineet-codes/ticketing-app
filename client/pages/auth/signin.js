import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <div className='mt-8'>
      <h1 className='text-gray-900 font-semibold text-xl'>Sign In</h1>
      <div className='bg-white py-8 px-6 shadow rounded-lg mt-4'>
        <form className='mb-0 space-y-6' onSubmit={onSubmit} method='POST'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <div className='mt-1'>
              <input
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                required
                className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='mt-1'>
              <input
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                name='password'
                type='password'
                required
              />
            </div>
          </div>
          {errors}
          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
