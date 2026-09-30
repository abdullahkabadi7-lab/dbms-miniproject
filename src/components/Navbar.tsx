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

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User>(mockStore.getCurrentUser());
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
    if (currentUser.role === 'admin') {
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
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-neutral-900 transition-all duration-300">
      {/* Top utility alert bar */}
      <div className="bg-[#050505] border-b border-white/[0.06] px-4 py-1.5 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          <span className="tracking-wider">CERTIFIED ORGANIC PROVISIONS &bull; REAL-TIME INVENTORY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-neutral-400">
            SESSION: <span className="text-white font-semibold">{currentUser.full_name}</span> ({currentUser.role.toUpperCase()})
          </span>
          <button
            onClick={handleToggleRole}
            className="text-[10px] uppercase font-mono px-2 py-0.5 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-colors"
          >
            SWITCH TO {currentUser.role === 'admin' ? 'CUSTOMER' : 'ADMIN'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl tracking-tighter text-white">
              SMART<span className="text-neutral-400 group-hover:text-white transition-colors">MART</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-2"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-mono tracking-widest uppercase transition-colors relative py-1 ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search trigger */}
          <Link
            to="/shop"
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            title="Search Products"
            aria-label="Search Products"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Cart Icon with Live Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-neutral-400 hover:text-white transition-colors"
            title="View Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-black font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Portal Shortcut */}
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all bg-[#0c0c0e]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            ADMIN PORTAL
          </Link>

          {/* User Profile / Auth */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white"
                  title="View Profile and Orders"
                >
                  <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="max-w-[100px] truncate">{currentUser.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white"
              >
                <LogIn className="w-3.5 h-3.5" />
                LOGIN
              </Link>
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
          </div>
        </div>
      )}
    </header>
  );
};
