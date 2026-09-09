import React from 'react';
import { ArrowRight, Search, FileText, CheckCircle2, TrendingUp, Users, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onScanClick: () => void;
  onAnalyzeContentClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScanClick, onAnalyzeContentClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80 pt-10 pb-12">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
          <span>Automated WCAG 2.1 AA Compliance + Gemini AI Remediation</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
          Make every digital experience <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
            accessible by default.
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
          AI-powered accessibility auditing, personalized recommendations, and intelligent fixes for inclusive digital experiences.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            id="hero-scan-website-btn"
            onClick={onScanClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Scan Website
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-analyze-content-btn"
            onClick={onAnalyzeContentClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Analyze Content
          </button>
        </div>

        {/* Stats requested by prompt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/80">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">500+</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Issues Detected</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">92%</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Average Improvement</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">4</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Accessibility Personas</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">AI-Powered</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Gemini 3.8 Analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
};
