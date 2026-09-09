import { AuditReport, PersonaInfo, RecentScanItem } from '../types';

export const ACCESSIBILITY_PERSONAS: PersonaInfo[] = [
  {
    id: 'visual',
    name: 'Visual Impairment',
    icon: 'Eye',
    subtitle: 'Low vision, color blindness, and screen reader users',
    description:
      'Users who rely on high contrast, screen magnification, text-to-speech screen readers (NVDA, JAWS, VoiceOver), or distinguishable color palettes.',
    primaryBarriers: [
      'Missing alternative text on informative photos and charts',
      'Low color contrast violating WCAG 4.5:1 ratio',
      'Unlabelled interactive buttons and icon controls',
      'Relying solely on color to convey state or error'
    ],
    recommendedFixes: [
      'Generate descriptive image alt text matching contextual role',
      'Boost text contrast to AA (4.5:1) or AAA (7:1) ratios',
      'Add aria-label attributes to icon-only buttons',
      'Provide secondary visual indicators (icons + underline) alongside color'
    ],
    priority: 'CRITICAL'
  },
  {
    id: 'cognitive',
    name: 'Cognitive Difficulty',
    icon: 'Brain',
    subtitle: 'ADHD, dyslexia, memory, and executive function',
    description:
      'Users who experience cognitive strain from cluttered layouts, convoluted bureaucratic language, erratic font changes, or dense walls of text.',
    primaryBarriers: [
      'High reading grade levels with bureaucratic jargon',
      'Cluttered visual hierarchy without clear headings',
      'Distracting auto-playing elements without pause controls',
      'Overly complex multi-step forms without progress breadcrumbs'
    ],
    recommendedFixes: [
      'Simplify complex legal and insurance text into plain language',
      'Enforce linear, predictable H1 -> H2 -> H3 heading hierarchy',
      'Add generous line-spacing and readable typography',
      'Provide concise executive summaries and bullet points'
    ],
    priority: 'HIGH'
  },
  {
    id: 'motor',
    name: 'Motor Disability',
    icon: 'Hand',
    subtitle: 'Keyboard-only, switch navigation, tremors & arthritis',
    description:
      'Users who cannot use a standard mouse and instead navigate via tab key, single-switch devices, head wands, or voice navigation software.',
    primaryBarriers: [
      'Keyboard focus traps or invisible focus rings',
      'Non-semantic clickable divs without keydown listeners',
      'Touch targets smaller than 44x44 CSS pixels',
      'Timed forms that expire without extension prompt'
    ],
    recommendedFixes: [
      'Provide high-visibility 2px solid focus rings on all interactives',
      'Replace clickable divs with semantic <button> elements',
      'Enforce minimum 44px touch targets with ample hit-area padding',
      'Include skip-to-content links at the top of the DOM'
    ],
    priority: 'HIGH'
  },
  {
    id: 'hearing',
    name: 'Hearing Impairment',
    icon: 'Volume2',
    subtitle: 'Deaf or hard of hearing individuals',
    description:
      'Users who require closed captions, synchronized subtitles, or text transcripts for all auditory notifications and media streams.',
    primaryBarriers: [
      'Videos or audio clips lacking synchronized closed captions',
      'Important form alerts delivered exclusively through audio chimes',
      'Customer support limited solely to voice phone calls',
      'Podcasts or interviews without readable transcripts'
    ],
    recommendedFixes: [
      'Embed synchronized WebVTT captions in HTML5 <video> elements',
      'Pair all audio notification sounds with visual banner alerts',
      'Provide downloadable verbatim text transcripts for audio content',
      'Ensure live chat/text alternative for all voice contact options'
    ],
    priority: 'MEDIUM'
  }
];

export const INITIAL_RECENT_SCANS: RecentScanItem[] = [
  {
    id: 'scan-1',
    url: 'https://healthcare-portal-demo.org',
    pageTitle: 'CityCare Regional Hospital & Patient Portal',
    score: 74,
    issuesCount: 7,
    criticalCount: 2,
    date: '10 mins ago',
    status: 'Action Needed'
  },
  {
    id: 'scan-2',
    url: 'https://gov-benefits-application.gov',
    pageTitle: 'State Social Assistance & Housing Support Portal',
    score: 58,
    issuesCount: 8,
    criticalCount: 4,
    date: '2 hours ago',
    status: 'Critical Risk'
  },
  {
    id: 'scan-3',
    url: 'https://apex-banking-portal.io',
    pageTitle: 'Apex Global Online Banking & Transfer Suite',
    score: 82,
    issuesCount: 4,
    criticalCount: 1,
    date: 'Yesterday',
    status: 'Action Needed'
  },
  {
    id: 'scan-4',
    url: 'https://accessible-university-catalog.edu',
    pageTitle: 'State University Academic Course Directory',
    score: 93,
    issuesCount: 2,
    criticalCount: 0,
    date: '2 days ago',
    status: 'Compliant'
  }
];

