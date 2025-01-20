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

    console.log('Fetching models from Ollama URL:', ollamaUrl);
    const response = await fetch(`${ollamaUrl}/api/tags`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Ollama:', errorText);
      throw new Error('Failed to fetch Ollama models');
    }

    // Get the content type to help debug response format
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);

    const text = await response.text();
    console.log('Raw Ollama response:', text);

    // If response is empty, return empty array
    if (!text.trim()) {
      console.log('Empty response from Ollama');
      return [];
    }

    try {
      // Try to parse the response as JSON
      const data = JSON.parse(text);
      console.log('Parsed Ollama response:', data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // Format: ["model1", "model2", ...]
        console.log('Response is an array of models:', data);
        return data;
      } else if (data && Array.isArray(data.models)) {
        // Format: { models: [{ name: "model1" }, { name: "model2" }, ...] }
        const modelNames = data.models.map((model: { name: string }) => model.name);
        console.log('Response contains models array:', modelNames);
        return modelNames;
      } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        // Format: { "model1": {}, "model2": {}, ... }
        const modelNames = Object.keys(data);
        console.log('Response is an object with model keys:', modelNames);
        return modelNames;
      }

      console.error('Unexpected data structure:', data);
      throw new Error('Invalid response format from Ollama');
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', parseError);
      console.error('Raw response was:', text);
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