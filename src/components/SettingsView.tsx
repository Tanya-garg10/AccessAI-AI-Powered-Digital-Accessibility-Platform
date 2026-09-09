import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Server, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Code2,
  Sliders,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [wcagLevel, setWcagLevel] = useState<'AA' | 'AAA'>('AA');
  const [contrastThreshold, setContrastThreshold] = useState<number>(4.5);
  const [includeCognitiveChecks, setIncludeCognitiveChecks] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-slate-600" />
          Engine Configuration & Infrastructure
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Settings & Cloud Topology
        </h1>
        <p className="text-sm text-slate-600">
          Configure WCAG conformance rules, inspect AWS infrastructure, and view database integrations.
        </p>
      </div>

      {/* 1. Accessibility Rule Engine Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              WCAG Conformance Policy
            </h2>
            <p className="text-xs text-slate-500">
              Tune automated axe-core heuristics and scoring strictness
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Target WCAG Level</span>
              <span className="text-xs text-slate-500">Select standard for automated audits</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWcagLevel('AA')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  wcagLevel === 'AA'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Level AA (Default)
              </button>
              <button
                type="button"
                onClick={() => setWcagLevel('AAA')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  wcagLevel === 'AAA'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Level AAA (Strict)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Minimum Text Contrast Ratio</span>
              <span className="text-xs text-slate-500">AA standard requires 4.5:1, AAA requires 7.0:1</span>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
              {wcagLevel === 'AAA' ? '7.0 : 1' : '4.5 : 1'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Include Cognitive & Readability Rules</span>
              <span className="text-xs text-slate-500">Flags dense legal text above 8th grade reading level</span>
            </div>
            <input
              type="checkbox"
              checked={includeCognitiveChecks}
              onChange={(e) => setIncludeCognitiveChecks(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save Engine Preferences
          </button>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Preferences saved!
            </span>
          )}
        </div>
      </div>

      {/* 2. AWS Cloud Architecture & Deployment Specs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AWS Production Deployment Target
            </h2>
            <p className="text-xs text-slate-500">
              Cloud architecture blueprint for high-availability enterprise deployment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Compute</span>
            <div className="font-bold text-slate-900">AWS ECS Fargate</div>
            <p className="text-slate-500">Serverless container cluster with autoscaling</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Ready
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Static CDN & Storage</span>
            <div className="font-bold text-slate-900">AWS S3 + CloudFront</div>
            <p className="text-slate-500">Edge distribution for React bundle & audit reports</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Configured
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Telemetry</span>
            <div className="font-bold text-slate-900">AWS CloudWatch</div>
            <p className="text-slate-500">Real-time p95 audit latency & violation alarms</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 3. Database & AI Integrations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Supabase / PostgreSQL & Gemini Status
            </h2>
            <p className="text-xs text-slate-500">
              Database schema tables and multimodal AI model verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">PostgreSQL / Supabase</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Connected
              </span>
            </div>
            <p className="text-slate-500">
              Tables: <code className="text-slate-700 font-mono">users, scans, issues, recommendations, persona_analysis, generated_reports</code>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Google Gemini 3.8 Flash</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                Active SDK
              </span>
            </div>
            <p className="text-slate-500">
              Multimodal Vision Alt-Text, Code Remediation Diffs, and Cognitive Simplifier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
