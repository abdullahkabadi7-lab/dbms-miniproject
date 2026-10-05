import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DynamicCursorBackground } from '../components/effects/DynamicCursorBackground';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      {/* Global Interactive Dynamic Cursor & Parallax Ambient Lighting */}
      <DynamicCursorBackground />

      <Navbar />
      <main className={`relative z-10 flex-1 animate-in fade-in duration-300 ${isLanding ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
