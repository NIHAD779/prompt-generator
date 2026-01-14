import { NextRequest, NextResponse } from 'next/server';
import { logEmailRequest } from '@/lib/google-sheets';
import { getClientIp } from '@/lib/rate-limiter';
// import { validateOrigin } from '@/lib/csrf';

interface AccessRequest {
  email: string;
  timestamp: number;
}

// In-memory storage for access requests
// In production, you'd want to store this in a database
const accessRequests: AccessRequest[] = [];

/**
 * POST /api/request-access
 * Handles user requests for increased API access
 */
export async function POST(request: NextRequest) {
  try {
    // Validate origin
    // TODO: Uncomment when NEXT_PUBLIC_APP_URL is configured in deployment
    // const allowedOrigins = [
    //   process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    //   'http://localhost:3000',
    // ];

    // if (!validateOrigin(request, allowedOrigins)) {
    //   return NextResponse.json(
    //     { error: 'Invalid request origin' },
    //     { status: 403 }
    //   );
    // }

    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const clientIp = getClientIp(request);

    // Store the access request
    const accessRequest: AccessRequest = {
      email: email.toLowerCase().trim(),
      timestamp: Date.now(),
    };

    accessRequests.push(accessRequest);

    // Log to console (in production, you'd save to database and/or send notification)
    console.log('📧 New access request:', accessRequest);
    console.log(`Total access requests: ${accessRequests.length}`);

    // Log to Google Sheets (fire-and-forget, non-blocking)
    logEmailRequest(
      email.toLowerCase().trim(),
      clientIp
    ).catch((error) => {
      console.error('Failed to log email request to Google Sheets:', error);
    });

    // TODO: In production, you might want to:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user
    // 4. Integrate with CRM or email marketing tool

    return NextResponse.json(
      { 
        success: true,
        message: 'Access request received successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing access request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/request-access
 * Returns all access requests (for admin use)
 * In production, this should be protected with authentication
 */
export async function GET() {
  // TODO: Add authentication check here in production
  
  return NextResponse.json(
    { 
      requests: accessRequests,
      total: accessRequests.length
    },
    { status: 200 }
  );
}

