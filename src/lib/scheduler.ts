import { supabase } from './supabase';
import { Post } from '@/types';
import { publishToSocialMedia } from './social-media';

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
  try {
    // Get post details
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;
    if (!post) throw new Error('Post not found');

    // Publish to social media
    await publishToSocialMedia({
      content: post.content,
      platform: post.platform,
    });

    // Update post status
    const { error: updateError } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .eq('id', postId);

    if (updateError) throw updateError;

    // Create analytics entry
    await supabase
      .from('analytics')
      .insert({
        post_id: postId,
        engagement: 0,
        reach: 0,
        date: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error publishing post:', error);
    throw error;
  }
};