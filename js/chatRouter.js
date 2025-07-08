/**
 * Chat Router Module
 * Handles routing user chat messages to appropriate actions using GPT-4.1 mini classification
 */

import { callOpenAIChat } from './api.js';

// Simple keyword-to-integer mapping for request categories
const REQUEST_CATEGORIES = {
  character: 0,
  idle: 1,
  walk: 2,
  jump: 3,
  air_attack: 4,
  hurt: 5,
  knock_out: 6,
  punches: 7,
  turn_around: 8,
  unknown: 9
};

// Reverse mapping for category lookup
const CATEGORY_NAMES = Object.keys(REQUEST_CATEGORIES);

// Examples for classification prompt
const CLASSIFICATION_EXAMPLES = [
  // Character generation examples
  { text: "Create a wizard character", category: "character" },
  { text: "Generate a knight sprite", category: "character" },
  { text: "Make a cyberpunk hacker", category: "character" },
  { text: "Design a forest elf", category: "character" },
  
  // Animation examples
  { text: "Make an idle animation", category: "idle" },
  { text: "Create a walking cycle", category: "walk" },
  { text: "Generate a jump animation", category: "jump" },
  { text: "Make an air attack", category: "air_attack" },
  { text: "Create a hurt animation", category: "hurt" },
  { text: "Generate a knockout sequence", category: "knock_out" },
  { text: "Make a punch combo", category: "punches" },
  { text: "Create a turn around animation", category: "turn_around" },
  
  // Unknown examples
  { text: "How does this work?", category: "unknown" },
  { text: "What can you do?", category: "unknown" },
  { text: "Help me understand", category: "unknown" }
];

/**
 * Routes user messages to appropriate functions based on content classification
 * @param {string} userMessage - The user's chat message
 * @returns {Promise<string>} - The category key or 'unknown' if classification fails
 */
export async function routeUserMessage(userMessage) {
  console.log('🚀 Starting message routing process');
  console.log('📝 User message:', userMessage);
  
  try {
    // Step 1: Classify the message using GPT-4.1 mini
    console.log('🔍 Step 1: Classifying message with GPT-4.1 mini');
    const category = await classifyMessage(userMessage);
    console.log('✅ Classification result:', category);
    
    // Step 2: Route to appropriate function
    console.log('🎯 Step 2: Routing to appropriate function');
    const result = await executeRouting(category, userMessage);
    console.log('✅ Routing completed successfully');
    
    return result;
  } catch (error) {
    console.error('❌ Error in routing process:', error);
    return 'unknown';
  }
}

/**
 * Classifies user message using GPT-4.1 mini
 * @param {string} message - User's message to classify
 * @returns {Promise<string>} - Category key
 */
async function classifyMessage(message) {
  console.log('🧠 Sending classification request to GPT-4.1 mini');
  
  const exampleText = CLASSIFICATION_EXAMPLES.map(ex => 
    `"${ex.text}" → ${ex.category}`
  ).join('\n');
  
  const classificationPrompt = `
You are a chat message classifier for a sprite generation application.
Analyze the user's message and determine which category it belongs to.

Available categories: ${CATEGORY_NAMES.join(', ')}

Examples:
${exampleText}

User message: "${message}"

Respond with ONLY the category keyword (like "character" or "walk").
If the message doesn't clearly fit any category, respond with "unknown".
`;

  try {
    const response = await callOpenAIChat(classificationPrompt, 'gpt-4o-mini');
    console.log('📤 GPT-4.1 mini raw response:', response);
    
    // Clean up the response and validate it
    const cleanCategory = response.trim().toLowerCase();
    console.log('🧹 Cleaned category:', cleanCategory);
    
    // Validate that the category exists
    if (REQUEST_CATEGORIES.hasOwnProperty(cleanCategory)) {
      console.log('✅ Valid category found:', cleanCategory, '→', REQUEST_CATEGORIES[cleanCategory]);
      return cleanCategory;
    } else {
      console.log('❌ Invalid category returned, defaulting to unknown');
      return 'unknown';
    }
  } catch (error) {
    console.error('❌ Error calling GPT-4.1 mini for classification:', error);
    return 'unknown';
  }
}

/**
 * Executes the routing based on classified category
 * @param {string} category - The classified category
 * @param {string} originalMessage - The original user message
 * @returns {Promise<string>} - Result of the routing
 */
async function executeRouting(category, originalMessage) {
  console.log('🎯 Executing routing for category:', category, '(ID:', REQUEST_CATEGORIES[category], ')');
  console.log('📝 Original message:', originalMessage);
  
  switch (category) {
    case 'character':
      return await handleCharacterGeneration(originalMessage);
    case 'idle':
      return await handleIdleAnimation(originalMessage);
    case 'walk':
      return await handleWalkAnimation(originalMessage);
    case 'jump':
      return await handleJumpAnimation(originalMessage);
    case 'air_attack':
      return await handleAirAttackAnimation(originalMessage);
    case 'hurt':
      return await handleHurtAnimation(originalMessage);
    case 'knock_out':
      return await handleKnockoutAnimation(originalMessage);
    case 'punches':
      return await handlePunchAnimation(originalMessage);
    case 'turn_around':
      return await handleTurnAroundAnimation(originalMessage);
    case 'unknown':
    default:
      return await handleUnknownRequest(originalMessage);
  }
}

// Stub functions for each category (to be implemented later)

async function handleCharacterGeneration(message) {
  console.log('🎨 STUB: handleCharacterGeneration called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate a new character using DALL-E 3');
  return 'character_generation';
}

async function handleIdleAnimation(message) {
  console.log('🧍 STUB: handleIdleAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate idle animation frames');
  return 'idle';
}

async function handleWalkAnimation(message) {
  console.log('🚶 STUB: handleWalkAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate walking animation frames');
  return 'walk';
}

async function handleJumpAnimation(message) {
  console.log('🦘 STUB: handleJumpAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate jumping animation frames');
  return 'jump';
}

async function handleAirAttackAnimation(message) {
  console.log('✈️ STUB: handleAirAttackAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate air attack animation frames');
  return 'air_attack';
}

async function handleHurtAnimation(message) {
  console.log('😵 STUB: handleHurtAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate hurt animation frames');
  return 'hurt';
}

async function handleKnockoutAnimation(message) {
  console.log('💥 STUB: handleKnockoutAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate knockout animation frames');
  return 'knock_out';
}

async function handlePunchAnimation(message) {
  console.log('👊 STUB: handlePunchAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate punch animation frames');
  return 'punches';
}

async function handleTurnAroundAnimation(message) {
  console.log('🔄 STUB: handleTurnAroundAnimation called');
  console.log('📝 Message:', message);
  console.log('🔄 This will generate turn around animation frames');
  return 'turn_around';
}

async function handleUnknownRequest(message) {
  console.log('❓ STUB: handleUnknownRequest called');
  console.log('📝 Message:', message);
  console.log('🔄 This will provide help or clarification');
  return 'unknown';
}

// Export the categories for use in other modules
export { REQUEST_CATEGORIES }; 