import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { mockStore } from '../services/mockStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const isSpecialAdmin = email.toLowerCase().includes('admin');
    mockStore.login(email, isSpecialAdmin ? 'admin' : 'customer');
    navigate(isSpecialAdmin ? '/admin' : '/shop');
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      mockStore.switchRole('admin');
      navigate('/admin');
    } else {
      mockStore.switchRole('customer');
      navigate('/shop');
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-black text-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-900 p-8 sm:p-10">
        <div className="mb-8">
          <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-widest block mb-1">
            AUTHENTICATION PORTAL
          </span>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-white">
            SIGN IN
          </h1>
          <p className="text-neutral-400 text-xs mt-2 font-light">
            Access your customer cart or admin inventory controls.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-6 p-4 bg-black border border-neutral-800 space-y-2">
          <div className="text-[10px] font-mono uppercase text-neutral-400">
            DEMO ONE-CLICK ROLES:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#00A8FF]" />
              <span>CUSTOMER</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMIN</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-black border border-neutral-800 text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-neutral-800 text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <span>SIGN IN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center font-mono text-xs text-neutral-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00A8FF] hover:underline font-semibold">
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
};
