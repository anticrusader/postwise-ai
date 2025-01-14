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
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      if (contentType?.includes('text/html')) {
        throw new Error('Invalid response from Ollama. Please check your connection settings.');
      }
      throw new Error('Failed to fetch Ollama models');
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data && Array.isArray(data.models)) {
        return data.models.map((model: { name: string }) => model.name);
      }
    } catch (e) {
      console.error('Failed to parse Ollama response:', text);
      throw new Error('Invalid response format from Ollama');
    }

    return [];
  } catch (error: any) {
    console.error('Error in fetchOllamaModels:', error);
    throw error;
  }
};