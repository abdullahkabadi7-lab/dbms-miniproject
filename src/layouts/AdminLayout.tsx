import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  Boxes,
  ClipboardList,
  History,
  Store,
  LogOut,
  RotateCcw,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Database
} from 'lucide-react';
import { mockStore } from '../services/mockStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = mockStore.getCurrentUser();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Suppliers', href: '/admin/suppliers', icon: Truck },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Stock Transactions', href: '/admin/transactions', icon: History },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo products, inventory, and orders to initial defaults?')) {
      mockStore.resetAllToDefaults();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    mockStore.switchRole('customer');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-[#050505] border-r border-neutral-900 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="h-16 px-6 border-b border-neutral-900 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-white">
                SMART<span className="text-[#00A8FF]">MART</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 border border-[#00A8FF]/40 text-[#00A8FF] bg-[#00A8FF]/5">
                ADMIN
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Info Pill */}
          <div className="p-4 mx-4 my-4 bg-black border border-neutral-900 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <Database className="w-3.5 h-3.5 text-[#00A8FF]" />
              <span>PostgreSQL Cluster</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronous Read/Write
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#00A8FF] text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.8]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-900 space-y-2 bg-[#050505]">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono tracking-wider uppercase border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#00A8FF] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#00A8FF]" />
            STORE FRONTEND
          </Link>

          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-mono tracking-wider uppercase text-neutral-400 hover:text-amber-400 transition-colors"
            title="Reset Mock Database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET DEMO DATA
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-black/95 backdrop-blur-md border-b border-neutral-900 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-semibold text-lg text-white tracking-wide">
              {navigation.find((item) => item.href === location.pathname)?.name || 'Admin Console'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-surface-900 px-3 py-1.5 border border-neutral-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACID ENFORCED</span>
            </div>

            <button
              className="p-2 text-neutral-400 hover:text-white relative"
              title="Audit Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00A8FF]" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-white">{currentUser.full_name}</div>
                <div className="text-[10px] font-mono text-[#00A8FF]">SYSTEM ADMINISTRATOR</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                title="Exit Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Routed Admin Page Body */}
        <main className="flex-1 p-4 sm:p-8 bg-black overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
