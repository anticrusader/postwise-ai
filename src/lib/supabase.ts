import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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