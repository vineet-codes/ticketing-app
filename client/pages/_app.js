// pages/_app.js
import 'tailwindcss/tailwind.css';
import './../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className='bg-gray-100 h-screen py-8'>
      <div>
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

export default MyApp;
