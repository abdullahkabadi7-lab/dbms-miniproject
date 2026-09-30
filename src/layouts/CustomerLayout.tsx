import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#00A8FF] selection:text-black">
      <Navbar />
      <main className="flex-1 animate-in fade-in duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
