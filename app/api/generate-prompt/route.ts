import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptGuidelines } from '@/lib/prompt-guidelines';
import type { GeneratePromptRequest, GeneratePromptResponse, ApiError } from '@/lib/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GeneratePromptRequest = await request.json();
    const { userInstructions } = body;

    // Validate input
    if (!userInstructions || userInstructions.trim().length === 0) {
      const errorResponse: ApiError = {
        error: 'User instructions are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (userInstructions.length > 5000) {
      const errorResponse: ApiError = {
        error: 'User instructions are too long (max 5000 characters)',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      const errorResponse: ApiError = {
        error: 'OpenAI API key is not configured',
        details: 'Please set OPENAI_API_KEY in your environment variables',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Get prompt guidelines
    const guidelines = getPromptGuidelines();

    // Combine guidelines with user instructions
    const systemPrompt = guidelines;
    const userPrompt = userInstructions;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Using GPT-4 Turbo which is the latest stable version
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract generated prompt
    const generatedPrompt = completion.choices[0]?.message?.content;

    if (!generatedPrompt) {
      const errorResponse: ApiError = {
        error: 'Failed to generate prompt',
        details: 'OpenAI did not return a valid response',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return success response
    const response: GeneratePromptResponse = {
      success: true,
      generatedPrompt,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating prompt:', error);

    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      const errorResponse: ApiError = {
        error: 'OpenAI API error',
        details: error.message,
      };
      return NextResponse.json(errorResponse, { status: error.status || 500 });
    }

    // Handle other errors
    const errorResponse: ApiError = {
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

