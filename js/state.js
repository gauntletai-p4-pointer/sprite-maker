import { config } from './config.js';

// Global state management
let state = {
  dalleApiKey: config.DALL_E_3_API_KEY || '',
  gptImageApiKey: config.GPT_IMAGE_1_API_KEY || '',
  apiKey: config.GPT_IMAGE_1_API_KEY || '', // Backward compatibility
  uploadedImage: null,
  selectedStyle: null,
  selectedAction: null,
  generatedStyles: [],
  generatedFrames: [],
  currentReferenceToken: null,
  selectedModel: 'gpt-image-1' // Set default model
};

// Constants
const STORAGE_KEYS = {
  API_KEY: 'openai_api_key'
};

export function getState() {
  return state;
}

export function updateState(newState) {
  state = { ...state, ...newState };
  
  // Persist API key to localStorage if it's being updated
  if (newState.apiKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, newState.apiKey);
  }
  
  updateUIState();
}

// Update UI elements based on state
export function updateUIState() {
  const apiKeyInput = document.getElementById('apiKey');
  if (apiKeyInput && state.apiKey) {
    apiKeyInput.value = state.apiKey;
  }
}

// Initialize state from config
document.addEventListener('DOMContentLoaded', () => {
  // Load API keys from environment config
  if (config.DALL_E_3_API_KEY && config.GPT_IMAGE_1_API_KEY) {
    updateState({ 
      dalleApiKey: config.DALL_E_3_API_KEY,
      gptImageApiKey: config.GPT_IMAGE_1_API_KEY,
      apiKey: config.GPT_IMAGE_1_API_KEY // Backward compatibility
    });
    console.log('API keys loaded from environment configuration');
  } else {
    console.warn('Missing API keys in environment configuration:', {
      hasDalleKey: !!config.DALL_E_3_API_KEY,
      hasGptImageKey: !!config.GPT_IMAGE_1_API_KEY
    });
  }
});

// Local storage management
export const storage = {
  getApiKey: () => localStorage.getItem(STORAGE_KEYS.API_KEY),
  setApiKey: (key) => localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim()),
};

// State updates
export function updateSourceImage(file) {
  state.sourceImageFile = file;
}

export function updateChosenStyle(style) {
  state.chosenStyle = style;
}

export function resetStyleChoice() {
  state.chosenStyle = null;
} 