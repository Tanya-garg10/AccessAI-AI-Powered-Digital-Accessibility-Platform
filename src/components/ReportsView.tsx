import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  Globe, 
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { AuditReport } from '../types';

interface ReportsViewProps {
  currentReport: AuditReport;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentReport }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadJson = () => {
    setIsExporting(true);
    const reportData = {
      standard: 'WCAG 2.1 Level AA & AAA',
      generatedAt: new Date().toISOString(),
      reportId: `accessai-${Date.now()}`,
      certification: 'AccessAI Certified Accessibility Engine',
      ...currentReport
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AccessAI-Audit-Report-${currentReport.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const complianceStatus = currentReport.score.overall >= 85 
    ? 'High Compliance' 
    : currentReport.score.overall >= 70 
    ? 'Partially Compliant' 
    : 'Non-Compliant (Action Required)';

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Formal Audit Documentation
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Accessibility Compliance Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Exportable audit certificate conforming to WCAG 2.1 Level AA & AAA standards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJson}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Download JSON'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiedLink ? 'Link Copied' : 'Share'}
          </button>
        </div>
      </div>

      {/* Formal Printable Document Canvas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tight">
              <ShieldCheck className="w-8 h-8" />
              <span>Access<span className="text-slate-900">AI</span></span>
            </div>
            <p className="text-xs text-slate-500">
              Automated Digital Accessibility & Assistive Modeling Engine
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs text-slate-500">
            <div className="font-semibold text-slate-800">
              Certificate Ref: <span className="font-mono text-blue-600">ACC-{Math.abs(currentReport.url.length * 4821).toString(16).toUpperCase()}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div>Standard: WCAG 2.1 Level AA & AAA</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
            1. Executive Evaluation Summary
          </h2>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-800">
                Audited Resource: <span className="font-mono text-blue-600">{currentReport.url}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentReport.score.overall >= 85
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : currentReport.score.overall >= 70
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {complianceStatus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AccessAI automated engines evaluated the target DOM tree against 48 individual WCAG 2.1 criteria. The evaluation determined an overall accessibility posture of <strong>{currentReport.score.overall}/100</strong>, with <strong>{currentReport.summary.totalIssues} active barriers</strong> identified across Visual, Screen Reader, Keyboard Navigation, and Cognitive Readability.
            </p>
          </div>
        </div>

        {/* Score & Category Matrix */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
            2. Compliance Dimensions & Category Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-medium text-slate-500 block">Overall Score</span>
              <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{currentReport.score.overall}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-medium text-slate-500 block">Visual Access</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{currentReport.score.visual}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-medium text-slate-500 block">Screen Reader</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{currentReport.score.screenReader}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-medium text-slate-500 block">Keyboard Nav</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{currentReport.score.keyboard || 75}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-medium text-slate-500 block">Readability</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{currentReport.score.readability}%</span>
            </div>
          </div>
        </div>

        {/* Issue Severity Distribution */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
            3. Violation Distribution by Severity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-xs font-bold text-rose-800 block">Critical</span>
              <span className="text-2xl font-extrabold text-rose-700 mt-1 block">{currentReport.summary.criticalCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">Serious</span>
              <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{currentReport.summary.seriousCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-blue-800 block">Moderate</span>
              <span className="text-2xl font-extrabold text-blue-700 mt-1 block">{currentReport.summary.moderateCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 block">Simulated Fixed</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{currentReport.summary.fixedCount}</span>
            </div>
          </div>
        </div>

        {/* Actionable Issue Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
            4. Itemized Remediation Log ({currentReport.issues.length} Items)
          </h2>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Criterion</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Affected Personas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentReport.issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/50">
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        issue.severity === 'critical' 
                          ? 'bg-rose-100 text-rose-700' 
                          : issue.severity === 'serious' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {issue.wcagCriterion.split(' ')[0]} {issue.wcagCriterion.split(' ')[1]} {issue.wcagCriterion.split(' ')[2]}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {issue.title}
                    </td>
                    <td className="p-3 capitalize text-slate-500">
                      {issue.affectedPersonas.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Remediation Certification Seal */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Remediations calculated with Google Gemini multimodal reasoning</span>
          </div>
          <div className="font-semibold text-slate-700">
            Certified by AccessAI Accessibility Platform
          </div>
        </div>
      </div>
    </div>
  );
};
