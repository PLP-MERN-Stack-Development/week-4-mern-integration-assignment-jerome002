// Main layout component
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;