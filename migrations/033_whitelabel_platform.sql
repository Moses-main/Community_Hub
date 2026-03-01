-- Migration: Create White-Label Church Platform
-- For issue #35: White-Label Church Platform

-- Organizations (tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255),
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    primary_color VARCHAR(20) DEFAULT '#1a73e8',
    secondary_color VARCHAR(20) DEFAULT '#34a853',
    accent_color VARCHAR(20) DEFAULT '#fbbc04',
    background_color VARCHAR(20) DEFAULT '#ffffff',
    text_color VARCHAR(20) DEFAULT '#202124',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom Themes
CREATE TABLE IF NOT EXISTS organization_themes (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom Pages
CREATE TABLE IF NOT EXISTS custom_pages (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    show_in_nav BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Custom Menu Items
CREATE TABLE IF NOT EXISTS custom_menu_items (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    menu_location VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    page_id INTEGER REFERENCES custom_pages(id),
    icon VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom Fields
CREATE TABLE IF NOT EXISTS custom_fields (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255),
    is_required BOOLEAN DEFAULT FALSE,
    options JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Organization Users (multi-tenant)
CREATE TABLE IF NOT EXISTS organization_members (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'active',
    invited_by UUID,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Organization Settings
CREATE TABLE IF NOT EXISTS organization_settings (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL UNIQUE,
    settings JSONB DEFAULT '{}',
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom Domain Mappings
CREATE TABLE IF NOT EXISTS custom_domains (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    ssl_enabled BOOLEAN DEFAULT FALSE,
    ssl_cert VARCHAR(500),
    ssl_key VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Organization Analytics
CREATE TABLE IF NOT EXISTS organization_analytics (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id) NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_themes_org_id ON organization_themes(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_pages_org_id ON custom_pages(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_menu_items_org_id ON custom_menu_items(organization_id);
CREATE INDEX IF NOT idx_email_templates_org_id ON email_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_org_id ON custom_fields(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_org_id ON custom_domains(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_analytics_org_id ON organization_analytics(organization_id);

-- Create default organization for existing data
INSERT INTO organizations (name, slug, is_active, is_verified) 
VALUES ('WCCRM Lagos', 'wccrm-lagos', TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Get organization ID and create default theme
DO $$
DECLARE
    org_id INTEGER;
BEGIN
    SELECT id INTO org_id FROM organizations WHERE slug = 'wccrm-lagos' LIMIT 1;
    IF org_id IS NOT NULL THEN
        INSERT INTO organization_themes (organization_id, name, is_default, config)
        VALUES (org_id, 'Default', TRUE, '{"primaryColor": "#1a73e8", "secondaryColor": "#34a853", "accentColor": "#fbbc04", "borderRadius": "8px"}')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO organization_settings (organization_id, settings, features)
        VALUES (org_id, '{"allowCustomDomain": true, "allowCustomTheme": true, "enableCustomPages": true}', '{"sermons": true, "events": true, "donations": true, "groups": true}')
        ON CONFLICT (organization_id) DO NOTHING;
    END IF;
END $$;
