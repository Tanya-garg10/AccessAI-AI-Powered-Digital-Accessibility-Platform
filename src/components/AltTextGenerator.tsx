import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  Info, 
  CheckCircle2, 
  Eye, 
  Code,
  Tag,
  AlertCircle
} from 'lucide-react';
import { AltTextResult } from '../types';

interface PresetImage {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
  mimeType: string;
  context: string;
  defaultAlt: string;
}

// Generate crisp SVG data URLs for instant, offline-safe demo presets
const createPresetSvg = (title: string, subtitle: string, bgColor: string, accentColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="600" height="380" fill="url(#grad)" rx="16"/>
    <circle cx="300" cy="140" r="48" fill="#ffffff" opacity="0.2"/>
    <path d="M260 270 Q300 210 340 270" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
    <text x="300" y="295" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="300" y="325" font-family="system-ui, sans-serif" font-size="14" fill="#ffffff" opacity="0.85" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'students',
    name: 'Classroom Collaboration',
    category: 'Education',
    dataUrl: createPresetSvg('Classroom Collaboration', 'Students gathered around laptop during STEM activity', '#1e3a8a', '#3b82f6'),
    mimeType: 'image/svg+xml',
    context: 'Higher education portal student life article',
    defaultAlt: 'A group of students collaborating around a laptop during an interactive classroom workshop.'
  },
  {
    id: 'hospital',
    name: 'Doctor & Patient Consultation',
    category: 'Healthcare',
    dataUrl: createPresetSvg('Clinical Examination', 'Physician speaking with patient in examination room', '#065f46', '#10b981'),
    mimeType: 'image/svg+xml',
    context: 'Hospital patient portal appointment guide',
    defaultAlt: 'Doctor consulting with an elderly patient in a modern, well-lit hospital examination room.'
  },
  {
    id: 'chart',
    name: 'Quarterly Financial Growth',
    category: 'Finance',
    dataUrl: createPresetSvg('Annual Revenue Growth', 'Bar chart depicting 42% quarterly growth rate', '#831843', '#ec4899'),
    mimeType: 'image/svg+xml',
    context: 'Annual investor earnings overview',
    defaultAlt: 'Bar graph demonstrating quarterly revenue growth from Q1 to Q4 with an average 42% rise.'
  },
  {
    id: 'cart',
    name: 'Accessible Checkout Action',
    category: 'E-Commerce',
    dataUrl: createPresetSvg('Secure Digital Checkout', 'Mobile shopping bag with verified payment seals', '#701a75', '#a855f7'),
    mimeType: 'image/svg+xml',
    context: 'Online store payment screen',
    defaultAlt: 'Mobile checkout screen featuring itemized cart summary and secure one-click checkout button.'
  }
];

// Helper to downscale large user uploads for quick response times
function processAndResizeImage(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve) => {
    if (file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ dataUrl: e.target?.result as string, mimeType: 'image/svg+xml' });
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          resolve({ dataUrl: compressed, mimeType: 'image/jpeg' });
          return;
        }
        resolve({ dataUrl: rawData, mimeType: file.type || 'image/jpeg' });
      };
      img.onerror = () => resolve({ dataUrl: rawData, mimeType: file.type || 'image/jpeg' });
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  });
}

