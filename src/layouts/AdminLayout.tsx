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
  Database,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { DynamicCursorBackground } from '../components/effects/DynamicCursorBackground';

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

  React.useEffect(() => {
    if (!mockStore.isAdmin()) {
      navigate('/login?redirect=/admin');
    }
  }, [navigate, currentUser]);

  const handleResetData = () => {
    if (window.confirm('Reset all demo products, inventory, and orders to initial defaults?')) {
      mockStore.resetAllToDefaults();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    mockStore.logout();
    navigate('/login');
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#040507] text-white flex items-center justify-center font-mono text-sm">
        <div className="text-center space-y-4 p-8 border border-white/10 bg-surface-900 max-w-sm rounded-2xl shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-[#00A8FF]/10 border border-[#00A8FF]/30 flex items-center justify-center mx-auto text-[#00A8FF]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-[#00A8FF] font-bold tracking-widest uppercase">ADMIN ACCESS RESTRICTED</div>
          <div className="text-neutral-400 text-xs">Administrator credentials required. Redirecting to sign in...</div>
        </div>
      </div>
    );
  }

  const currentNav = navigation.find((item) => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-[#00A8FF] selection:text-black relative">
      {/* Global Interactive Dynamic Cursor & Parallax Ambient Star Lighting */}
      <DynamicCursorBackground />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-[#08090E] border-r border-[#181C26] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-6 border-b border-[#181C26] flex items-center justify-between shrink-0">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-white">
                SMART<span className="text-[#00A8FF]">MART</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border border-[#00A8FF]/30 text-[#00A8FF] bg-[#00A8FF]/10 font-bold">
                PRO
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Telemetry Status Card */}
          <div className="p-3.5 mx-4 my-4 bg-surface-950 border border-white/[0.08] rounded-xl text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Database className="w-3.5 h-3.5 text-[#00A8FF]" />
                <span className="font-semibold text-white">PostgreSQL 16</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 space-y-0.5">
              <div className="flex justify-between">
                <span>Cluster Pool:</span>
                <span className="text-neutral-200 font-medium">pg.Pool (Healthy)</span>
              </div>
              <div className="flex justify-between">
                <span>ACID Isolation:</span>
                <span className="text-cyan-400 font-medium">Row Locks Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 flex-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              CORE MODULES
            </div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all ${
                    isActive
                      ? 'border-l-2 border-[#00A8FF] bg-[#00A8FF]/15 text-white font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? 'text-[#00A8FF]' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#181C26] space-y-2.5 bg-[#08090E] shrink-0">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono tracking-wider uppercase rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:border-[#00A8FF] hover:bg-[#00A8FF]/5 transition-all"
          >
            <Store className="w-3.5 h-3.5 text-[#00A8FF]" />
            STORE FRONTEND
          </Link>

          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-[11px] font-mono tracking-wider uppercase text-neutral-400 hover:text-amber-400 transition-colors"
            title="Reset Mock Database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET DEMO DATA
          </button>

          {/* User Profile Info Card */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#00A8FF]/20 border border-[#00A8FF]/40 text-[#00A8FF] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                ADM
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{currentUser.full_name}</div>
                <div className="text-[10px] font-mono text-[#00A8FF]">SUPERADMIN</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#08090E]/90 backdrop-blur-md border-b border-[#181C26] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500 uppercase">ADMIN CONSOLE</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <h1 className="font-display font-bold text-white text-base tracking-wide">
                {currentNav?.name || 'Console'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-300 bg-surface-950 px-3 py-1.5 rounded-lg border border-white/[0.08]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACID ENFORCED</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-surface-950 px-3 py-1.5 rounded-lg border border-white/[0.08]">
              <Activity className="w-3.5 h-3.5 text-[#00A8FF]" />
              <span>POSTGRES LIVE</span>
            </div>

            <button
              className="p-2 text-neutral-400 hover:text-white relative rounded-lg hover:bg-white/[0.05]"
              title="Audit Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00A8FF]" />
            </button>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-[#00A8FF] px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-[#00A8FF]/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>LIVE STORE</span>
            </Link>
          </div>
        </header>

        {/* Routed Admin Page Body */}
        <main className="flex-1 p-4 sm:p-8 bg-transparent overflow-y-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
