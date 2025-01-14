import { supabase } from './supabase';
import { Post } from '@/types';

export const schedulePost = async (post: Omit<Post, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      status: 'scheduled',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getScheduledPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'scheduled')
    .order('scheduled_for', { ascending: true });

  if (error) throw error;
  return data;
};

export const publishPost = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .update({ status: 'published' })
    .eq('id', postId);

  if (error) throw error;
};