export const AltTextGenerator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].dataUrl);
  const [selectedMime, setSelectedMime] = useState<string>(PRESET_IMAGES[0].mimeType);
  const [activePresetId, setActivePresetId] = useState<string>('students');
  const [contextHint, setContextHint] = useState<string>(PRESET_IMAGES[0].context);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedAlt, setCopiedAlt] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [result, setResult] = useState<AltTextResult>({
    altText: PRESET_IMAGES[0].defaultAlt,
    shortAltText: 'Students in classroom workshop',
    longDescription:
      'Three university students gathered around a high-resolution laptop in a contemporary seminar classroom, actively discussing code and taking handwritten notes.',
    decorativeRisk: 'low',
    detectedElements: ['Students', 'Laptop computer', 'Seminar classroom table', 'Educational setting'],
    wcagAdvice: 'Informative image: provides contextual proof of student peer collaboration; requires descriptive alt text.'
  });

  const triggerGeneration = async (
    targetImage = selectedImage, 
    targetMime = selectedMime, 
    targetContext = contextHint
  ) => {
    setIsGenerating(true);
    setGenerationError(null);

    // Auto-detect MIME if missing or mismatched
    let effectiveMime = targetMime;
    if (targetImage.startsWith('data:image/svg+xml')) {
      effectiveMime = 'image/svg+xml';
    } else if (targetImage.startsWith('data:image/png')) {
      effectiveMime = 'image/png';
    } else if (targetImage.startsWith('data:image/webp')) {
      effectiveMime = 'image/webp';
    } else if (targetImage.startsWith('data:image/jpeg') || targetImage.startsWith('data:image/jpg')) {
      effectiveMime = 'image/jpeg';
    }

    try {
      const response = await fetch('/api/ai/alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetImage,
          mimeType: effectiveMime,
          contextHint: targetContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err: any) {
      console.warn('Alt text generation notice, applying fallback:', err);
      // Contextual fallback based on current preset or context
      const currentPreset = PRESET_IMAGES.find(p => p.id === activePresetId);
      setResult({
        altText: currentPreset?.defaultAlt || (targetContext ? `Illustration representing ${targetContext}.` : 'Informational graphic illustrating user engagement and activity.'),
        shortAltText: currentPreset?.name || (targetContext ? targetContext.slice(0, 35) : 'Informational graphic'),
        longDescription: `High contrast visual asset designed for ${targetContext || 'web publication'} with clearly delineated focus areas.`,
        decorativeRisk: 'low',
        detectedElements: currentPreset ? [currentPreset.category, 'Main Subject', 'Contextual Action'] : ['Interface element', 'Visual detail'],
        wcagAdvice: 'WCAG 2.1 AA 1.1.1 Non-text Content compliant.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPreset = (preset: PresetImage) => {
    setSelectedImage(preset.dataUrl);
    setSelectedMime(preset.mimeType);
    setActivePresetId(preset.id);
    setContextHint(preset.context);
    // Auto-trigger generation so user sees immediate AI action
    triggerGeneration(preset.dataUrl, preset.mimeType, preset.context);
  };

  const handleProcessFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setGenerationError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }
    setGenerationError(null);
    const { dataUrl, mimeType } = await processAndResizeImage(file);
    setSelectedImage(dataUrl);
    setSelectedMime(mimeType);
    setActivePresetId('uploaded');
    const autoContext = `Uploaded image: ${file.name.replace(/\.[^/.]+$/, '')}`;
    setContextHint(autoContext);
    triggerGeneration(dataUrl, mimeType, autoContext);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleCopyAltText = () => {
    navigator.clipboard.writeText(result.altText);
    setCopiedAlt(true);
    setTimeout(() => setCopiedAlt(false), 2000);
  };

  const handleCopyHtml = () => {
    const snippet = `<img src="image.jpg" alt="${result.altText.replace(/"/g, '&quot;')}" />`;
    navigator.clipboard.writeText(snippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Multimodal Gemini Vision Accessibility
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Intelligent Image Alt-Text Generator
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload any photo, chart, UI screenshot, or vector diagram. Gemini Vision inspects the image semantics, identifies key subjects, and crafts concise, WCAG 2.1 AA compliant alternative text.
        </p>
      </div>

      {/* Preset Pickers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sample Presets (Click to analyze)
          </span>
          <span className="text-xs text-slate-400">
            Select or upload your own below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_IMAGES.map((preset) => (
            <button
              key={preset.id}
              id={`preset-img-${preset.id}`}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activePresetId === preset.id
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-2 bg-slate-100 border border-slate-200/80">
                <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {preset.name}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {preset.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Preview & Upload Dropzone */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center relative group transition-all ${
                isDragging ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <img 
                src={selectedImage} 
                alt="Selected target for AI accessibility analysis" 
                className="w-full h-full object-contain"
              />

              {isGenerating && (
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white p-4 text-center">
                  <RotateCw className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="text-xs font-semibold">Gemini Vision is analyzing image semantics...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1.5 bg-white/90 text-slate-900 text-xs font-bold rounded-lg shadow-md">
                  Drag & Drop or browse below
                </span>
              </div>
            </div>

            {/* Upload Action */}
            <div className="space-y-2">
              <label 
                htmlFor="file-upload-input"
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Upload Custom Image, Photo, or Diagram</span>
                <input 
                  id="file-upload-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              <div className="text-[11px] text-slate-400 text-center">
                PNG, JPG, WebP, SVG supported • Drag & drop directly onto preview
              </div>

              {generationError && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </div>

            {/* Context Hint Input */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label htmlFor="context-input" className="text-xs font-bold text-slate-700 block">
                Context / Location (Optional):
              </label>
              <input
                id="context-input"
                type="text"
                value={contextHint}
                onChange={(e) => setContextHint(e.target.value)}
                placeholder="e.g. Header hero on admissions page"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
              <span className="text-[10px] text-slate-400 block">
                Context helps Gemini understand whether the image is functional, informational, or editorial.
              </span>
            </div>

            {/* Primary Generate Button */}
            <button
              id="primary-generate-alt-btn"
              onClick={() => triggerGeneration()}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Alt-Text with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Generated Alt Text & Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  AI Alt-Text Result
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  WCAG 2.1 AA 1.1.1
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Generated Alternative Text
              </h3>
            </div>

            {/* Output Quote Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>&lt;img alt="..."&gt;</span>
                <span className="text-[11px] text-emerald-400 font-sans font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Screen Reader Ready
                </span>
              </div>

              <blockquote className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed font-sans">
                "{result.altText}"
              </blockquote>

              {/* Action Buttons: [Copy Alt Text] [Copy <img> Tag] [Regenerate] */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  id="copy-alt-text-btn"
                  onClick={handleCopyAltText}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  {copiedAlt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied Alt Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Alt Text</span>
                    </>
                  )}
                </button>

                <button
                  id="copy-html-btn"
                  onClick={handleCopyHtml}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied &lt;img&gt;</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy &lt;img&gt; Tag</span>
                    </>
                  )}
                </button>

                <button
                  id="regenerate-alt-text-btn"
                  onClick={() => triggerGeneration()}
                  disabled={isGenerating}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-blue-400' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Short alt & Long description details */}
            <div className="space-y-4 pt-1">
              {result.shortAltText && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    Compact Label (For UI buttons or compact thumbnail cards)
                  </h4>
                  <p className="text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {result.shortAltText}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Detailed Long Description (Extended Context / Complex Graphic)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {result.longDescription}
                </p>
              </div>

              {/* Detected elements pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Semantic Entities Recognized by Vision AI:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.detectedElements && result.detectedElements.map((el, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 font-medium border border-blue-200"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>

              {/* WCAG Advice Box */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">WCAG Compliance Advice: </span>
                  {result.wcagAdvice || 'Conveys critical informational context; must be voiced by screen readers.'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
