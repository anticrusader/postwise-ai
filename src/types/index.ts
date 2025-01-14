export type SubscriptionTier = 'free' | 'creator' | 'professional' | 'enterprise';
export type PostStatus = 'draft' | 'scheduled' | 'published';
export type Platform = 'twitter' | 'linkedin' | 'instagram';

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  full_name?: string;
  subscription_tier: SubscriptionTier;
  posts_generated_this_month: number;
}

export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  platform: Platform;
  scheduled_for?: string;
  status: PostStatus;
}

export interface Analytics {
  id: string;
  post_id: string;
  engagement: number;
  reach: number;
  date: string;
}