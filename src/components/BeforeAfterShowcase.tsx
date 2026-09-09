import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  Play, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export const BeforeAfterShowcase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'side_by_side' | 'remediation_simulation'>('side_by_side');
  const [simState, setSimState] = useState<'before' | 'fixing' | 'after'>('after');
  const [activeTab, setActiveTab] = useState<'summary' | 'code_diffs'>('summary');

  const runSimulation = async () => {
    setSimState('before');
    await new Promise(r => setTimeout(r, 600));
    setSimState('fixing');
    await new Promise(r => setTimeout(r, 1200));
    setSimState('after');
  };

  const currentScore = simState === 'before' ? 54 : simState === 'fixing' ? 72 : 91;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          Measurable Accessibility ROI for Judges
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Before vs After Remediation Benchmark
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          See the tangible, measurable transformation when AccessAI's rule engine and Gemini AI automated fixes are applied to a digital product.
        </p>
      </div>

      {/* Interactive Score Jump Card (Prompt: Before 54/100 -> After 91/100) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Score Comparison */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Automated Remediation Leap
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Accessibility Score Transformation
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Moving from high legal liability and user exclusion to full WCAG 2.1 AA compliance in a single automated pass.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <button
                id="run-remediation-simulation-btn"
                onClick={runSimulation}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Re-run Fix Simulation
              </button>
            </div>
          </div>

          {/* Right: The animated score comparison visualization */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            {/* Before Score */}
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Before
              </span>
              <div className="text-4xl sm:text-5xl font-black text-rose-400 tracking-tight">
                54
              </div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                / 100 • Critical
              </span>
            </div>

            {/* Transition Arrow */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 animate-pulse">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                +37 Pts
              </span>
            </div>

            {/* After Score */}
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                After
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                {currentScore}
              </div>
              <span className="text-[10px] font-bold text-emerald-300 block uppercase">
                / 100 • Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Breakdown (Exact prompt requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BEFORE CARD */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Before AccessAI
                </h4>
                <p className="text-[11px] text-rose-600 font-semibold">
                  Accessibility Score: 54 / 100 (Non-Compliant)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              High Liability
            </span>
          </div>

          {/* Exact 4 points from user prompt */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-2.5">
              <span className="text-rose-600 font-bold text-sm">❌</span>
              <div>
                <span className="font-bold text-rose-900">Missing alt text:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Screen readers announce "image_048.jpg" with zero visual meaning.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-2.5">
              <span className="text-rose-600 font-bold text-sm">❌</span>
              <div>
                <span className="font-bold text-rose-900">Poor contrast:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Light gray text #8FA6C1 on white yields 2.4:1 ratio (fails 4.5:1).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-2.5">
              <span className="text-rose-600 font-bold text-sm">❌</span>
              <div>
                <span className="font-bold text-rose-900">Complex paragraph:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Post-graduate Grade 16 legalistic jargon creates cognitive block.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-2.5">
              <span className="text-rose-600 font-bold text-sm">❌</span>
              <div>
                <span className="font-bold text-rose-900">Unlabelled form:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  SSN & appointment inputs lack accessible names and labels.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  After AccessAI
                </h4>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  Accessibility Score: 91 / 100 (WCAG 2.1 AA Compliant)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Fully Inclusive
            </span>
          </div>

          {/* Exact 4 points from user prompt */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <div>
                <span className="font-bold text-emerald-900">AI-generated alt text:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  "Doctor consulting with a patient in hospital examination room."
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <div>
                <span className="font-bold text-emerald-900">Improved contrast:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Upgraded to compliant high-contrast 7.2:1 palette with clear states.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <div>
                <span className="font-bold text-emerald-900">Simplified content:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Rewritten at Grade 6 plain language with bulleted key actions.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold text-sm">✓</span>
              <div>
                <span className="font-bold text-emerald-900">Accessible labels:</span>
                <p className="text-slate-600 font-sans text-xs mt-0.5">
                  Semantic &lt;label for="..."&gt; & aria-required tags linked.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Code Level Diff Inspection Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Exact Code Remediation Inspection
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Original Inaccessible Code
            </span>
            <pre className="p-3 rounded-xl bg-slate-900 text-rose-300 text-xs font-mono overflow-x-auto border border-rose-950">
              <code>{`<img src="hospital.jpg">\n<button class="text-slate-400">Book</button>\n<input type="text" name="ssn">`}</code>
            </pre>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              AccessAI Gemini-Patched Accessible Code
            </span>
            <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto border border-emerald-950">
              <code>{`<img src="hospital.jpg" alt="Doctor consulting with a patient in a hospital examination room">\n<button class="text-white bg-blue-600 font-medium">Book</button>\n<label for="ssn">SSN</label><input id="ssn" name="ssn" autocomplete="off">`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
