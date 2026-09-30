import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />
      <main className={`flex-1 animate-in fade-in duration-300 ${isLanding ? '' : 'pt-[92px]'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
