import { supabase } from './supabase';

export interface AnalyticsData {
  posts: number;
  engagement: number;
  reach: number;
  date: string;
}

export const fetchAnalytics = async (startDate: Date, endDate: Date): Promise<AnalyticsData[]> => {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateAnalytics = async (postId: string, metrics: {
  engagement?: number;
  reach?: number;
}) => {
  const { error } = await supabase
    .from('analytics')
    .upsert({
      post_id: postId,
      ...metrics,
      date: new Date().toISOString(),
    });

  if (error) throw error;
};