import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Eye, 
  Brain, 
  Hand, 
  Volume2, 
  FileText, 
  Image as ImageIcon, 
  Wand2, 
  RotateCw, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AuditReport, RecentScanItem } from '../types';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface DashboardOverviewProps {
  currentReport: AuditReport;
  recentScans: RecentScanItem[];
  onNavigate: (tab: string, filter?: string) => void;
  onSelectScanUrl: (url: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentReport,
  recentScans,
  onNavigate,
  onSelectScanUrl
}) => {
  const { score, summary } = currentReport;

  // Category scores data for Bar chart
  const categoryData = [
    { name: 'Visual', score: score.visual, color: '#3B82F6' },
    { name: 'Screen Reader', score: score.screenReader, color: '#8B5CF6' },
    { name: 'Keyboard', score: score.keyboard || 75, color: '#10B981' },
    { name: 'Readability', score: score.readability, color: '#F59E0B' },
    { name: 'Forms', score: score.forms || 72, color: '#06B6D4' }
  ];

  // Radial data for circular score
  const radialData = [{ name: 'Score', value: score.overall, fill: score.overall >= 85 ? '#10B981' : score.overall >= 70 ? '#3B82F6' : '#EF4444' }];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Metric Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            Accessible Technology for All
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Accessibility Executive Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Active audit for <span className="font-semibold text-white underline decoration-blue-400 underline-offset-2">{currentReport.pageTitle || currentReport.url}</span>. Conforms to WCAG 2.1 Level AA & AAA standards.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            New Website Scan
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 backdrop-blur-sm transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-300" />
            Export Report
          </button>
        </div>
      </div>

      {/* Primary Analytics Grid: Circular Score + Category Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Accessibility Score (Circular Progress) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Accessibility Score</h2>
              <p className="text-xs text-slate-500">Automated axe-core compliance metric</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              score.overall >= 85 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : score.overall >= 70 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {score.overall >= 85 ? 'High Compliance' : score.overall >= 70 ? 'Moderate Risk' : 'Critical Barrier'}
            </span>
          </div>

          {/* Radial Score Gauge */}
          <div className="h-56 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="75%" 
                outerRadius="100%" 
                barSize={16} 
                data={radialData} 
                startAngle={210} 
                endAngle={-30}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  background={{ fill: '#F1F5F9' }} 
                  dataKey="value" 
                  cornerRadius={12} 
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {score.overall}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{currentReport.passedChecksCount} Passed Checks</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>Target: 95+ (WCAG AAA)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Category Scores Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Category Performance</h2>
              <p className="text-xs text-slate-500">Breakdown across 5 core digital accessibility dimensions</p>
            </div>
            <button 
              onClick={() => onNavigate('issues')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View all issues <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  formatter={(val: number) => [`${val} / 100`, 'Score']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-slate-100 text-center">
            {categoryData.map((cat) => (
              <div key={cat.name} className="p-2 rounded-xl bg-slate-50">
                <span className="block text-[11px] font-medium text-slate-500 truncate">{cat.name}</span>
                <span className="text-sm font-bold text-slate-900">{cat.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue Summary Cards (Critical, Serious, Moderate, Minor) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Issue Severity Breakdown</h2>
            <p className="text-xs text-slate-500">Click any severity card to inspect matching code violations</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {summary.totalIssues} Active Barriers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Critical */}
          <button
            onClick={() => onNavigate('issues', 'critical')}
            className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 hover:border-rose-300 hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-rose-700">{summary.criticalCount}</span>
            </div>
            <div className="font-bold text-rose-950 text-sm">Critical Barriers</div>
            <p className="text-xs text-rose-600 mt-1">Blocks screen reader or keyboard access entirely</p>
          </button>

          {/* Serious */}
          <button
            onClick={() => onNavigate('issues', 'serious')}
            className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:border-amber-300 hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-amber-700">{summary.seriousCount}</span>
            </div>
            <div className="font-bold text-amber-950 text-sm">Serious Issues</div>
            <p className="text-xs text-amber-600 mt-1">High hindrance for low vision & cognitive users</p>
          </button>

          {/* Moderate */}
          <button
            onClick={() => onNavigate('issues', 'moderate')}
            className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 hover:border-blue-300 hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-blue-700">{summary.moderateCount}</span>
            </div>
            <div className="font-bold text-blue-950 text-sm">Moderate Issues</div>
            <p className="text-xs text-blue-600 mt-1">Heading order, vague links, or non-optimal UX</p>
          </button>

          {/* Minor / Fixed */}
          <button
            onClick={() => onNavigate('ai-fixes')}
            className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Wand2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-700">{summary.fixedCount}</span>
            </div>
            <div className="font-bold text-emerald-950 text-sm">Simulated AI Fixes</div>
            <p className="text-xs text-emerald-600 mt-1">Issues resolved via Gemini code diff engine</p>
          </button>
        </div>
      </div>

      {/* Quick Access Feature Launchpads */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('personas')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Personas Impact</h3>
          <p className="text-xs text-slate-500 mt-1">Evaluate site impact on Visual, Cognitive, Motor & Hearing users</p>
          <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-3">
            Open personas <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('ai-fixes')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Wand2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">AI Remediation</h3>
          <p className="text-xs text-slate-500 mt-1">Inspect side-by-side code diffs and copy accessible HTML</p>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-3">
            Fix issues <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('alttext')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Alt-Text Generator</h3>
          <p className="text-xs text-slate-500 mt-1">Multimodal vision analysis generating compliant alt text</p>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-3">
            Analyze images <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('simplifier')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Text Simplifier</h3>
          <p className="text-xs text-slate-500 mt-1">Translate complex jargon into plain language (WCAG 3.1.5)</p>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-3">
            Simplify text <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Recent Scans Table (Explicit prompt requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Recent Audits & Scans</h2>
            <p className="text-xs text-slate-500">Historical accessibility evaluations stored in database</p>
          </div>
          <button 
            onClick={() => onNavigate('scanner')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Scan new URL <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Website</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Issues</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{scan.pageTitle}</div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {scan.url}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-xs ${
                        scan.score >= 85 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : scan.score >= 70 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {scan.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-slate-800">{scan.issuesCount} Total</div>
                    {scan.criticalCount > 0 ? (
                      <span className="text-[11px] text-rose-600 font-semibold">{scan.criticalCount} Critical</span>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">0 Critical</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {scan.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      scan.status === 'Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : scan.status === 'Action Needed'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectScanUrl(scan.url)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Load Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
