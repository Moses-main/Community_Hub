-- Migration: Create AI Church Assistant (Chatbot)
-- For issue #30: AI Church Assistant (Chatbot)

-- Chat Conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chat_conversations(id) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chatbot Intents (FAQs and responses)
CREATE TABLE IF NOT EXISTS chatbot_intents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    patterns TEXT[],
    responses TEXT[] NOT NULL,
    category VARCHAR(100),
    keywords TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chatbot User Preferences
CREATE TABLE IF NOT EXISTS chatbot_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    language VARCHAR(10) DEFAULT 'en',
    notification_enabled BOOLEAN DEFAULT TRUE,
    digest_preference VARCHAR(50) DEFAULT 'daily',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chatbot Analytics
CREATE TABLE IF NOT EXISTS chatbot_analytics (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chat_conversations(id),
    user_id UUID REFERENCES users(id),
    intent VARCHAR(255),
    response_time_ms INTEGER,
    feedback VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_intents_category ON chatbot_intents(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_preferences_user_id ON chatbot_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_created_at ON chatbot_analytics(created_at);

-- Default intents for church chatbot
INSERT INTO chatbot_intents (name, patterns, responses, category, keywords, priority) VALUES
('greeting', ARRAY['hello', 'hi', 'hey', 'good morning', 'good evening'], ARRAY['Hello! How can I help you today?', 'Welcome! How may I assist you?', 'Hi there! What would you like to know about our church?'], 'general', ARRAY['hello', 'hi', 'greeting'], 10),
('service_times', ARRAY['service time', 'when is service', 'what time', 'worship time', 'service schedule'], ARRAY['Our Sunday service is at 8:00 AM and 10:30 AM. Wednesday Bible study is at 6:30 PM.', 'We have services on Sundays at 8AM and 10:30AM. Join us!'], 'services', ARRAY['service', 'time', 'schedule', 'worship'], 9),
('location', ARRAY['where are you', 'location', 'address', 'how to get', 'directions'], ARRAY['We are located at [Church Address]. You can find us easily with Google Maps.', 'Our church is situated at [Address]. Welcome to visit us!'], 'general', ARRAY['location', 'address', 'directions'], 8),
('baptism', ARRAY['baptism', 'how to be baptized', 'baptize', 'water baptism'], ARRAY['To be baptized, please fill out a baptism form at our reception. Our pastors will contact you to discuss next steps.', 'We conduct baptismal services quarterly. Contact our office for more information.'], 'sacraments', ARRAY['baptism', 'baptize', 'water'], 7),
('salvation', ARRAY['how to be saved', 'accept Jesus', 'get saved', 'become a christian', 'salvation'], ARRAY['To accept Jesus as your Lord and Savior, pray this prayer: Dear Lord, I confess my sins and accept You as my Lord and Savior. Thank you for saving me. Welcome to the family of God!', 'We would love to help you take this step. Please speak with our pastors after service or contact us.'], 'salvation', ARRAY['salvation', 'saved', 'jesus', 'accept'], 10),
('giving', ARRAY['giving', 'tithe', 'offering', 'donate', 'how to give'], ARRAY['You can give online through our website, or during service. Thank you for your generosity!', 'We accept giving via bank transfer, online payment, or in-person during services.'], 'finance', ARRAY['giving', 'tithe', 'offering', 'donate'], 6),
('youth', ARRAY['youth', 'teenagers', 'young people', 'children', 'kids'], ARRAY['Our youth department meets every Friday for Bible study and fellowship. Children church is available during Sunday service.', 'We have age-appropriate programs for all children and youth. Check our calendar for details!'], 'groups', ARRAY['youth', 'teen', 'children', 'kids'], 5),
('small_groups', ARRAY['small group', 'cell group', 'house fellowship', 'connect group'], ARRAY['We have various cell groups meeting across different locations. Contact our cell group coordinator to join one near you.', 'Our house fellowships meet weekly. You can find information at our reception.'], 'groups', ARRAY['small group', 'cell', 'house fellowship'], 6),
('contact', ARRAY['contact', 'phone', 'email', 'reach', 'speak to pastor'], ARRAY['You can call our office at [Phone Number] or email us at [Email].', 'For pastoral care, please call [Phone] or visit our reception after service.'], 'general', ARRAY['contact', 'phone', 'email', 'reach'], 7),
('prayer', ARRAY['prayer', 'pray for me', 'prayer request'], ARRAY['We would be happy to pray for you. Submit your prayer request through our website or speak with our prayer team after service.', 'Our prayer team is available to pray with you. Please visit the prayer corner after service.'], 'prayer', ARRAY['prayer', 'pray'], 8);
