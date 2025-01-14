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
    const { data: urlData } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OLLAMA_API_URL')
      .single();

    const ollamaUrl = urlData?.secret || 'http://localhost:11434';
    console.log('Using Ollama URL:', ollamaUrl);

    // First, get available models
    const modelsResponse = await fetch(`${ollamaUrl}/api/tags`);
    
    if (!modelsResponse.ok) {
      throw new Error('Failed to fetch Ollama models. Please check your connection settings.');
    }

    const modelsData = await modelsResponse.json();
    console.log('Available models:', modelsData);

    if (!modelsData?.models?.length) {
      throw new Error('No Ollama models found. Please check your Ollama installation.');
    }

    // Use the first available model
    const modelToUse = modelsData.models[0].name;
    console.log('Using model:', modelToUse);

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Ollama:', errorText);
      throw new Error(`Failed to generate content with Ollama: ${errorText}`);
    }

    const result = await response.json();
    return result.response;
  } catch (error: any) {
    console.error('Error in generateWithOllama:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to Ollama. Please check:\n1. Ollama is running\n2. Your connection settings are correct\n3. The URL in project settings is valid');
    }
    throw error;
  }
};

export const fetchOllamaModels = async (): Promise<string[]> => {
  try {
    const { data: urlData } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OLLAMA_API_URL')
      .single();

    const ollamaUrl = urlData?.secret || 'http://localhost:11434';
    console.log('Fetching from Ollama URL:', ollamaUrl);

    const modelsResponse = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!modelsResponse.ok) {
      const contentType = modelsResponse.headers.get('content-type');
      const responseText = await modelsResponse.text();
      console.error('Error response from Ollama models:', responseText);
      
      if (contentType?.includes('text/html') && responseText.includes('ngrok')) {
        throw new Error('Cannot connect to Ollama through ngrok. Please check:\n1. Your ngrok tunnel is running\n2. The correct ngrok URL is set in project settings\n3. The URL includes http:// or https://\n4. The port is correct (usually 11434)');
      }

      // Return default models list with instructions
      console.log('Could not fetch models, returning default list');
      throw new Error('No models found. Please run one of these commands:\n- ollama pull llama2\n- ollama pull mistral\n- ollama pull codellama\n- ollama pull neural-chat');
    }

    const modelsData = await modelsResponse.json();
    console.log('Available Ollama models:', modelsData);
    
    if (modelsData && Array.isArray(modelsData.models)) {
      const availableModels = modelsData.models.map((model: { name: string }) => model.name);
      if (availableModels.length === 0) {
        throw new Error('No models found. Please run one of these commands:\n- ollama pull llama2\n- ollama pull mistral\n- ollama pull codellama\n- ollama pull neural-chat');
      }
      return availableModels;
    }

    throw new Error('Invalid response format from Ollama. Please check your Ollama installation and try again.');
  } catch (error: any) {
    console.error('Error in fetchOllamaModels:', error);
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

    console.log('Would post to Twitter:', content);
  } catch (error: any) {
    console.error('Error posting to Twitter:', error);
    throw new Error(error.message);
  }
};
