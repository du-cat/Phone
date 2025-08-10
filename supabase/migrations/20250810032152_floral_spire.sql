/*
# AI Voice Receptionist Database Schema

This schema defines the core tables for managing tenants, users, phone numbers, calls, and related data for the AI voice receptionist system.

## Tables Created:
1. tenants - Multi-tenant organization management
2. tenant_users - User-tenant relationships with roles
3. numbers - Phone numbers and DID management
4. calls - Call records and metadata
5. call_events - Detailed call event logging
6. transcripts - Speech-to-text results
7. contacts - Customer contact management
8. appointments - Scheduling and calendar integration
9. voice_profiles - TTS voice configuration
10. scripts - Conversation flow configuration

## Security:
- Row Level Security (RLS) enabled on all tables
- Sample policies provided (commented out - implement as needed)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Tenant users relationship
CREATE TABLE IF NOT EXISTS tenant_users (
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, -- References auth.users
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id)
);

ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;

-- Phone numbers
CREATE TABLE IF NOT EXISTS numbers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'telnyx',
  did text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  external_caller_id_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE numbers ENABLE ROW LEVEL SECURITY;

-- Calls
CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  number_id uuid REFERENCES numbers(id) ON DELETE CASCADE,
  provider_call_id text NOT NULL,
  from_number text NOT NULL,
  to_number text NOT NULL,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  status text NOT NULL DEFAULT 'initiated',
  recording_url text
);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Call events for detailed logging
CREATE TABLE IF NOT EXISTS call_events (
  id bigserial PRIMARY KEY,
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE,
  ts timestamptz DEFAULT now(),
  type text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

-- Transcripts
CREATE TABLE IF NOT EXISTS transcripts (
  id bigserial PRIMARY KEY,
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE,
  start_ms int NOT NULL DEFAULT 0,
  end_ms int NOT NULL DEFAULT 0,
  text text NOT NULL,
  is_final boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text,
  phone text,
  email text,
  first_seen_at timestamptz DEFAULT now(),
  last_interaction_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  calendar_provider text,
  calendar_event_id text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Voice profiles for TTS
CREATE TABLE IF NOT EXISTS voice_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  label text NOT NULL,
  engine text NOT NULL DEFAULT 'elevenlabs',
  engine_voice_id text NOT NULL,
  sample_url text,
  consent boolean DEFAULT false,
  params jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

-- Scripts for conversation flow
CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  active boolean DEFAULT false,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS calls_tenant_id_idx ON calls(tenant_id);
CREATE INDEX IF NOT EXISTS calls_started_at_idx ON calls(started_at);
CREATE INDEX IF NOT EXISTS call_events_call_id_idx ON call_events(call_id);
CREATE INDEX IF NOT EXISTS transcripts_call_id_idx ON transcripts(call_id);
CREATE INDEX IF NOT EXISTS contacts_tenant_id_phone_idx ON contacts(tenant_id, phone);
CREATE INDEX IF NOT EXISTS appointments_tenant_id_starts_at_idx ON appointments(tenant_id, starts_at);

-- Sample RLS policies (commented out - implement based on auth requirements)
/*
-- Tenants: Users can only see tenants they belong to
CREATE POLICY "Users can view own tenants" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  );

-- Numbers: Users can only see numbers for their tenants
CREATE POLICY "Users can view tenant numbers" ON numbers
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  );

-- Calls: Users can only see calls for their tenants
CREATE POLICY "Users can view tenant calls" ON calls
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  );

-- Similar policies would be added for other tables...
*/