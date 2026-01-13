/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Generates and validates tokens to prevent unauthorized API requests
 */

import { randomBytes } from 'crypto';

// In-memory storage for CSRF tokens
// Maps token -> expiration timestamp
const csrfTokenStore = new Map<string, number>();

// Configuration
const CSRF_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const CSRF_TOKEN_LENGTH = 32; // bytes

/**
 * Generate a secure random CSRF token
 * @returns A hex-encoded random token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const expiryTime = Date.now() + CSRF_TOKEN_EXPIRY_MS;
  
  csrfTokenStore.set(token, expiryTime);
  
  // Clean up expired tokens periodically
  cleanupExpiredTokens();
  
  return token;
}

/**
 * Validate a CSRF token
 * @param token - The token to validate
 * @returns True if token is valid and not expired
 */
export function validateCsrfToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const expiryTime = csrfTokenStore.get(token);
  
  if (!expiryTime) {
    return false;
  }

  const now = Date.now();
  
  if (now > expiryTime) {
    // Token expired, remove it
    csrfTokenStore.delete(token);
    return false;
  }

  return true;
}

/**
 * Consume a CSRF token (one-time use)
 * After validation, the token is removed to prevent reuse
 * @param token - The token to consume
 * @returns True if token was valid and consumed
 */
export function consumeCsrfToken(token: string | null): boolean {
  if (!validateCsrfToken(token)) {
    return false;
  }

  // Remove token after successful validation (one-time use)
  csrfTokenStore.delete(token!);
  return true;
}

/**
 * Clean up expired tokens from storage
 * Prevents memory leaks from accumulating old tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  const expiredTokens: string[] = [];

  for (const [token, expiryTime] of csrfTokenStore.entries()) {
    if (now > expiryTime) {
      expiredTokens.push(token);
    }
  }

  expiredTokens.forEach(token => csrfTokenStore.delete(token));
}

/**
 * Validate request origin/referer headers
 * Ensures requests come from the same origin
 * @param request - The incoming request
 * @param allowedOrigins - Array of allowed origins (e.g., ['http://localhost:3000', 'https://yourdomain.com'])
 * @returns True if origin is valid
 */
export function validateOrigin(request: Request, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Check origin header first
  if (origin) {
    return allowedOrigins.some(allowed => origin === allowed);
  }

  // Fallback to referer header
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return allowedOrigins.some(allowed => refererOrigin === allowed);
    } catch {
      return false;
    }
  }

  // No origin or referer header - reject for safety
  return false;
}

