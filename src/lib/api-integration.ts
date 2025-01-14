import { supabase } from './supabase';
import { Post } from './supabase';

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const { data: { secret: openaiKey } } = await supabase
      .rpc('get_secret', { name: 'OPENAI_API_KEY' });

    if (!openaiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw new Error(error.message);
  }
};

export const postToTwitter = async (content: string): Promise<void> => {
  try {
    const { data: { secret: twitterKey } } = await supabase
      .rpc('get_secret', { name: 'TWITTER_API_KEY' });

    if (!twitterKey) {
      throw new Error('Twitter API key not found');
    }

    // Here you would implement the Twitter API call
    // For now, we'll just log the attempt
    console.log('Would post to Twitter:', content);
  } catch (error: any) {
    console.error('Error posting to Twitter:', error);
    throw new Error(error.message);
  }
};