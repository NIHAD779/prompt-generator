/**
 * TypeScript types and interfaces for the HealMyPrompt application
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
  resetTime?: number; // For rate limit errors
  remaining?: number; // For rate limit info
}

export interface ApiError {
  error: string;
  details?: string;
  resetTime?: number; // For rate limit errors
  remaining?: number; // For rate limit info
}

export interface CsrfTokenResponse {
  token: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  userInstructions: string;
  selectedFeatures: string[];
}

