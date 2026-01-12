/**
 * TypeScript types and interfaces for the Prompt Generator application
 */

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  promptText: string; // Text to add to the prompt when selected
}

export interface GeneratePromptRequest {
  userInstructions: string;
  selectedFeatures?: string[];
}

export interface GeneratePromptResponse {
  success: boolean;
  generatedPrompt?: string;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

