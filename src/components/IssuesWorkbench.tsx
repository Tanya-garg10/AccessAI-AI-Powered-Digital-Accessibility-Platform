import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  XCircle, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  Wand2, 
  Copy, 
  Check, 
  Eye, 
  Brain, 
  Hand, 
  Volume2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { AuditIssue, AuditReport, Category, PersonaType, Severity } from '../types';

interface IssuesWorkbenchProps {
  currentReport: AuditReport;
  initialSeverityFilter?: string;
  onOpenInFixes: (issueId: string) => void;
  onSimulateFix: (issueId: string) => void;
}

export const IssuesWorkbench: React.FC<IssuesWorkbenchProps> = ({
  currentReport,
  initialSeverityFilter = 'all',
  onOpenInFixes,
  onSimulateFix
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>(initialSeverityFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter issues
  const filteredIssues = currentReport.issues.filter(issue => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (personaFilter !== 'all' && !issue.affectedPersonas.includes(personaFilter as PersonaType)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchWcag = issue.wcagCriterion.toLowerCase().includes(q);
      const matchRule = issue.ruleId.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchWcag && !matchRule) return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Critical Barrier
          </span>
        );
      case 'serious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Serious
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5" /> Moderate
          </span>
        );
      case 'minor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5" /> Minor
          </span>
        );
    }
  };

  const getPersonaPill = (p: PersonaType) => {
    switch (p) {
      case 'visual':
        return (
          <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Eye className="w-3 h-3" /> Visual
          </span>
        );
      case 'cognitive':
        return (
          <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Brain className="w-3 h-3" /> Cognitive
          </span>
        );
      case 'motor':
        return (
          <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Hand className="w-3 h-3" /> Motor
          </span>
        );
      case 'hearing':
        return (
          <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Volume2 className="w-3 h-3" /> Hearing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            WCAG 2.1 Level AA & AAA Violation Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Issues Workbench
          </h1>
          <p className="text-sm text-slate-600">
            Inspect detected DOM barriers, understand human impact, and apply AI code fixes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
            Showing <strong className="text-slate-900">{filteredIssues.length}</strong> of {currentReport.issues.length} issues
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by rule, criterion, or keyword (e.g., contrast, alt, label)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick Clear */}
          {(severityFilter !== 'all' || categoryFilter !== 'all' || personaFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSeverityFilter('all');
                setCategoryFilter('all');
                setPersonaFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap cursor-pointer px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdowns / Pills Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Severity Level
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Barriers ({currentReport.summary.criticalCount})</option>
              <option value="serious">Serious ({currentReport.summary.seriousCount})</option>
              <option value="moderate">Moderate ({currentReport.summary.moderateCount})</option>
              <option value="minor">Minor ({currentReport.summary.minorCount})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="visual">Visual Accessibility</option>
              <option value="screen_reader">Screen Reader</option>
              <option value="keyboard">Keyboard Navigation</option>
              <option value="forms">Forms & Inputs</option>
              <option value="readability">Content Readability</option>
              <option value="navigation">Navigation & Landmarks</option>
            </select>
          </div>

          {/* Persona Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Affected Persona
            </label>
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Personas</option>
              <option value="visual">Visual Impairment</option>
              <option value="cognitive">Cognitive Difficulty</option>
              <option value="motor">Motor Disability</option>
              <option value="hearing">Hearing Impairment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No Matching Issues Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All accessibility checks for this filter criteria are clear. Try clearing filters to inspect other categories.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isExpanded = expandedIssues[issue.id];
            return (
              <div
                key={issue.id}
                id={`issue-card-${issue.id}`}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  issue.isFixed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : issue.severity === 'critical'
                    ? 'border-rose-200 shadow-xs'
                    : 'border-slate-200 shadow-2xs'
                }`}
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700 font-medium">
                        {issue.wcagCriterion}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600 capitalize">
                        {issue.category.replace('_', ' ')}
                      </span>
                      {issue.isFixed && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Fixed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {issue.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {issue.description}
                    </p>

                    {/* Affected Personas */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400">Impacting:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {issue.affectedPersonas.map((p) => getPersonaPill(p))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 sm:self-start">
                    <button
                      onClick={() => onOpenInFixes(issue.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      AI Fix Studio
                    </button>

                    <button
                      onClick={() => onSimulateFix(issue.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        issue.isFixed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {issue.isFixed ? 'Revert Fix' : 'Simulate Fix'}
                    </button>

                    <button
                      onClick={() => toggleExpand(issue.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Code snippet, Why it matters & AI Recommendation */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
                    {/* Why It Matters Callout (Section 8 spec) */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Why This Matters (Human Accessibility Impact)
                      </div>
                      <p className="leading-relaxed text-indigo-900/90">
                        {issue.whyItMatters || 'Assistive technology users will experience friction, disorientation, or an inability to complete actions on this page.'}
                      </p>
                    </div>

                    {/* Affected Element Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-slate-500" /> Affected Element HTML
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {issue.selector}
                        </span>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-900 text-rose-300 text-xs font-mono overflow-x-auto border border-slate-800">
                        <code>{issue.elementHtml}</code>
                      </pre>
                    </div>

                    {/* AI Fix Suggestion */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Wand2 className="w-3.5 h-3.5 text-emerald-600" /> Recommended Corrected Code
                        </span>
                        <button
                          onClick={() => handleCopyCode(issue.id, issue.aiFixedHtml)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === issue.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Fixed Code
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto border border-slate-800">
                        <code>{issue.aiFixedHtml}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
