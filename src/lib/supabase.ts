import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  scheduled_for?: string;
  status: 'draft' | 'scheduled' | 'published';
};

export type Profile = {
  id: string;
  created_at: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'creator' | 'professional' | 'enterprise';
  posts_generated_this_month: number;
};