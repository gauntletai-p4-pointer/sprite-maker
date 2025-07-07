import { getState } from './state.js';
import { generateSpritePrompt, SPRITE_SYSTEM_PRIMER, STYLE_PROMPTS } from './prompts.js';

/**
 * Calls OpenAI DALL-E 3 endpoint and returns a data URL.
 * Generates images from text prompts only (no input image required).
 */
export async function callOpenAIGenerate(prompt, apiKey) {
  const state = getState();
  
  // Use provided API key or fallback to the one in state
  const key = apiKey || state.apiKey;
  
  console.log('Calling DALL-E 3 API with:', {
    promptLength: prompt.length,
    hasApiKey: !!key
  });

  try {
    const requestBody = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json'
    };

    console.log('Request body prepared:', requestBody);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(requestBody)
    });

    // More detailed error handling
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error details:', errorData);
      throw new Error(errorData.error?.message || `API call failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Ensure we have the expected data structure
    if (!result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error('Unexpected API response format:', result);
      throw new Error('Invalid response format from OpenAI API');
    }
    
    return `data:image/png;base64,${result.data[0].b64_json}`;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    throw error;
  }
}

// Note: Image processing functions removed as DALL-E 3 works with text prompts only

/**
 * Helper to read a file as data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// API endpoints
const API_ENDPOINTS = {
  generateSprite: '/api/generate-sprite',
};

// Helper function to check API key
function validateApiKey() {
  const { apiKey } = getState();
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key');
  }
  return apiKey;
}

// Helper function to handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.error || 'API request failed');
  }
  throw error;
}

// Generate sprite styles
export async function generateSpriteStyles(imageFile, characterDescription = '') {
  try {
    const state = getState();
    const apiKey = state.apiKey;
    if (!apiKey) {
      throw new Error('Please enter your OpenAI API key');
    }

    // Since DALL-E 3 doesn't use input images, we need to create a character description
    // For now, we'll use a generic description if none is provided
    const charDesc = characterDescription || 'A character for a video game sprite';
    
    // Generate a unique reference token for this character
    const referenceToken = `CHAR_${Date.now().toString(36)}`;
    
    // Generate prompts for each style
    const stylePromises = STYLE_PROMPTS.map(async (style) => {
      try {
        // Generate the prompt for this style with character description
        const prompt = generateSpritePrompt(style.id, 'idle', referenceToken, charDesc);
        console.log(`Generating style ${style.id} with prompt length ${prompt.length}`);
        
        // Call the OpenAI API
        const result = await callOpenAIGenerate(prompt, apiKey);
        console.log(`Style ${style.id} generation complete`);
        
        return {
          id: style.id,
          imageUrl: result
        };
      } catch (error) {
        console.error(`Error generating ${style.id} style:`, error);
        // Return an object with error information instead of null
        // This allows us to show error state in the UI for this style
        return {
          id: style.id,
          error: error.message || 'Generation failed'
        };
      }
    });

    // Wait for all promises to resolve, even those that failed
    const results = await Promise.allSettled(stylePromises);
    
    // Process the results
    const successfulStyles = results
      .filter(result => result.status === 'fulfilled' && result.value && result.value.imageUrl)
      .map(result => result.value);
      
    // Log how many styles were generated successfully
    console.log(`Successfully generated ${successfulStyles.length} out of ${STYLE_PROMPTS.length} styles`);
    
    if (successfulStyles.length === 0) {
      throw new Error('Failed to generate any styles. Please check your API key and try again.');
    }
    
    return successfulStyles;
  } catch (error) {
    console.error('Error in generateSpriteStyles:', error);
    throw error;
  }
}

// Generate sprite action
export async function generateSpriteAction(styleId, actionId, frameIndex = 0, isContinuation = frameIndex > 0, characterDescription = '') {
  try {
    const state = getState();
    const apiKey = state.apiKey;
    if (!apiKey) {
      throw new Error('Please enter your OpenAI API key');
    }

    // Debugging: log state information
    console.log('generateSpriteAction state info:', {
      styleId,
      actionId,
      frameIndex,
      isContinuation,
      isSequential: frameIndex > 0,
      hasGeneratedStyles: Array.isArray(state.generatedStyles),
      generatedStylesCount: state.generatedStyles?.length || 0,
      stylesGenerated: state.generatedStyles?.map(s => s.id) || [],
      existingFrames: state.generatedFrames?.[actionId]?.length || 0
    });
    
    // Since DALL-E 3 doesn't use input images, we work with text descriptions
    const charDesc = characterDescription || 'A character for a video game sprite';
    
    // Generate a unique reference token for this character
    const referenceToken = `CHAR_${Date.now().toString(36)}`;
    
    // Generate the prompt for the action with specific frame index and continuity flag
    const prompt = generateSpritePrompt(
      styleId, 
      actionId, 
      referenceToken, 
      charDesc, 
      frameIndex, 
      isContinuation
    );
    
    console.log(`Generating ${actionId} frame ${frameIndex+1} in ${styleId} style:`, {
      characterDescription: charDesc,
      isContinuation: isContinuation,
      isSequential: frameIndex > 0,
      promptLength: prompt.length
    });
    
    const result = await callOpenAIGenerate(prompt, apiKey);

    return {
      id: actionId,
      frameIndex: frameIndex,
      imageUrl: result,
      styleId: styleId
    };
  } catch (error) {
    console.error(`Error in generateSpriteAction for frame ${frameIndex+1}:`, error);
    throw error;
  }
}

// Helper function to convert a data URL to a File object with transparency preserved
export async function dataURLtoFile(dataUrl, filename) {
  try {
    // Validate the dataUrl format
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      console.error('Invalid data URL format:', dataUrl ? `${dataUrl.substring(0, 20)}...` : 'null or undefined');
      throw new Error('Invalid data URL format');
    }
    
    // For image data URLs, ensure proper transparency handling
    if (dataUrl.startsWith('data:image')) {
      // Create an Image element to load the data URL
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image from data URL'));
        img.src = dataUrl;
      });
      
      // Create a canvas with the same dimensions as the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image with transparency preserved
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG blob with transparency
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
            return;
          }
          
          const file = new File([blob], filename, { 
            type: 'image/png',
            lastModified: Date.now()
          });
          
          console.log('Data URL successfully converted to File with transparency:', {
            size: file.size,
            type: file.type,
            dimensions: `${img.width}x${img.height}`
          });
          
          resolve(file);
        }, 'image/png', 1.0);
      });
    }
    
    // Fallback for non-image data URLs
    console.log('Converting data URL to file using fetch API (fallback)');
    const res = await fetch(dataUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch data URL: ${res.status} ${res.statusText}`);
    }
    
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
  } catch (error) {
    console.error('Error converting data URL to file:', error);
    throw new Error(`Failed to convert image: ${error.message}`);
  }
} 