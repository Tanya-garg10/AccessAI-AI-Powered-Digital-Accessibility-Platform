export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export type Category = 
  | 'visual' 
  | 'screen_reader' 
  | 'keyboard' 
  | 'readability' 
  | 'forms' 
  | 'navigation';

export type PersonaType = 'visual' | 'cognitive' | 'motor' | 'hearing';

export interface AuditIssue {
  id: string;
  ruleId: string;
  wcagCriterion: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  whyItMatters: string;
  elementHtml: string;
  selector: string;
  aiFixSuggestion: string;
  aiFixedHtml: string;
  affectedPersonas: PersonaType[];
  isFixed?: boolean;
  aiExplanation?: string;
  resolvedAt?: string;
}

export interface ScoreBreakdown {
  overall: number;
  visual: number;
  screenReader: number;
  keyboard: number;
  readability: number;
  forms: number;
  navigation?: number;
}

export interface AuditReport {
  id?: string;
  url: string;
  scannedAt: string;
  pageTitle: string;
  score: ScoreBreakdown;
  issues: AuditIssue[];
  summary: {
    totalIssues: number;
    criticalCount: number;
    seriousCount: number;
    moderateCount: number;
    minorCount: number;
    fixedCount: number;
  };
  passedChecksCount: number;
}

export interface RecentScanItem {
  id: string;
  url: string;
  pageTitle: string;
  score: number;
  issuesCount: number;
  criticalCount: number;
  date: string;
  status: 'Compliant' | 'Action Needed' | 'Critical Risk';
}

export interface PersonaInfo {
  id: PersonaType;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  primaryBarriers: string[];
  recommendedFixes: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface TextSimplificationResult {
  originalText: string;
  simplifiedText: string;
  mode: 'simple_english' | 'easy_to_read' | 'screen_reader_friendly' | 'short_summary';
  originalGradeLevel: string;
  simplifiedGradeLevel: string;
  readingTimeReduction: string;
  keyPoints: string[];
}

export interface AltTextResult {
  altText: string;
  shortAltText?: string;
  longDescription: string;
  decorativeRisk: 'low' | 'medium' | 'high';
  detectedElements: string[];
  wcagAdvice: string;
}
