import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, User, AlertCircle, ShoppingCart, ShieldAlert } from 'lucide-react';
import { mockStore } from '../services/mockStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const res = await mockStore.loginWithCredentials(identifier, password);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Invalid username/email or password.');
      return;
    }

    // Success: Redirect to target or respective portal
    if (redirectPath) {
      navigate(redirectPath);
    } else if (res.user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-900 p-8 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00A8FF] uppercase tracking-widest mb-1">
            <span>SECURE ACCESS PORTAL</span>
            <span>•</span>
            <span>SMARTMART</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-tight text-white">
            SIGN IN
          </h1>
          <p className="text-neutral-400 text-xs mt-1 font-light">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Redirect Notice Banner (No passwords shown) */}
        {redirectPath && (
          <div className="mb-6 p-3.5 bg-neutral-950 border border-neutral-800 text-xs font-mono flex items-start gap-3">
            {redirectPath.includes('admin') ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-neutral-300">
                  <span className="text-amber-400 font-bold block mb-0.5">ADMIN ACCESS REQUIRED</span>
                  Please sign in with administrator credentials to access the console.
                </div>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-[#00A8FF] shrink-0 mt-0.5" />
                <div className="text-neutral-300">
                  <span className="text-[#00A8FF] font-bold block mb-0.5">CHECKOUT SIGN IN REQUIRED</span>
                  Please sign in to your account to confirm and authorize your order.
                </div>
              </>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                className="w-full bg-black border border-neutral-800 text-white pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
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
                className="w-full bg-black border border-neutral-800 text-white pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#00A8FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00A8FF] hover:bg-[#29C5FF] disabled:opacity-50 text-black font-mono font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center font-mono text-xs text-neutral-400 flex items-center justify-between">
          <Link to="/shop" className="hover:text-white transition-colors">
            ← CONTINUE SHOPPING
          </Link>
          <Link to="/register" className="text-[#00A8FF] hover:underline font-semibold">
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
};
