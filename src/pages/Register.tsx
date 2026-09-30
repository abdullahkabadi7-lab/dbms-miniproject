import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import { mockStore } from '../services/mockStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: 'customer'
    });
    navigate('/shop');
  };

  return (
    <div className="w-full min-h-[85vh] bg-black text-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-neutral-900 p-8 sm:p-10">
        <div className="mb-8">
          <span className="text-xs font-mono text-[#00A8FF] uppercase tracking-widest block mb-1">
            NEW CUSTOMER REGISTRATION
          </span>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-white">
            CREATE ACCOUNT
          </h1>
          <p className="text-neutral-400 text-xs mt-2 font-light">
            Register your profile to commit orders to the PostgreSQL database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Jordan Hayes"
              className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jordan@example.com"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Account Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Default Shipping Address *
            </label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street Address, City, Postal Code"
              className="w-full bg-black border border-neutral-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A8FF] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00A8FF] hover:bg-[#29C5FF] text-black font-mono font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <span>REGISTER CUSTOMER RECORD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center font-mono text-xs text-neutral-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#00A8FF] hover:underline font-semibold">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
};
