export type Platform = 'twitter' | 'linkedin' | 'instagram';

export type Post = {
  id: string;
  content: string;
  platform: Platform;
  created_at: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for?: string;
};

export type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email: string;
};