import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  ListFilter, 
  Wand2, 
  UserCheck, 
  Image as ImageIcon, 
  FileText, 
  FileCheck2, 
  Settings, 
  GitCompare,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AuditReport } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentReport: AuditReport;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentReport,
  isOpen,
  onCloseMobile
}) => {
  const primaryNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: `${currentReport.score.overall}%` },
    { id: 'scanner', label: 'Website Scanner', icon: Search },
    { id: 'issues', label: 'Issues', icon: ListFilter, badge: currentReport.issues.length.toString() },
    { id: 'ai-fixes', label: 'AI Fixes', icon: Wand2, badge: 'Gemini' },
    { id: 'personas', label: 'Personas', icon: UserCheck },
    { id: 'alttext', label: 'Alt Text Generator', icon: ImageIcon },
    { id: 'simplifier', label: 'Text Simplifier', icon: FileText },
    { id: 'beforeafter', label: 'Before vs After', icon: GitCompare },
    { id: 'reports', label: 'Reports', icon: FileCheck2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
          {/* Main Nav Items */}
          <div className="space-y-6">
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Navigation
              </div>
              <nav className="space-y-1">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-blue-200/70 text-blue-900'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Card: Live Active Audit Widget */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="font-medium">Active Website</span>
                <span className="font-bold text-blue-300">{currentReport.score.overall}/100</span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {currentReport.pageTitle || currentReport.url}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-white/10">
                <span>{currentReport.summary.totalIssues} Violations</span>
                <button
                  onClick={() => {
                    setActiveTab('scanner');
                    onCloseMobile();
                  }}
                  className="text-blue-300 hover:text-blue-200 font-semibold cursor-pointer"
                >
                  Rescan
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
