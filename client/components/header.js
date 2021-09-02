import React from 'react';
import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='justify-self-end'>
          <Link href={href}>
            <a>{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <div className='mb-12'>
      <nav className='grid grid-cols-6 gap-2 justify-items-center'>
        <h1 className='text-gray-900 font-semibold text-3xl col-start-1 col-span-1 place-self-center'>
          <Link href='/'>
            <a>GetTickets</a>
          </Link>
        </h1>
        <ul className='col-start-5 col-span-2 place-self-center flex flex-row gap-x-4'>
          {/* {currentUser ? <li>Sign out</li> : <li>Sigin in / up</li>} */}
          {links}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
