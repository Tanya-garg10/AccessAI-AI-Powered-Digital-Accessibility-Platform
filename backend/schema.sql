-- AccessAI Database Schema for PostgreSQL / Supabase
-- Accessible Technology for All

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    organization_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    page_title TEXT,
    overall_score INTEGER NOT NULL,
    visual_score INTEGER,
    screen_reader_score INTEGER,
    keyboard_score INTEGER,
    readability_score INTEGER,
    forms_score INTEGER,
    navigation_score INTEGER,
    critical_count INTEGER DEFAULT 0,
    serious_count INTEGER DEFAULT 0,
    moderate_count INTEGER DEFAULT 0,
    minor_count INTEGER DEFAULT 0,
    passed_checks_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Issues Table
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    rule_id VARCHAR(100) NOT NULL,
    wcag_criterion VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'critical', 'serious', 'moderate', 'minor'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    why_it_matters TEXT,
    element_html TEXT,
    selector TEXT,
    ai_fix_suggestion TEXT,
    ai_fixed_html TEXT,
    affected_personas JSONB DEFAULT '[]'::jsonb,
    is_fixed BOOLEAN DEFAULT FALSE,
    fixed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    persona_type VARCHAR(50),
    title TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    code_before TEXT,
    code_after TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Persona Analysis Table
CREATE TABLE IF NOT EXISTS persona_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    persona_id VARCHAR(50) NOT NULL, -- 'visual', 'cognitive', 'motor', 'hearing'
    impact_score INTEGER NOT NULL,
    high_impact_barriers JSONB DEFAULT '[]'::jsonb,
    ai_recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Generated Reports Table
CREATE TABLE IF NOT EXISTS generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    report_title TEXT NOT NULL,
    format VARCHAR(20) DEFAULT 'json', -- 'json', 'pdf'
    s3_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scans_url ON scans(url);
CREATE INDEX IF NOT EXISTS idx_scans_date ON scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_scan_id ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
