/**
 * IP-based rate limiter for API endpoints
 * Tracks request counts per IP address with automatic cleanup
 */

interface RateLimitEntry {
  count: number;
  resetTime: number; // Unix timestamp in milliseconds
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

// In-memory storage for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Clean up expired entries from the rate limit store
 * This prevents memory leaks from accumulating old IP addresses
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      expiredKeys.push(ip);
    }
  }

  expiredKeys.forEach(key => rateLimitStore.delete(key));
}

/**
 * Check and update rate limit for an IP address
 * @param ip - The IP address to check
 * @returns Rate limit result with success status and metadata
 */
export function checkRateLimit(ip: string): RateLimitResult {
  // Clean up expired entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No existing entry or entry has expired - create new one
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(ip, newEntry);

    return {
      success: true,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return {
      success: false,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count and allow request
  entry.count += 1;
  rateLimitStore.set(ip, entry);

  return {
    success: true,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get the client IP address from the request
 * Checks various headers in order of preference
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  // Check common headers for IP address (in order of preference)
  const ip = 
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-client-ip') ||
    'unknown';

  return ip;
}

/**
 * Format time remaining until reset
 * @param resetTime - Unix timestamp in milliseconds
 * @returns Human-readable time string
 */
export function getTimeUntilReset(resetTime: number): string {
  const now = Date.now();
  const diff = resetTime - now;

  if (diff <= 0) return '0 hours';

  const hours = Math.ceil(diff / (60 * 60 * 1000));
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}

