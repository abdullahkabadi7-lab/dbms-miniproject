import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  LogOut,
  LogIn
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { User } from '../types';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(mockStore.getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      const cart = mockStore.getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      setCurrentUser(mockStore.getCurrentUser());
    };

    update();
    const unsubscribe = mockStore.subscribe(update);
    return () => {
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'ORDERS', path: '/orders' },
  ];

  const handleToggleRole = () => {
    if (currentUser?.role === 'admin') {
      mockStore.switchRole('customer');
      navigate('/');
    } else {
      mockStore.switchRole('admin');
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    mockStore.logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-black/70 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      {/* Top Edge Specular Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display font-black text-2xl tracking-tight uppercase">
              <span className="text-white group-hover:text-neutral-200 transition-colors">SMART</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8FF] to-[#29C5FF] drop-shadow-[0_0_12px_rgba(0,168,255,0.6)]">MART</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] mb-2 animate-pulse"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-mono tracking-widest uppercase transition-all duration-200 relative py-1 ${
                    isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00A8FF] to-[#29C5FF] shadow-[0_0_8px_rgba(0,168,255,0.8)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search trigger */}
          <Link
            to="/shop"
            className="p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            title="Search Products"
            aria-label="Search Products"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Cart Icon with Live Glowing Badge */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            title="View Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#00A8FF] to-[#29C5FF] text-black font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,168,255,0.8)] animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Portal Shortcut Pill Button */}
          <div className="hidden sm:block">
            <Button
              to="/admin"
              variant="secondary"
              size="sm"
              icon={<ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
              iconPosition="left"
            >
              ADMIN PORTAL
            </Button>
          </div>

          {/* User Profile / Auth */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all"
                  title="View Profile and Orders"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[100px] truncate">{currentUser.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-red-400 p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button to="/login" variant="ghost" size="sm" icon={<LogIn className="w-3.5 h-3.5" />} iconPosition="left">
                LOGIN
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-neutral-800 px-6 py-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-sm font-mono tracking-wider text-neutral-300 hover:text-white py-1 border-b border-neutral-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono tracking-wider text-white py-1 border-b border-neutral-900 flex items-center justify-between"
            >
              <span>ADMIN PORTAL</span>
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3 font-mono text-xs">
            {currentUser ? (
              <>
                <div className="text-neutral-400 flex items-center justify-between">
                  <span>USER:</span>
                  <span className="text-white">{currentUser.full_name}</span>
                </div>
                <button
                  onClick={() => {
                    handleToggleRole();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 bg-neutral-900 border border-neutral-800 text-white uppercase tracking-wider text-center cursor-pointer"
                >
                  SWITCH TO {currentUser.role === 'admin' ? 'CUSTOMER' : 'ADMIN'}
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 bg-red-950/40 border border-red-900 text-red-300 uppercase tracking-wider text-center cursor-pointer"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <Button
                to="/login"
                variant="accent"
                size="sm"
                className="w-full text-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                SIGN IN TO ACCOUNT
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
