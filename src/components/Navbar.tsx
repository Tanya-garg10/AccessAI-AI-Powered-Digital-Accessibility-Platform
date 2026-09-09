import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  Image as ImageIcon, 
  GitCompare, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Sliders,
  Wand2,
  ListFilter
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSearchSubmit?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  onSearchSubmit
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Scan Complete: CityCare Hospital',
      time: '10m ago',
      score: '74/100',
      type: 'warning'
    },
    {
      id: 2,
      title: 'High Contrast Issue Remediated',
      time: '35m ago',
      score: '+6 pts',
      type: 'success'
    },
    {
      id: 3,
      title: 'WCAG 2.1 AA Audit Ready for Export',
      time: '1h ago',
      score: 'PDF ready',
      type: 'info'
    }
  ];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (onSearchSubmit) onSearchSubmit(searchQuery);
      setActiveTab('issues');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle + Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('overview')}
              id="brand-logo"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Access<span className="text-blue-600">AI</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    WCAG 2.1
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Make every digital experience accessible by default.
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search WCAG issues, criteria, or websites..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>Status: {n.score}</span>
                          <span className="text-emerald-600 font-medium">Logged</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
              title="View settings & profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:ring-2 group-hover:ring-blue-400 transition-all">
                AA
              </div>
              <div className="hidden xl:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">Lead Auditor</span>
                <span className="block text-[10px] text-slate-500 leading-tight">AccessAI Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
