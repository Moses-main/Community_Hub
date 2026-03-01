-- Migration: Create API & External Integrations
-- For issue #33: API & External Integrations

-- External API Keys
CREATE TABLE IF NOT EXISTS external_api_keys (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    hashed_key VARCHAR(255) NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Deliveries (logs)
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER REFERENCES webhooks(id) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- External Integrations
CREATE TABLE IF NOT EXISTS external_integrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'disconnected',
    config JSONB DEFAULT '{}',
    credentials JSONB,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Integration OAuth Apps
CREATE TABLE IF NOT EXISTS oauth_apps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL UNIQUE,
    client_secret VARCHAR(255),
    redirect_uris TEXT[],
    scopes TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Authorization Codes
CREATE TABLE IF NOT EXISTS oauth_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    client_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    redirect_uri VARCHAR(500) NOT NULL,
    scope TEXT[],
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Access Tokens
CREATE TABLE IF NOT EXISTS oauth_tokens (
    id SERIAL PRIMARY KEY,
    access_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255),
    client_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    scope TEXT[],
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- API Rate Limit Logs
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER REFERENCES external_api_keys(id),
    endpoint VARCHAR(255),
    ip_address VARCHAR(50),
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- External API Call Logs
CREATE TABLE IF NOT EXISTS api_call_logs (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER REFERENCES external_api_keys(id),
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Integration Sync Jobs
CREATE TABLE IF NOT EXISTS integration_sync_jobs (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES external_integrations(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_external_api_keys_user_id ON external_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_code ON oauth_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_access_token ON oauth_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_start ON api_rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_api_call_logs_created_at ON api_call_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_integration_sync_jobs_integration_id ON integration_sync_jobs(integration_id);

-- Insert default integrations
INSERT INTO external_integrations (name, type, status) VALUES
('Email Service', 'email', 'disconnected'),
('SMS Service', 'sms', 'disconnected'),
('Payment Gateway', 'payment', 'disconnected'),
('Analytics Platform', 'analytics', 'disconnected'),
('Zapier', 'automation', 'disconnected'),
('Slack', 'messaging', 'disconnected'),
('Google Calendar', 'calendar', 'disconnected'),
('Mailchimp', 'marketing', 'disconnected')
ON CONFLICT DO NOTHING;
