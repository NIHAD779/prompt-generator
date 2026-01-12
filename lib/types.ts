/**
 * TypeScript types and interfaces for the Prompt Generator application
 */

export interface GeneratePromptRequest {
  userInstructions: string;
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

