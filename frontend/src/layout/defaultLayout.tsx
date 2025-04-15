import React from 'react';
import { Navbar } from '@/components/organisms/navbar';
import { AppFooter } from '@/components/organisms/app-footer';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-16 flex-1">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
};

export default DefaultLayout;
