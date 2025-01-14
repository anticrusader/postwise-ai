import { supabase } from './supabase';

type LLMProvider = "openai" | "perplexity" | "ollama";

export const generateContent = async (prompt: string, provider: LLMProvider = "openai"): Promise<string> => {
  try {
    switch (provider) {
      case "openai":
        return await generateWithOpenAI(prompt);
      case "perplexity":
        return await generateWithPerplexity(prompt);
      case "ollama":
        return await generateWithOllama(prompt);
      default:
        throw new Error('Unsupported LLM provider');
    }
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw new Error(error.message);
  }
};

const generateWithOpenAI = async (prompt: string): Promise<string> => {
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('secrets')
    .select('secret')
    .eq('name', 'OPENAI_API_KEY')
    .single();

  if (apiKeyError) {
    throw new Error('OpenAI API key not found. Please add it in the project settings.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeyData.secret}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing/overview or add a different API key in the project settings.');
    }
    if (response.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the project settings.');
    }
    throw new Error(error.error?.message || 'Failed to generate content');
  }

  const result = await response.json();
  return result.choices[0].message.content;
};

const generateWithPerplexity = async (prompt: string): Promise<string> => {
  const { data: apiKeyData, error: apiKeyError } = await supabase
    .from('secrets')
    .select('secret')
    .eq('name', 'PERPLEXITY_API_KEY')
    .single();

  if (apiKeyError) {
    throw new Error('Perplexity API key not found. Please add it in the project settings.');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKeyData.secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Be precise and concise.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 402) {
      throw new Error('Perplexity API billing required. Please visit https://perplexity.ai to set up billing.');
    }
    if (response.status === 401) {
      throw new Error('Invalid Perplexity API key. Please check your API key in the project settings.');
    }
    throw new Error(error.error?.message || 'Failed to generate content');
  }

  const result = await response.json();
  return result.choices[0].message.content;
};

const generateWithOllama = async (prompt: string): Promise<string> => {
  try {
    const ollamaUrl = 'http://localhost:11434';

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ollama server not found. Make sure Ollama is running locally (download from https://ollama.ai)');
      }
      if (response.status === 500) {
        throw new Error('Ollama server error. Make sure the model is downloaded (run: ollama pull llama2)');
      }
      throw new Error('Failed to generate content with Ollama');
    }

    const result = await response.json();
    return result.response;
  } catch (error: any) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to Ollama. Make sure Ollama is running locally (download from https://ollama.ai)');
    }
    throw error;
  }
};

export const postToTwitter = async (content: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'TWITTER_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching Twitter API key:', error);
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
