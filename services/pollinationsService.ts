
import { ColoringStyle, GenerationConfig } from '../types';
import { STYLE_TEMPLATES, KDP_PROMPT_MODIFIERS } from '../constants';

const POLLINATIONS_BASE_URL = 'https://gen.pollinations.ai/image';
// Using the dedicated Pollinations key provided by the user to resolve 401 errors
const POLLINATIONS_API_KEY = 'sk_gKcwKFqHyGSvO8F47ZXSkngJOYPAtlWP';

/**
 * Converts a Blob to a base64 Data URL for persistent storage in localStorage.
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Fetches the list of available models from the Pollinations AI API.
 * Normalizes results to strings to prevent UI errors.
 */
export const fetchAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${POLLINATIONS_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const models = await response.json();
    if (Array.isArray(models)) {
      return models.map(m => {
        if (typeof m === 'string') return m;
        if (m && typeof m === 'object') {
          return String(m.id || m.name || m.slug || 'flux');
        }
        return 'flux';
      });
    }
    return ['flux', 'flux-pro', 'flux-realism'];
  } catch (error) {
    console.error("Fetch Models Error:", error);
    // Return common models as fallback if the API is down or key is failing
    return ['flux', 'flux-pro', 'flux-realism', 'any-v4-5', 'dreamshaper-8']; 
  }
};

/**
 * Generates a high-quality coloring page using the Pollinations AI API.
 */
export const generateColoringPage = async (config: GenerationConfig, seed?: number): Promise<string> => {
  const styleTemplate = STYLE_TEMPLATES[config.style];
  const finalPromptText = `${config.prompt}, ${styleTemplate.prompt}, ${KDP_PROMPT_MODIFIERS}`;
  const encodedPrompt = encodeURIComponent(finalPromptText);
  
  const currentSeed = seed ?? Math.floor(Math.random() * 1000000);
  const width = 1024;
  const height = 1324;
  
  const url = `${POLLINATIONS_BASE_URL}/${encodedPrompt}?width=${width}&height=${height}&seed=${currentSeed}&model=${config.model}&nologo=true`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Pollinations API Unauthorized (401). Please check the API key.");
      }
      throw new Error(`AI generation failed with status: ${response.status}`);
    }

    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch (error: any) {
    console.error("Pollinations API Error:", error);
    throw new Error(error.message || "Failed to generate image. Please check your connection.");
  }
};

/**
 * Handles bulk generation of multiple coloring pages.
 */
export const bulkGenerate = async (
  config: GenerationConfig, 
  onProgress: (index: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  for (let i = 0; i < config.count; i++) {
    try {
      const dataUrl = await generateColoringPage(config, Math.floor(Math.random() * 1000000) + i);
      urls.push(dataUrl);
      onProgress(i + 1);
    } catch (error: any) {
      console.error(`Error generating page ${i + 1}:`, error);
      // Fail the whole batch if it's an authentication error
      if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        throw error;
      }
    }
  }
  return urls;
};
