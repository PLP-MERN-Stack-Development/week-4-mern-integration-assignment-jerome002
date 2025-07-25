import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h2 className="text-xl font-bold">Blog</h2>
      <div className="space-x-4">
        <Link
          to="/"
          className="hover:text-blue-400 font-medium transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/create"
          className="hover:text-blue-400 font-medium transition-colors duration-200"
        >
          Create Post
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
