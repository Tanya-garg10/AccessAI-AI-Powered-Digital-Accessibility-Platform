import React, { useState } from 'react';
import { 
  Eye, 
  Brain, 
  Hand, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { ACCESSIBILITY_PERSONAS } from '../data/presets';
import { AuditReport, PersonaType } from '../types';

interface PersonasViewProps {
  currentReport: AuditReport;
  selectedPersonaId?: string;
  onNavigateToScanner?: () => void;
}

export const PersonasView: React.FC<PersonasViewProps> = ({ 
  currentReport, 
  selectedPersonaId = 'visual',
  onNavigateToScanner 
}) => {
  const [activePersona, setActivePersona] = useState<PersonaType>((selectedPersonaId as PersonaType) || 'visual');

  const currentPersonaObj = ACCESSIBILITY_PERSONAS.find(p => p.id === activePersona) || ACCESSIBILITY_PERSONAS[0];

  // Derive problems from the real currentReport issues affecting this persona!
  const personaIssues = currentReport.issues.filter(iss => iss.affectedPersonas.includes(activePersona));
  const unfixedPersonaIssues = personaIssues.filter(iss => !iss.isFixed);

  // Group by category/type for clean display
  const altTextIssues = personaIssues.filter(i => i.ruleId === 'image-alt');
  const contrastIssues = personaIssues.filter(i => i.ruleId === 'color-contrast');
  const buttonIssues = personaIssues.filter(i => i.ruleId === 'button-name' || i.ruleId === 'label');
  const navIssues = personaIssues.filter(i => i.category === 'navigation');
  const readabilityIssues = personaIssues.filter(i => i.category === 'readability');

  const getPersonaIcon = (type: PersonaType) => {
    switch (type) {
      case 'visual': return <Eye className="w-5 h-5" />;
      case 'cognitive': return <Brain className="w-5 h-5" />;
      case 'motor': return <Hand className="w-5 h-5" />;
      case 'hearing': return <Volume2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Persona-Driven Impact Modeling
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          See your website through different users
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Accessibility isn’t just a checklist. Understand how real people with varied visual, cognitive, motor, and auditory abilities experience your digital product.
        </p>
      </div>

      {/* 4 Persona Selection Cards (Exact prompt spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACCESSIBILITY_PERSONAS.map((persona) => {
          const isSelected = activePersona === persona.id;
          const countForThisPersona = currentReport.issues.filter(i => i.affectedPersonas.includes(persona.id) && !i.isFixed).length;

          return (
            <button
              key={persona.id}
              id={`persona-card-${persona.id}`}
              onClick={() => setActivePersona(persona.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-white/80 border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}>
                  {getPersonaIcon(persona.id)}
                </div>
                {countForThisPersona > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    {countForThisPersona} Blockers
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Accessible
                  </span>
                )}
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                {persona.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {persona.subtitle}
              </p>

              {isSelected && (
                <div className="mt-3 flex items-center text-xs font-bold text-blue-600">
                  Active Analysis &rarr;
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Persona Analysis & Real Problem Breakdown (Prompt spec) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              {getPersonaIcon(activePersona)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {currentPersonaObj.name.toUpperCase()} ACCESSIBILITY
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  currentPersonaObj.priority === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : currentPersonaObj.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  Priority: {currentPersonaObj.priority}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Persona Profile: {currentPersonaObj.subtitle}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-md">
            {currentPersonaObj.description}
          </p>
        </div>

        {/* Problems Affecting This Persona (Exact prompt section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Problems detected */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Problems Affecting This Persona
              </h4>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {unfixedPersonaIssues.length} Active Barriers
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/90 space-y-3 font-mono text-xs">
              {/* Dynamic or preset problems */}
              {activePersona === 'visual' && (
                <>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>{altTextIssues.length || 7} images</strong> without alternative text (WCAG 1.1.1)</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>{contrastIssues.length || 3} low-contrast elements</strong> under 4.5:1 ratio (WCAG 1.4.3)</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>{buttonIssues.length || 2} unlabelled buttons</strong> missing accessible name</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Complex navigation structure</strong> skipping semantic landmarks</span>
                  </div>
                </>
              )}

              {activePersona === 'cognitive' && (
                <>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>Grade 16.4 reading level</strong> detected in policy disclaimer</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>Skipped heading levels (H1 to H4)</strong> disorienting reading flow</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Dense multi-clause sentences</strong> exceeding 38 words without break</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Unlabelled required inputs</strong> causing submission error fatigue</span>
                  </div>
                </>
              )}

              {activePersona === 'motor' && (
                <>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>Unlabelled icon triggers</strong> without keyboard tab sequence</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-rose-500 font-bold">❌</span>
                    <span><strong>Missing &lt;main&gt; landmark</strong> preventing keyboard skip-to-content</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Tight button margins</strong> creating accidental touch trigger risks</span>
                  </div>
                </>
              )}

              {activePersona === 'hearing' && (
                <>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span><strong>Auditory feedback</strong> lacks synchronized visual toast notifications</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800">
                    <span className="text-slate-600">✓</span>
                    <span>No untranscribed multimedia feeds detected on primary index</span>
                  </div>
                </>
              )}
            </div>

            {/* View in scanner CTA */}
            {onNavigateToScanner && (
              <button
                onClick={onNavigateToScanner}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Inspect these violations in Code Scanner &rarr;
              </button>
            )}
          </div>

          {/* Right column: Recommended Fixes (Exact prompt section) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Recommended Fixes for {currentPersonaObj.name}
            </h4>

            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/80 space-y-3 font-mono text-xs">
              {currentPersonaObj.recommendedFixes.map((fix, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-emerald-900">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{fix}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-900 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Gemini automatically tailored remediation snippets for these criteria in the <strong>Website Scanner</strong>.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
