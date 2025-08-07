import React from 'react';
import { PlaneIcon } from './icons';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md z-20 p-4 flex items-center flex-shrink-0">
      <PlaneIcon className="w-8 h-8 mr-3 text-cyan-400" />
      <h1 className="text-xl font-bold tracking-wider">Live Flight Tracker</h1>
    </header>
  );
};

export default Header;