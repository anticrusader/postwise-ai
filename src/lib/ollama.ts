import { supabase } from './supabase';

export const checkOllamaHealth = async (ollamaUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(`${ollamaUrl}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
};

export const fetchOllamaModels = async (ollamaUrl: string): Promise<string[]> => {
  try {
    const isHealthy = await checkOllamaHealth(ollamaUrl);
    if (!isHealthy) {
      throw new Error('Ollama service is not available. Please check if it\'s running.');
    }

    const response = await fetch(`${ollamaUrl}/api/tags`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Ollama:', errorText);
      throw new Error('Failed to fetch Ollama models');
    }

    const text = await response.text();
    try {
      // Try to parse the response as JSON
      const data = JSON.parse(text);
      
      // Check if the response has the expected structure
      if (data && Array.isArray(data.models)) {
        const modelNames = data.models.map((model: { name: string }) => model.name);
        if (modelNames.length === 0) {
          throw new Error('No models found in Ollama');
        }
        console.log('Available Ollama models:', modelNames);
        return modelNames;
      } else {
        console.error('Unexpected Ollama response format:', data);
        throw new Error('Invalid response format from Ollama');
      }
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', text);
      throw new Error('Invalid response format from Ollama');
    }
  } catch (error: any) {
    console.error('Error in fetchOllamaModels:', error);
    throw error;
  }
};

export const generateWithOllama = async (prompt: string, ollamaUrl: string): Promise<string> => {
  try {
    const models = await fetchOllamaModels(ollamaUrl);
    if (!models.length) {
      throw new Error('No Ollama models found. Please check your Ollama installation.');
    }

    const modelToUse = models[0];
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