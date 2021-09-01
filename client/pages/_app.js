// pages/_app.js
import App from 'next/app';

import 'tailwindcss/tailwind.css';
import './../styles/globals.css';

import Header from './../components/header';

import buildClient from '../api/build-client';

const MyApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div className='bg-gray-100 h-screen py-8'>
      <div>
        <h1>
          <Header currentUser={currentUser} />
        </h1>
        <div className='max-w-lg mx-auto '>
          <h1 className='text-gray-900 font-semibold text-2xl'>
            ticketing.dev
          </h1>
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // we are on the server
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, currentUser: data.currentUser };
};

export default MyApp;
