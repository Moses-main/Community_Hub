-- Issue #28: Role-Based Admin & Permissions System
-- Create audit logs table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create role permissions table
CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  permission_id INTEGER REFERENCES permissions(id),
  UNIQUE(role, permission_id)
);

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES 
  ('manage_members', 'Can manage church members'),
  ('manage_events', 'Can create and manage events'),
  ('manage_sermons', 'Can manage sermons'),
  ('manage_donations', 'Can view and manage donations'),
  ('manage_finance', 'Can access financial reports'),
  ('manage_groups', 'Can manage groups and communities'),
  ('manage_attendance', 'Can take and view attendance'),
  ('send_messages', 'Can send messages to members'),
  ('view_analytics', 'Can view analytics and reports'),
  ('manage_settings', 'Can manage church settings'),
  ('manage_content', 'Can manage devotionals and content'),
  ('moderate_content', 'Can moderate user-generated content');
