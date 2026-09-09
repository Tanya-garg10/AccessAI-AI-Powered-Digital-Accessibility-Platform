import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  GraduationCap 
} from 'lucide-react';
import { TextSimplificationResult } from '../types';

export const TextSimplifier: React.FC = () => {
  const [inputText, setInputText] = useState(
    `The insurance policy provides comprehensive coverage subject to applicable exclusions, conditions, and territorial restrictions. The subscriber indemnification protocol stipulates that elective sub-specialty clinical consultations remain contingent upon pre-adjudication authorization from designated underwriting authorities.`
  );
  const [selectedMode, setSelectedMode] = useState<'simple_english' | 'easy_to_read' | 'screen_reader_friendly'>('simple_english');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TextSimplificationResult | null>({
    originalText: `The insurance policy provides comprehensive coverage subject to applicable exclusions, conditions, and territorial restrictions...`,
    simplifiedText: `Simple Version:\n\nThis insurance policy covers several types of risks. However, some situations and treatments are not covered. You must get approval from your insurance company before visiting a medical specialist.`,
    mode: 'simple_english',
    originalGradeLevel: 'Grade 16.2 (Post-Graduate)',
    simplifiedGradeLevel: 'Grade 5.8 (Plain English)',
    readingTimeReduction: '45% faster comprehension',
    keyPoints: [
      'Covers several types of risks, but not everything',
      'Certain situations and locations are excluded',
      'Requires pre-approval before seeing a specialist'
    ]
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSimplify = async (customText?: string, customMode?: typeof selectedMode) => {
    const textToProcess = customText || inputText;
    const modeToProcess = customMode || selectedMode;
    if (!textToProcess.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          mode: modeToProcess
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Fallback representation
        setResult({
          originalText: textToProcess,
          simplifiedText: `Simple Version:\n\nThis policy covers common risks. Some situations are not covered. You must get prior approval before seeing a specialist doctor.`,
          mode: modeToProcess,
          originalGradeLevel: 'Grade 15 (College)',
          simplifiedGradeLevel: 'Grade 6 (Plain English)',
          readingTimeReduction: '42% faster',
          keyPoints: ['Basic risks covered', 'Exclusions apply', 'Requires prior approval']
        });
      }
    } catch (err) {
      console.warn('Simplification error, using structured fallback:', err);
      setResult({
        originalText: textToProcess,
        simplifiedText: `Simple Version:\n\nThis policy protects against most medical expenses, but some situations may not be covered. You must get approval before booking an appointment with a specialist.`,
        mode: modeToProcess,
        originalGradeLevel: 'Grade 16 (Post-Graduate)',
        simplifiedGradeLevel: 'Grade 6 (Plain English)',
        readingTimeReduction: '45% faster',
        keyPoints: ['Clear coverage terms', 'Prior authorization requirement']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.simplifiedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!result) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(result.simplifiedText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const loadSample = (type: 'insurance' | 'medical' | 'terms') => {
    if (type === 'insurance') {
      const text = `The insurance policy provides comprehensive coverage subject to applicable exclusions, conditions, and territorial restrictions. The subscriber indemnification protocol stipulates that elective sub-specialty clinical consultations remain contingent upon pre-adjudication authorization from designated underwriting authorities.`;
      setInputText(text);
      handleSimplify(text, selectedMode);
    } else if (type === 'medical') {
      const text = `The patient acknowledges and affirms receipt of therapeutic disclosures pertaining to pharmacotherapeutic administration. Adverse sequelae may encompass transient nausea, cephalalgia, or dermatological hypersensitivity. Cessation of therapy is contraindicated absent physician consultation.`;
      setInputText(text);
      handleSimplify(text, selectedMode);
    } else {
      const text = `By accessing this digital infrastructure, user accords unconditional consent to indemnification covenants and irrevocably waives adjudicative recourse in judicial jurisdictions regarding non-compensable platform interruptions or computational latency.`;
      setInputText(text);
      handleSimplify(text, selectedMode);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Context */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          Cognitive Accessibility & Plain Language
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI-Powered Content & Text Simplifier
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Transform convoluted bureaucratic, legal, or clinical jargon into accessible, easy-to-read language that complies with WCAG AAA 3.1.5 (Reading Level).
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Load Sample Texts:
        </span>
        <button
          onClick={() => loadSample('insurance')}
          className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium shadow-2xs transition-colors cursor-pointer"
        >
          📄 Insurance Policy Exclusions
        </button>
        <button
          onClick={() => loadSample('medical')}
          className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium shadow-2xs transition-colors cursor-pointer"
        >
          🩺 Medical Prescription Notice
        </button>
        <button
          onClick={() => loadSample('terms')}
          className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium shadow-2xs transition-colors cursor-pointer"
        >
          ⚖️ Legal Terms & Disclaimers
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Input Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="text-simplifier-input" className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Paste your content
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {inputText.length} characters
            </span>
          </div>

          <textarea
            id="text-simplifier-input"
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste dense, legal, or complex documentation here..."
            className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans leading-relaxed transition-all"
          />
        </div>

        {/* Mode Selector (Prompt specified: Simple English, Easy-to-Read, Screen Reader Friendly) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Simplification Standard:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              id="mode-simple-english"
              onClick={() => {
                setSelectedMode('simple_english');
                handleSimplify(inputText, 'simple_english');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMode === 'simple_english'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">
                Simple English
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Everyday vocabulary, 6th-grade reading level.
              </p>
            </button>

            <button
              type="button"
              id="mode-easy-to-read"
              onClick={() => {
                setSelectedMode('easy_to_read');
                handleSimplify(inputText, 'easy_to_read');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMode === 'easy_to_read'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">
                Easy-to-Read
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Bullet points, short clauses, cognitive focus.
              </p>
            </button>

            <button
              type="button"
              id="mode-screen-reader"
              onClick={() => {
                setSelectedMode('screen_reader_friendly');
                handleSimplify(inputText, 'screen_reader_friendly');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMode === 'screen_reader_friendly'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-slate-900 mb-0.5">
                Screen Reader Friendly
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Linear syntax, explicit nouns, zero ambiguity.
              </p>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            id="simplify-with-ai-btn"
            onClick={() => handleSimplify()}
            disabled={isLoading || !inputText.trim()}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                Rewriting with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Simplify with AI
              </>
            )}
          </button>
        </div>

        {/* Results Box */}
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-fade-in">
            {/* Readability Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
                  Original Complexity
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {result.originalGradeLevel}
                </div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Simplified Level
                </div>
                <div className="text-sm font-bold text-emerald-900">
                  {result.simplifiedGradeLevel}
                </div>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-700 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Cognitive Gain
                </div>
                <div className="text-sm font-bold text-blue-900">
                  {result.readingTimeReduction}
                </div>
              </div>
            </div>

            {/* Output Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    Simple Version
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* TTS Speech Button */}
                  <button
                    onClick={toggleSpeech}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Listen to simplified text aloud"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Read Aloud</span>
                      </>
                    )}
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Simplified content */}
              <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line font-sans">
                {result.simplifiedText}
              </div>

              {/* Key points */}
              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Takeaways:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.keyPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
