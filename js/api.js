import { getState } from './state.js';
import { generateSpritePrompt, SPRITE_SYSTEM_PRIMER, STYLE_PROMPTS } from './prompts.js';

/**
 * Calls OpenAI DALL-E 3 endpoint and returns a data URL.
 * Generates images from text prompts without requiring input images.
 */
export async function callDALLE3(prompt, apiKey = null) {
  const state = getState();
  
  // Use provided API key or fallback to DALL-E 3 specific key
  const key = apiKey || state.dalleApiKey;
  
  console.log('Calling DALL-E 3 API with:', {
    promptLength: prompt.length,
    hasApiKey: !!key
  });

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json'
      })
    });

    // More detailed error handling
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E 3 API error details:', errorData);
      throw new Error(errorData.error?.message || `API call failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Ensure we have the expected data structure
    if (!result.data || !result.data[0] || !result.data[0].b64_json) {
      console.error('Unexpected DALL-E 3 response format:', result);
      throw new Error('Invalid response format from DALL-E 3 API');
    }
    
    console.log('DALL-E 3 generation successful');
    return `data:image/png;base64,${result.data[0].b64_json}`;
  } catch (error) {
    console.error('Error in DALL-E 3 API call:', error);
    throw error;
  }
}

/**
 * Calls OpenAI Chat Completions API (GPT-4 mini) and returns text response.
 * Used for classification and chat functionality.
 */
export async function callOpenAIChat(prompt, model = 'gpt-4o-mini', apiKey = null) {
  const state = getState();
  
  // Use provided API key or fallback to GPT Image API key
  const key = apiKey || state.gptImageApiKey;
  
  console.log('Calling OpenAI Chat API with:', {
    model: model,
    promptLength: prompt.length,
    hasApiKey: !!key
  });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.1
      })
    });

    // More detailed error handling
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI Chat API error details:', errorData);
      throw new Error(errorData.error?.message || `API call failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Ensure we have the expected data structure
    if (!result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
      console.error('Unexpected Chat API response format:', result);
      throw new Error('Invalid response format from OpenAI Chat API');
    }
    
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI Chat API call:', error);
    throw error;
  }
}

/**
 * Calls OpenAI GPT-Image-1 endpoint and returns a data URL.
 * Edits images based on prompts and optional input images.
 */
export async function callOpenAIEdit(prompt, inputImage, apiKey) {
  const state = getState();
  
  // Use provided API key or fallback to GPT Image API key
  const key = apiKey || state.gptImageApiKey;
  
  console.log('Calling GPT-Image-1 API with:', {
    promptLength: prompt.length,
    hasInputImage: !!inputImage,
    hasApiKey: !!key
  });

  try {
    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('response_format', 'b64_json');
    
    if (inputImage) {
      formData.append('image', inputImage);
    }

    console.log('FormData prepared for GPT-Image-1');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`
      },
      body: formData
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

    // GPT-Image-1 uses input images, so we need the uploaded image file
    if (!imageFile) {
      throw new Error('Please upload an image to generate styles');
    }
    
    // Generate a unique reference token for this character
    const referenceToken = `CHAR_${Date.now().toString(36)}`;
    
    // Generate prompts for each style
    const stylePromises = STYLE_PROMPTS.map(async (style) => {
      try {
        // Generate the prompt for this style with character description
        const prompt = generateSpritePrompt(style.id, 'idle', referenceToken, characterDescription);
        console.log(`Generating style ${style.id} with prompt length ${prompt.length}`);
        
        // Call the OpenAI API with the input image
        const result = await callOpenAIEdit(prompt, imageFile, apiKey);
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
    
    // GPT-Image-1 uses input images, so we need to get the base image
    // Try to get the uploaded image or a generated style image
    let inputImage = null;
    if (state.uploadedImage) {
      // Convert data URL to file if needed
      if (typeof state.uploadedImage === 'string' && state.uploadedImage.startsWith('data:')) {
        inputImage = await dataURLtoFile(state.uploadedImage, 'input.png');
      } else {
        inputImage = state.uploadedImage;
      }
    } else if (state.generatedStyles && state.generatedStyles.length > 0) {
      // Find the style that matches the styleId
      const matchingStyle = state.generatedStyles.find(s => s.id === styleId);
      if (matchingStyle && matchingStyle.imageUrl) {
        inputImage = await dataURLtoFile(matchingStyle.imageUrl, 'style.png');
      }
    }
    
    if (!inputImage) {
      throw new Error('No input image available for sprite generation');
    }
    
    // Generate a unique reference token for this character
    const referenceToken = `CHAR_${Date.now().toString(36)}`;
    
    // Generate the prompt for the action with specific frame index and continuity flag
    const prompt = generateSpritePrompt(
      styleId, 
      actionId, 
      referenceToken, 
      characterDescription, 
      frameIndex, 
      isContinuation
    );
    
    console.log(`Generating ${actionId} frame ${frameIndex+1} in ${styleId} style:`, {
      characterDescription: characterDescription,
      isContinuation: isContinuation,
      isSequential: frameIndex > 0,
      promptLength: prompt.length,
      hasInputImage: !!inputImage
    });
    
    const result = await callOpenAIEdit(prompt, inputImage, apiKey);

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