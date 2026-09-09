# AccessAI — System Architecture & AWS Cloud Deployment

## Accessible Technology for All

AccessAI is designed as a cloud-native, scalable accessibility auditing and AI remediation platform that bridges automated accessibility rule engines (axe-core) with multimodal reasoning models (Google Gemini).

---

## 1. High-Level Architecture Overview

```text
               USER (Browser / Assistive Technology)
                               │
                               ▼
                   AWS Route 53 (DNS / Anycast)
                               │
                               ▼
                  AWS CloudFront (Edge CDN)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   AWS S3 (Static React SPA)             AWS Application Load Balancer
   - Vite 5 + Tailwind CSS                       │
   - Lucide Icons / Recharts                     ▼
                                       AWS ECS Fargate Cluster
                                       (FastAPI / Node Backend)
                                       - SSRF Validator
                                       - Web Fetcher & axe-core Parser
                                       - Rule Evaluation Engine
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
             Google Gemini AI Platform                         AWS RDS PostgreSQL
             (gemini-3.8-flash)                                (or Supabase Cloud)
             - Multimodal Vision (Alt-Text)                    - Audit Records & Scores
             - Code Remediation Diffs                          - Persona Impact Maps
             - Cognitive Simplification                       - Export Reports
```

---

## 2. Component Breakdown

### A. Frontend Layer (Single Page Application)
- **Framework**: React 18 with TypeScript & Vite.
- **Styling**: Tailwind CSS with WCAG AA/AAA compliant high-contrast color palette.
- **State & Routing**: Unified state machine orchestrating active scan results, live AI diff simulation, persona filters, and download reports.
- **Charts & Data Visualization**: Recharts radar, bar, and radial gauges displaying category compliance across Visual, Screen Reader, Keyboard, Readability, and Forms.

### B. Backend Services (ECS / Express / FastAPI)
- **SSRF Hardening**: Rejects loopback addresses, metadata endpoints (e.g., `169.254.169.254`), and private IPv4 ranges.
- **Automated Engine**: Evaluates WCAG 2.1 Level AA & AAA rules:
  - Non-text Content (1.1.1)
  - Color Contrast (1.4.3)
  - Name, Role, Value (4.1.2)
  - Info and Relationships / Labels (1.3.1 / 3.3.2)
  - Heading Order & Landmarks (2.4.6 / 1.3.1)
  - Keyboard Focus Sequence (2.4.3)
  - Reading Level (3.1.5)
- **Google Gemini Integration**: Lazy-initialized server-side client calling `gemini-3.8-flash` for multimodal alt-text generation, code remediation diffs, and plain-language simplification.

### C. Persistent Storage (PostgreSQL / Supabase)
- **Schemas**: `users`, `scans`, `issues`, `recommendations`, `persona_analysis`, `generated_reports`.
- Indexed on `url`, `scanned_at`, and `severity` for instant query response during hackathon demos.

---

## 3. AWS Production Deployment Blueprint

### Infrastructure as Code (Terraform / CloudFormation)
1. **Compute**: AWS ECS (Fargate) with auto-scaling policy (2-10 tasks based on CPU/Memory utilization).
2. **Storage**: AWS S3 bucket for caching audit reports, exported PDF summaries, and benchmark assets with encrypted bucket policies.
3. **Database**: AWS RDS Multi-AZ PostgreSQL 15 instance.
4. **Networking**: VPC with public subnets for Application Load Balancers and private subnets for ECS tasks and RDS.
5. **Observability**: AWS CloudWatch logs and metrics tracking:
   - Audit scan duration (p95 < 2.5s)
   - AI response latency
   - WCAG violation distribution

---

## 4. Security & Compliance
- **API Secrets**: Managed securely server-side via environment variables; never exposed to browser bundles.
- **SSRF Protection**: Strict whitelist of URL schemes (`http`, `https`) and prohibition of intranet/metadata IPs.
- **Rate Limiting**: Protects AI generation endpoints from abusive scraping.
