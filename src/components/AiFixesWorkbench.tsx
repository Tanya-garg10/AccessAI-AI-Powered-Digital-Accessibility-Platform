import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  Check, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  Brain, 
  Hand, 
  Volume2, 
  ShieldCheck,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { AuditIssue, AuditReport, PersonaType } from '../types';

interface AiFixesWorkbenchProps {
  currentReport: AuditReport;
  selectedIssueId?: string | null;
  onSimulateFix: (issueId: string) => void;
  onNavigateToIssues: () => void;
}

export const AiFixesWorkbench: React.FC<AiFixesWorkbenchProps> = ({
  currentReport,
  selectedIssueId,
  onSimulateFix,
  onNavigateToIssues
}) => {
  const [activeIssueId, setActiveIssueId] = useState<string>(
    selectedIssueId || currentReport.issues[0]?.id || ''
  );
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);
  const [isGeneratingAiAnalysis, setIsGeneratingAiAnalysis] = useState(false);
  const [customAiReasoning, setCustomAiReasoning] = useState<Record<string, any>>({});

  const activeIssue = currentReport.issues.find(i => i.id === activeIssueId) || currentReport.issues[0];

  const handleCopy = (text: string, type: 'before' | 'after') => {
    navigator.clipboard.writeText(text);
    if (type === 'before') {
      setCopiedBefore(true);
      setTimeout(() => setCopiedBefore(false), 2000);
    } else {
      setCopiedAfter(true);
      setTimeout(() => setCopiedAfter(false), 2000);
    }
  };

  const handleLiveGeminiAnalysis = async () => {
    if (!activeIssue) return;
    setIsGeneratingAiAnalysis(true);
    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elementHtml: activeIssue.elementHtml,
          ruleId: activeIssue.ruleId,
          wcagCriterion: activeIssue.wcagCriterion,
          description: activeIssue.description,
          whyItMatters: activeIssue.whyItMatters,
          affectedPersonas: activeIssue.affectedPersonas
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCustomAiReasoning(prev => ({ ...prev, [activeIssue.id]: data }));
      }
    } catch (err) {
      console.warn('Gemini live analysis error:', err);
    } finally {
      setIsGeneratingAiAnalysis(false);
    }
  };

  const currentAnalysis = customAiReasoning[activeIssue?.id] || {
    explanation: `The element lacks critical accessible properties mandated by ${activeIssue?.wcagCriterion}. Screen readers and keyboard navigation require explicit DOM relationships.`,
    whyItMatters: activeIssue?.whyItMatters || 'Assistive technology users cannot perceive or activate this control properly.',
    recommendedFix: activeIssue?.aiFixSuggestion || 'Apply semantic markup with explicit accessible names.',
    fixedHtml: activeIssue?.aiFixedHtml || activeIssue?.elementHtml,
    personaImpact: `Resolving this directly unblocks ${activeIssue?.affectedPersonas?.join(' and ')} users.`
  };

  if (!activeIssue) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 text-lg">All Detected Issues Resolved!</h3>
        <p className="text-xs text-slate-500 mt-1">
          The current website has 0 remaining accessibility violations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Gemini 3.8 Flash Code Remediation Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Fixes & Code Remediation
          </h1>
          <p className="text-sm text-slate-600">
            Side-by-side code diffs, root cause explanations, and live score recalculation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Score</span>
              <span className="text-lg font-extrabold text-slate-900">{currentReport.score.overall}/100</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Issue Selector Sidebar + Diff Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Issue ({currentReport.issues.length})
            </span>
            <button 
              onClick={onNavigateToIssues}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Filter list
            </button>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {currentReport.issues.map((issue) => {
              const isSelected = activeIssue.id === issue.id;
              return (
                <button
                  key={issue.id}
                  onClick={() => setActiveIssueId(issue.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      issue.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : issue.severity === 'serious'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>

                    {issue.isFixed ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fixed
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {issue.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {issue.wcagCriterion}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Remediation Diff Studio (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Issue Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 font-mono">
                    {activeIssue.wcagCriterion}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600 font-semibold capitalize">
                    {activeIssue.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {activeIssue.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {activeIssue.description}
                </p>
              </div>

              {/* Simulate Fix Action Button */}
              <div className="flex items-center gap-2 sm:self-start">
                <button
                  onClick={() => onSimulateFix(activeIssue.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all cursor-pointer ${
                    activeIssue.isFixed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activeIssue.isFixed ? 'Fix Applied (Revert)' : 'Simulate Fix Live'}
                </button>
              </div>
            </div>

            {/* AI Explanation & Why it matters box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Root Cause Explanation
                  </span>
                  <button
                    onClick={handleLiveGeminiAnalysis}
                    disabled={isGeneratingAiAnalysis}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingAiAnalysis ? 'animate-spin' : ''}`} />
                    Refresh AI
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentAnalysis.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1.5">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" /> Human Impact
                </span>
                <p className="text-xs text-indigo-900/90 leading-relaxed">
                  {currentAnalysis.whyItMatters}
                </p>
              </div>
            </div>

            {/* Persona Unblock Callout */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Persona Impact:</strong> {currentAnalysis.personaImpact}
              </span>
            </div>
          </div>

          {/* Interactive Code Diff: Side by Side (Before vs After) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Interactive Code Remediation Diff
                </h3>
                <p className="text-xs text-slate-500">
                  Compare inaccessible source markup with WCAG compliant corrected code
                </p>
              </div>
              <button
                onClick={() => handleCopy(currentAnalysis.fixedHtml, 'after')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {copiedAfter ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Fixed Code!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Fixed Code
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Inaccessible HTML (Before)
                  </span>
                  <button
                    onClick={() => handleCopy(activeIssue.elementHtml, 'before')}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBefore ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/40 text-rose-300 font-mono text-xs overflow-x-auto min-h-[140px]">
                  <pre className="whitespace-pre-wrap">{activeIssue.elementHtml}</pre>
                </div>
              </div>

              {/* After Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> WCAG Compliant HTML (After)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Validated
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/40 text-emerald-300 font-mono text-xs overflow-x-auto min-h-[140px]">
                  <pre className="whitespace-pre-wrap">{currentAnalysis.fixedHtml}</pre>
                </div>
              </div>
            </div>

            {/* Remediation Guide Instructions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block">
                Developer Remediation Guide:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {currentAnalysis.recommendedFix}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
