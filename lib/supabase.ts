import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable.');
}

// Anonymous client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations
export const supabaseAdmin = supabaseServiceRole ? createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}) : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    // Simple connection test - just check if we can connect
    const { error } = await supabase.from('tenants').select('count').limit(1);
    return { connected: !error, error: error?.message };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : 'Connection failed' };
  }
};
// Database types (to be generated from actual schema later)
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      numbers: {
        Row: {
          id: string;
          tenant_id: string;
          provider: string;
          did: string;
          status: string;
          external_caller_id_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider: string;
          did: string;
          status?: string;
          external_caller_id_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          provider?: string;
          did?: string;
          status?: string;
          external_caller_id_verified?: boolean;
          created_at?: string;
        };
      };
      calls: {
        Row: {
          id: string;
          tenant_id: string;
          number_id: string;
          provider_call_id: string;
          from_number: string;
          to_number: string;
          started_at: string;
          ended_at: string | null;
          status: string;
          recording_url: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          number_id: string;
          provider_call_id: string;
          from_number: string;
          to_number: string;
          started_at?: string;
          ended_at?: string | null;
          status?: string;
          recording_url?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          number_id?: string;
          provider_call_id?: string;
          from_number?: string;
          to_number?: string;
          started_at?: string;
          ended_at?: string | null;
          status?: string;
          recording_url?: string | null;
        };
      };
    };
  };
}