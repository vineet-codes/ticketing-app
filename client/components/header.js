import React from 'react';
import Link from 'next/link';

const Header = ({ currentUser }) => {
  return (
    <nav>
      <Link href='/'>
        <a>Tickets</a>
      </Link>
      {currentUser ? 'Sign out' : 'Sigin in / up'}
    </nav>
  );
};

export default Header;
