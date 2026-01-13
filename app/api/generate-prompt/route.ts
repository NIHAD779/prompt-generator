import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptGuidelines } from '@/lib/prompt-guidelines';
import { getPromptTextForFeatures } from '@/lib/features';
import type { GeneratePromptRequest, GeneratePromptResponse, ApiError } from '@/lib/types';
import { checkRateLimit, getClientIp, getTimeUntilReset } from '@/lib/rate-limiter';
import { consumeCsrfToken, validateOrigin } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate Origin/Referer (CSRF Protection)
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'http://localhost:3000', // Always allow localhost for development
    ];

    if (!validateOrigin(request, allowedOrigins)) {
      const errorResponse: ApiError = {
        error: 'Invalid request origin',
        details: 'This API endpoint can only be accessed from the application',
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // 2. Validate CSRF Token
    const csrfToken = request.headers.get('x-csrf-token');
    if (!consumeCsrfToken(csrfToken)) {
      const errorResponse: ApiError = {
        error: 'Invalid or expired CSRF token',
        details: 'Please refresh the page and try again',
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // 3. Check Rate Limit (IP-based)
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.success) {
      const timeRemaining = getTimeUntilReset(rateLimitResult.resetTime);
      const errorResponse: ApiError = {
        error: 'Daily limit reached',
        details: `You have reached the maximum of ${rateLimitResult.limit} requests per day. Please try again in ${timeRemaining}.`,
        resetTime: rateLimitResult.resetTime,
        remaining: rateLimitResult.remaining,
      };
      return NextResponse.json(errorResponse, { status: 429 });
    }

    // Parse request body
    const body: GeneratePromptRequest = await request.json();
    const { userInstructions, selectedFeatures = [] } = body;

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

    // Initialize OpenAI client (after checking API key exists)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get prompt guidelines
    const guidelines = getPromptGuidelines();

    // Build user prompt with selected features
    let userPrompt = userInstructions;
    
    // If features are selected, prepend them to the user instructions
    if (selectedFeatures.length > 0) {
      const featurePromptText = getPromptTextForFeatures(selectedFeatures);
      userPrompt = `Required Features to Include:\n\n${featurePromptText}\n\n---\n\nUser Instructions:\n\n${userInstructions}`;
    }

    // Combine guidelines with user instructions
    const systemPrompt = guidelines;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
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

    // Return success response with rate limit headers
    const response: GeneratePromptResponse = {
      success: true,
      generatedPrompt,
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });
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

