-- Migration: Create Multi-Campus & Branch Management
-- For issue #31: Multi-Campus & Branch Management

-- Campuses
CREATE TABLE IF NOT EXISTS campuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    pastor_id UUID REFERENCES users(id),
    is_headquarters BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Branches (sub-congregations under a campus)
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    campus_id INTEGER REFERENCES campuses(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    leader_id UUID REFERENCES users(id),
    leader_name VARCHAR(255),
    leader_phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(campus_id, code)
);

-- Campus Members (members assigned to a campus)
CREATE TABLE IF NOT EXISTS campus_members (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    campus_id INTEGER REFERENCES campuses(id) NOT NULL,
    branch_id INTEGER REFERENCES branches(id),
    membership_type VARCHAR(50) DEFAULT 'member',
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Campus Events
CREATE TABLE IF NOT EXISTS campus_events (
    id SERIAL PRIMARY KEY,
    campus_id INTEGER REFERENCES campuses(id) NOT NULL,
    event_id INTEGER REFERENCES events(id) NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Campus Transfers (member movement between campuses)
CREATE TABLE IF NOT EXISTS campus_transfers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    from_campus_id INTEGER REFERENCES campuses(id),
    to_campus_id INTEGER REFERENCES campuses(id) NOT NULL,
    from_branch_id INTEGER REFERENCES branches(id),
    to_branch_id INTEGER REFERENCES branches(id),
    status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Campus Reports
CREATE TABLE IF NOT EXISTS campus_reports (
    id SERIAL PRIMARY KEY,
    campus_id INTEGER REFERENCES campuses(id) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    data JSONB DEFAULT '{}',
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campuses_code ON campuses(code);
CREATE INDEX IF NOT EXISTS idx_campuses_pastor_id ON campuses(pastor_id);
CREATE INDEX IF NOT EXISTS idx_branches_campus_id ON branches(campus_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_user_id ON campus_members(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_members_campus_id ON campus_members(campus_id);
CREATE INDEX IF NOT EXISTS idx_campus_events_campus_id ON campus_events(campus_id);
CREATE INDEX IF NOT EXISTS idx_campus_transfers_user_id ON campus_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_reports_campus_id ON campus_reports(campus_id);

-- Default headquarters campus
INSERT INTO campuses (name, code, address, city, state, country, is_headquarters, is_active) 
VALUES ('WCCRM Lagos Headquarters', 'HQ', 'Lagos', 'Lagos', 'Lagos', 'Nigeria', TRUE, TRUE)
ON CONFLICT (code) DO NOTHING;
