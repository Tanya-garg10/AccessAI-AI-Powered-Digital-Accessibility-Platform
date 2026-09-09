# AccessAI — AI-Powered Digital Accessibility Platform

> **"Make every digital experience accessible by default."**

Mission: **Accessible Technology for All**

AccessAI is a production-grade digital accessibility auditing and remediation platform. It combines automated rule-based DOM evaluation (axe-core standards) with multimodal AI (Google Gemini) to detect accessibility barriers, explain their human impact, generate actionable code fixes, and personalize recommendations across distinct accessibility personas.

---

## 1. Problem Statement
Over 1.3 billion people worldwide live with significant disabilities. Yet, according to WebAIM Million audits, more than 96% of top web pages contain preventable WCAG failures—from missing image alt text and unlabelled buttons to low contrast and disorientation for keyboard-only navigators. Current developer tools either dump raw, cryptic error logs or offer superficial overlay scripts that fail actual compliance.

## 2. Solution Overview
AccessAI provides an end-to-end intelligent accessibility workflow:
1. **Automated Audit**: Scans websites against WCAG 2.1 Level AA & AAA standards.
2. **AI Impact Reasoning**: Explains *why* an issue violates accessibility and *who* it hurts.
3. **Interactive Code Remediation**: Generates instant side-by-side Before/After code diffs that developers can copy or simulate.
4. **Persona-Centric Insights**: Analyzes barriers specifically for Visual Impairment, Cognitive Differences, Motor Disabilities, and Hearing Impairments.
5. **Multimodal Alt-Text Engine**: Analyzes uploaded graphics to craft context-aware descriptive text.
6. **Cognitive Text Simplifier**: Translates complex bureaucratic legalese into plain language (6th-grade reading level).
7. **Executive Compliance Reports**: Generates formal audit summaries ready for export.

---

## 3. Key Features

- **Automated Website Scanner**: Multi-stage progress pipeline scanning real URLs and preset testbeds.
- **Accessibility Score & Category Radar**: Live scores (0-100) across Visual, Screen Reader, Keyboard, Readability, and Forms.
- **Filterable Issues Workbench**: Filter by severity (Critical, Serious, Moderate, Minor), category, or persona.
- **AI Remediation Studio**: Side-by-side code diffs with one-click fix simulation that dynamically recalibrates the compliance score.
- **Accessibility Persona Matrix**:
  - *Visual Impairment*: Screen readers, magnification, contrast.
  - *Cognitive Difficulty*: ADHD, dyslexia, executive function, plain language.
  - *Motor Disability*: Keyboard navigation, focus rings, minimum touch target sizes.
  - *Hearing Impairment*: Captions, transcripts, visual status cues.
- **Multimodal Alt Text Generator**: Generates concise, short, and long descriptions with decorative risk scoring.
- **Text Simplification Engine**: Flesch-Kincaid grade analysis with plain language rewrites.
- **Formal Reports & Export**: Downloadable structured JSON and print-ready compliance certifications.

---

## 4. Architecture

```text
                  User Interface (React 18 + Tailwind CSS)
                                    │
                                    ▼
                          AccessAI Gateway
                       (Node.js / Express / Vite)
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
   Automated Engine                                      Multimodal AI
  (cheerio + axe-core)                              (Google Gemini 3.8 Flash)
  - DOM Tree Traversal                              - Alt-Text Generation
  - Contrast & Label Check                          - Plain Language Rewrite
  - Semantic Landmarks                              - Code Fixes & Diffs
                                    │
                                    ▼
                         PostgreSQL / Supabase
                   (Scans, Issues, Personas, Reports)
```

---

## 5. Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Motion.
- **Backend Services**: Node.js / Express, Cheerio, FastAPI (Python alternate in `/backend`).
- **AI Models**: Google Gemini 3.8 Flash via `@google/genai` TypeScript SDK.
- **Cloud & Deployment**: AWS ECS (Fargate), AWS S3, CloudWatch, Docker.
- **Database**: PostgreSQL / Supabase schema.

---

## 6. Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone https://github.com/accessai/accessai-platform.git
cd accessai-platform

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 7. Environment Variables

Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY="your-gemini-api-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"
AWS_REGION="us-east-1"
```

---

## 8. Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scan` | Audit a URL against WCAG 2.1 rules with SSRF protection |
| `GET` | `/api/scan/:scan_id` | Retrieve stored audit report and score breakdown |
| `POST` | `/api/analyze-issue` | AI root-cause explanation and before/after code diff |
| `POST` | `/api/generate-alt-text` | Multimodal vision analysis for informative vs decorative graphics |
| `POST` | `/api/simplify-text` | Cognitive accessibility rewrite and grade level analysis |
| `POST` | `/api/persona-analysis` | Persona-specific barrier mapping and priority recommendations |
| `POST` | `/api/report` | Generate complete formal compliance report |

---

## 9. Accessibility Standards (WCAG Compliance)

AccessAI validates and remediates against:
- **WCAG 2.1 AA 1.1.1**: Non-text Content (Images, icons, infographics)
- **WCAG 2.1 AA 1.3.1**: Info and Relationships (Headings, landmarks, tables)
- **WCAG 2.1 AA 1.4.3**: Contrast (Minimum 4.5:1 for standard text, 3:1 for large text)
- **WCAG 2.1 AA 2.1.1**: Keyboard Navigation (Tab order, focus traps, focus visibility)
- **WCAG 2.1 AA 2.4.4**: Link Purpose in Context (Eliminating vague "click here" anchors)
- **WCAG 2.1 AA 3.3.2**: Labels or Instructions (Form field accessibility)
- **WCAG 2.1 AA 4.1.2**: Name, Role, Value (ARIA attributes and custom widgets)
- **WCAG 2.1 AAA 3.1.5**: Reading Level (Plain language cognitive simplification)

---

## 10. Core Impact: Accessible Technology for All

AccessAI directly tackles the digital divide by:
- Empowering developers and non-technical content creators to understand disability barriers firsthand.
- Providing empathy-driven persona simulation that moves beyond cold compliance checklists.
- Delivering zero-friction AI code remediations that can be applied directly to production source code.

---

## 11. Future Roadmap
- **CI/CD GitHub Action**: Auto-scan PRs and fail builds on critical WCAG regressions.
- **Live Chrome Extension**: In-browser overlay for live testing during web development.
- **Dynamic Color Palette Generator**: Auto-adjusting brand theme colors to guarantee WCAG AAA contrast mathematically.
