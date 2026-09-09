import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { WebsiteScanner } from './components/WebsiteScanner';
import { IssuesWorkbench } from './components/IssuesWorkbench';
import { AiFixesWorkbench } from './components/AiFixesWorkbench';
import { PersonasView } from './components/PersonasView';
import { TextSimplifier } from './components/TextSimplifier';
import { AltTextGenerator } from './components/AltTextGenerator';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { DEMO_PRESET_SITES, INITIAL_RECENT_SCANS } from './data/presets';
import { AuditReport, RecentScanItem } from './types';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentReport, setCurrentReport] = useState<AuditReport>(
    JSON.parse(JSON.stringify(DEMO_PRESET_SITES['https://healthcare-portal-demo.org']))
  );
  const [recentScans, setRecentScans] = useState<RecentScanItem[]>(INITIAL_RECENT_SCANS);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedPersonaForView, setSelectedPersonaForView] = useState<string>('visual');
  const [selectedIssueForFix, setSelectedIssueForFix] = useState<string | null>(null);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<string>('all');

  // Handle fix simulation & dynamic score recalculation
  const handleSimulateFix = (issueId: string) => {
    setCurrentReport(prev => {
      const updatedIssues = prev.issues.map(iss => {
        if (iss.id === issueId) {
          return { ...iss, isFixed: !iss.isFixed };
        }
        return iss;
      });

      const fixedCount = updatedIssues.filter(i => i.isFixed).length;
      const remainingUnfixed = updatedIssues.filter(i => !i.isFixed);

      const criticalDeductions = remainingUnfixed.filter(i => i.severity === 'critical').length * 10;
      const seriousDeductions = remainingUnfixed.filter(i => i.severity === 'serious').length * 6;
      const moderateDeductions = remainingUnfixed.filter(i => i.severity === 'moderate').length * 3;
      const newScore = Math.min(98, Math.max(40, 100 - (criticalDeductions + seriousDeductions + moderateDeductions)));

      return {
        ...prev,
        score: {
          ...prev.score,
          overall: newScore,
          visual: Math.min(98, prev.score.visual + (fixedCount * 3)),
          screenReader: Math.min(98, prev.score.screenReader + (fixedCount * 4)),
          keyboard: Math.min(98, (prev.score.keyboard || 75) + (fixedCount * 3)),
          readability: Math.min(98, prev.score.readability + (fixedCount * 2)),
          forms: Math.min(98, (prev.score.forms || 72) + (fixedCount * 4))
        },
        summary: {
          ...prev.summary,
          fixedCount
        },
        issues: updatedIssues
      };
    });
  };

  const handleNavigateWithFilter = (tab: string, filter?: string) => {
    if (filter) {
      setActiveSeverityFilter(filter);
    } else {
      setActiveSeverityFilter('all');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInFixes = (issueId: string) => {
    setSelectedIssueForFix(issueId);
    setActiveTab('ai-fixes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPresetScan = (url: string) => {
    if (DEMO_PRESET_SITES[url]) {
      setCurrentReport(JSON.parse(JSON.stringify(DEMO_PRESET_SITES[url])));
    }
    setActiveTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header & Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSearchSubmit={() => {
          setActiveTab('issues');
        }}
      />

      {/* 2. Main Workspace Layout with Responsive Sidebar */}
      <div className="flex-1 flex w-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentReport={currentReport}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Content Container */}
        <main className="flex-1 lg:pl-64 min-w-0 w-full transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'overview' && (
              <DashboardOverview
                currentReport={currentReport}
                recentScans={recentScans}
                onNavigate={handleNavigateWithFilter}
                onSelectScanUrl={handleSelectPresetScan}
              />
            )}

            {activeTab === 'scanner' && (
              <WebsiteScanner 
                currentReport={currentReport} 
                setCurrentReport={setCurrentReport}
                onPersonaSelect={(personaId) => {
                  setSelectedPersonaForView(personaId);
                  setActiveTab('personas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'issues' && (
              <IssuesWorkbench
                currentReport={currentReport}
                initialSeverityFilter={activeSeverityFilter}
                onOpenInFixes={handleOpenInFixes}
                onSimulateFix={handleSimulateFix}
              />
            )}

            {activeTab === 'ai-fixes' && (
              <AiFixesWorkbench
                currentReport={currentReport}
                selectedIssueId={selectedIssueForFix}
                onSimulateFix={handleSimulateFix}
                onNavigateToIssues={() => setActiveTab('issues')}
              />
            )}

            {activeTab === 'personas' && (
              <PersonasView 
                currentReport={currentReport}
                selectedPersonaId={selectedPersonaForView}
                onNavigateToScanner={() => {
                  setActiveTab('scanner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'simplifier' && (
              <TextSimplifier />
            )}

            {activeTab === 'alttext' && (
              <AltTextGenerator />
            )}

            {activeTab === 'beforeafter' && (
              <BeforeAfterShowcase />
            )}

            {activeTab === 'reports' && (
              <ReportsView currentReport={currentReport} />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* 3. Clean Standardized Footer */}
      <footer className="lg:pl-64 bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">AccessAI</span>
            <span>• Accessible Technology for All • WCAG 2.1 AA / AAA</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>axe-core + Google Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">Enterprise Production Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
