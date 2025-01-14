import { supabase } from './supabase';

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', { name: 'OPENAI_API_KEY' });

    if (error) {
      throw new Error('Failed to fetch OpenAI API key. Please make sure you have added it in the project settings.');
    }

    if (!data) {
      throw new Error('OpenAI API key not found. Please add it in the project settings.');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate content');
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw new Error(error.message);
  }
};

export const postToTwitter = async (content: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', { name: 'TWITTER_API_KEY' });

    if (error) {
      throw new Error('Failed to fetch Twitter API key. Please make sure you have added it in the project settings.');
    }

    if (!data) {
      throw new Error('Twitter API key not found. Please add it in the project settings.');
    }

    // Here you would implement the Twitter API call
    // For now, we'll just log the attempt
    console.log('Would post to Twitter:', content);
  } catch (error: any) {
    console.error('Error posting to Twitter:', error);
    throw new Error(error.message);
  }
};