export const DEMO_PRESET_SITES: { [key: string]: AuditReport } = {
  'https://healthcare-portal-demo.org': {
    id: 'scan-preset-healthcare',
    url: 'https://healthcare-portal-demo.org',
    pageTitle: 'CityCare Regional Hospital & Patient Portal',
    scannedAt: 'Just now',
    score: {
      overall: 74,
      visual: 68,
      screenReader: 71,
      keyboard: 75,
      readability: 76,
      forms: 72,
      navigation: 82
    },
    summary: {
      totalIssues: 7,
      criticalCount: 2,
      seriousCount: 3,
      moderateCount: 2,
      minorCount: 0,
      fixedCount: 0
    },
    passedChecksCount: 42,
    issues: [
      {
        id: 'iss-1',
        ruleId: 'image-alt',
        wcagCriterion: 'WCAG 2.1 AA 1.1.1 Non-text Content',
        category: 'screen_reader',
        severity: 'critical',
        title: 'Image missing alternative text',
        description: 'Informative hospital photo lacks an alt attribute, rendering it invisible to screen readers.',
        whyItMatters: 'Screen-reader users cannot understand the purpose or medical context conveyed by the image.',
        elementHtml: '<img src="hospital-doctor.jpg" class="rounded-lg shadow">',
        selector: 'main > section.hero > img',
        aiFixSuggestion: 'Add descriptive alternative text describing the doctor and patient consultation setting.',
        aiFixedHtml: '<img src="hospital-doctor.jpg" class="rounded-lg shadow" alt="Doctor consulting with an elderly patient in a modern hospital examination room">',
        affectedPersonas: ['visual', 'cognitive']
      },
      {
        id: 'iss-2',
        ruleId: 'color-contrast',
        wcagCriterion: 'WCAG 2.1 AA 1.4.3 Contrast (Minimum)',
        category: 'visual',
        severity: 'serious',
        title: 'Low contrast on appointment booking button',
        description: 'Text color #8FA6C1 on background #FFFFFF produces a 2.4:1 contrast ratio (WCAG AA requires 4.5:1).',
        whyItMatters: 'Users with low vision or viewing in bright sunlight will struggle to identify and read this key action button.',
        elementHtml: '<button class="bg-slate-100 text-slate-400 py-2 px-4 rounded">Book Appointment</button>',
        selector: 'nav.header-nav > button.cta-booking',
        aiFixSuggestion: 'Darken text color or use high-contrast primary fill with #FFFFFF text to achieve 7.2:1 contrast.',
        aiFixedHtml: '<button class="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700">Book Appointment</button>',
        affectedPersonas: ['visual', 'cognitive']
      },
      {
        id: 'iss-3',
        ruleId: 'button-name',
        wcagCriterion: 'WCAG 2.1 AA 4.1.2 Name, Role, Value',
        category: 'screen_reader',
        severity: 'critical',
        title: 'Empty icon button without accessible name',
        description: 'Search trigger button contains only an SVG icon with no inner text, title, or aria-label.',
        whyItMatters: 'Screen reader announces "button" with no purpose. Users cannot tell what clicking this button will trigger.',
        elementHtml: '<button class="p-2 search-btn"><svg class="w-5 h-5">...</svg></button>',
        selector: 'header .search-container button',
        aiFixSuggestion: 'Provide an aria-label="Search medical records and doctors" attribute.',
        aiFixedHtml: '<button class="p-2 search-btn" aria-label="Search medical records and doctors"><svg class="w-5 h-5" aria-hidden="true">...</svg></button>',
        affectedPersonas: ['visual', 'motor']
      },
      {
        id: 'iss-4',
        ruleId: 'label',
        wcagCriterion: 'WCAG 2.1 AA 1.3.1 Info and Relationships / 3.3.2 Labels',
        category: 'forms',
        severity: 'serious',
        title: 'Form input missing associated label',
        description: 'Patient ID input lacks an explicit <label for="..."> or aria-labelledby relationship.',
        whyItMatters: 'Blind and visually impaired users navigating via Tab do not know what information to enter into this field.',
        elementHtml: '<input type="text" id="patient-id" placeholder="Enter Patient MRN">',
        selector: 'form#login-form input#patient-id',
        aiFixSuggestion: 'Link an explicit <label for="patient-id">Medical Record Number (MRN)</label>.',
        aiFixedHtml: '<label for="patient-id" class="block text-sm font-semibold mb-1 text-slate-800">Medical Record Number (MRN)</label>\n<input type="text" id="patient-id" placeholder="e.g. MRN-90214" class="border rounded p-2 w-full" aria-required="true">',
        affectedPersonas: ['visual', 'cognitive']
      },
      {
        id: 'iss-5',
        ruleId: 'heading-order',
        wcagCriterion: 'WCAG 2.1 AA 2.4.6 Headings and Labels / 1.3.1',
        category: 'navigation',
        severity: 'moderate',
        title: 'Disordered heading levels (H1 to H4 skipped)',
        description: 'Document structure jumps from an H1 directly into an H4 without intermediate H2 or H3 tags.',
        whyItMatters: 'Screen reader users scan pages using heading navigation keys; skipping levels creates confusion regarding document sections.',
        elementHtml: '<h1>Department Specialties</h1>\n<h4>Cardiology & Heart Care</h4>',
        selector: 'section.specialties > h4',
        aiFixSuggestion: 'Correct heading sequence to H2 for primary department specialties.',
        aiFixedHtml: '<h1>Department Specialties</h1>\n<h2>Cardiology & Heart Care</h2>',
        affectedPersonas: ['visual', 'cognitive', 'motor']
      },
      {
        id: 'iss-6',
        ruleId: 'landmark-one-main',
        wcagCriterion: 'WCAG 2.1 AA 1.3.1 Info and Relationships',
        category: 'keyboard',
        severity: 'moderate',
        title: 'Missing semantic <main> landmark',
        description: 'Page wraps central body content in generic <div> elements rather than a semantic <main> region.',
        whyItMatters: 'Keyboard-only and screen reader users cannot quickly jump past navigation menus to core page content.',
        elementHtml: '<div class="content-wrapper">...</div>',
        selector: 'body > div.content-wrapper',
        aiFixSuggestion: 'Replace generic container with <main id="main-content" role="main">.',
        aiFixedHtml: '<main id="main-content" class="content-wrapper" role="main">...</main>',
        affectedPersonas: ['visual', 'motor']
      },
      {
        id: 'iss-7',
        ruleId: 'complex-text',
        wcagCriterion: 'WCAG 2.1 AAA 3.1.5 Reading Level',
        category: 'readability',
        severity: 'serious',
        title: 'High cognitive complexity in insurance disclaimer',
        description: 'Flesch-Kincaid grade level is 16.4 (Post-Graduate). Dense legal jargon impedes patient comprehension.',
        whyItMatters: 'Patients under acute stress or individuals with cognitive/learning differences will not understand their financial liability.',
        elementHtml: '<p class="policy">The subscriber indemnification protocol stipulates that elective sub-specialty clinical consultations remain contingent upon pre-adjudication authorization...</p>',
        selector: 'section.policy-notice p.policy',
        aiFixSuggestion: 'Simplify into plain English with a 6th-grade reading level.',
        aiFixedHtml: '<p class="policy">Specialist visits require prior approval from your insurance provider before your appointment.</p>',
        affectedPersonas: ['cognitive', 'visual']
      }
    ]
  },
  'https://gov-benefits-application.gov': {
    id: 'scan-preset-gov',
    url: 'https://gov-benefits-application.gov',
    pageTitle: 'State Social Assistance & Housing Support Portal',
    scannedAt: '5 minutes ago',
    score: {
      overall: 58,
      visual: 52,
      screenReader: 48,
      keyboard: 55,
      readability: 67,
      forms: 50,
      navigation: 65
    },
    summary: {
      totalIssues: 8,
      criticalCount: 4,
      seriousCount: 2,
      moderateCount: 2,
      minorCount: 0,
      fixedCount: 0
    },
    passedChecksCount: 31,
    issues: [
      {
        id: 'gov-1',
        ruleId: 'image-alt',
        wcagCriterion: 'WCAG 2.1 AA 1.1.1 Non-text Content',
        category: 'screen_reader',
        severity: 'critical',
        title: 'Eligibility flowchart missing text alternative',
        description: 'A 6-step complex graphic contains critical eligibility requirements with no text counterpart.',
        whyItMatters: 'Low-vision and blind applicants cannot determine whether they qualify for monthly emergency assistance.',
        elementHtml: '<img src="/assets/eligibility-flowchart.png">',
        selector: 'div.eligibility-info img',
        aiFixSuggestion: 'Provide a complete text equivalent summary or aria-describedby pointing to accessible list.',
        aiFixedHtml: '<figure>\n  <img src="/assets/eligibility-flowchart.png" alt="6-step eligibility flowchart for state housing assistance">\n  <figcaption class="sr-only">Step 1: Verify residency. Step 2: Income under 200% FPL. Step 3: Gather W-2s. Step 4: Submit online application. Step 5: Caseworker interview. Step 6: Approval notice.</figcaption>\n</figure>',
        affectedPersonas: ['visual', 'cognitive']
      },
      {
        id: 'gov-2',
        ruleId: 'label',
        wcagCriterion: 'WCAG 2.1 AA 3.3.2 Labels or Instructions',
        category: 'forms',
        severity: 'critical',
        title: 'Social Security Number input unlabelled',
        description: 'Input for confidential SSN is missing an associated accessible label.',
        whyItMatters: 'Assistive tech users cannot identify what personal data is being requested in this field.',
        elementHtml: '<input type="password" name="ssn" maxlength="9">',
        selector: 'fieldset.identification input[name="ssn"]',
        aiFixSuggestion: 'Add explicit label and autocomplete attribute.',
        aiFixedHtml: '<label for="applicant-ssn" class="font-medium text-gray-900 block mb-1">Social Security Number (9 digits)</label>\n<input type="password" id="applicant-ssn" name="ssn" maxlength="9" autocomplete="off" aria-describedby="ssn-help" class="border p-2 rounded">\n<span id="ssn-help" class="text-xs text-gray-600 block mt-1">Format: 9 digits with no hyphens</span>',
        affectedPersonas: ['visual', 'motor']
      },
      {
        id: 'gov-3',
        ruleId: 'tabindex',
        wcagCriterion: 'WCAG 2.1 AA 2.4.3 Focus Order',
        category: 'keyboard',
        severity: 'serious',
        title: 'Positive tabindex disrupts natural focus order',
        description: 'Form uses tabindex="5" which disrupts logical top-to-bottom keyboard navigation.',
        whyItMatters: 'Keyboard-only navigators will unexpectedly jump erratically across form inputs.',
        elementHtml: '<input type="submit" tabindex="5" value="Continue">',
        selector: 'input[type="submit"]',
        aiFixSuggestion: 'Remove positive tabindex to restore natural DOM focus flow.',
        aiFixedHtml: '<input type="submit" value="Continue" class="btn btn-primary">',
        affectedPersonas: ['motor', 'visual']
      }
    ]
  },
  'https://apex-banking-portal.io': {
    id: 'scan-preset-banking',
    url: 'https://apex-banking-portal.io',
    pageTitle: 'Apex Global Online Banking & Transfer Suite',
    scannedAt: '1 hour ago',
    score: {
      overall: 82,
      visual: 78,
      screenReader: 84,
      keyboard: 85,
      readability: 80,
      forms: 82,
      navigation: 86
    },
    summary: {
      totalIssues: 4,
      criticalCount: 1,
      seriousCount: 2,
      moderateCount: 1,
      minorCount: 0,
      fixedCount: 0
    },
    passedChecksCount: 56,
    issues: [
      {
        id: 'bank-1',
        ruleId: 'button-name',
        wcagCriterion: 'WCAG 2.1 AA 4.1.2 Name, Role, Value',
        category: 'screen_reader',
        severity: 'critical',
        title: 'Transfer funds submit button lacks accessible name',
        description: 'Wire transfer action button has only an SVG arrow without aria-label or accessible text.',
        whyItMatters: 'Users could inadvertently initiate a high-value funds transfer without knowing the button function.',
        elementHtml: '<button class="send-money-btn"><svg>...</svg></button>',
        selector: 'form#transfer-form button.send-money-btn',
        aiFixSuggestion: 'Add aria-label="Confirm and execute domestic wire transfer".',
        aiFixedHtml: '<button class="send-money-btn" aria-label="Confirm and execute domestic wire transfer"><svg aria-hidden="true">...</svg> Send Wire</button>',
        affectedPersonas: ['visual', 'cognitive']
      },
      {
        id: 'bank-2',
        ruleId: 'color-contrast',
        wcagCriterion: 'WCAG 2.1 AA 1.4.3 Contrast (Minimum)',
        category: 'visual',
        severity: 'serious',
        title: 'Account balance disclaimer has low contrast',
        description: 'Text #94A3B8 on white background achieves only 2.6:1 contrast ratio.',
        whyItMatters: 'Low-vision users cannot read pending hold notifications and overdraft fee disclaimers.',
        elementHtml: '<span class="text-slate-400 text-xs">Funds held until next business day</span>',
        selector: 'div.balance-card span',
        aiFixSuggestion: 'Increase font weight and darken to #334155 to guarantee 5.8:1 contrast.',
        aiFixedHtml: '<span class="text-slate-700 font-medium text-xs">Funds held until next business day</span>',
        affectedPersonas: ['visual', 'cognitive']
      }
    ]
  }
};
