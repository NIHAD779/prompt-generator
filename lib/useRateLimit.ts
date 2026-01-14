'use client';

import { useState, useEffect, useCallback } from 'react';

interface RateLimitData {
  count: number;
  firstUsageTime: number;
}

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const STORAGE_KEY = 'healmyprompt_usage';
const MAX_REQUESTS = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Custom hook to manage rate limiting using localStorage
 * Enforces a limit of 3 requests per 24-hour window
 */
export function useRateLimit() {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus>({
    allowed: true,
    remaining: MAX_REQUESTS,
    resetTime: 0,
  });

  /**
   * Get rate limit data from localStorage
   */
  const getRateLimitData = useCallback((): RateLimitData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as RateLimitData;
    } catch (error) {
      console.error('Error reading rate limit data:', error);
      return null;
    }
  }, []);

  /**
   * Save rate limit data to localStorage
   */
  const saveRateLimitData = useCallback((data: RateLimitData): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving rate limit data:', error);
    }
  }, []);

  /**
   * Check if the user can generate a prompt
   * Returns status with allowed flag, remaining count, and reset time
   */
  const checkCanGenerate = useCallback((): RateLimitStatus => {
    const now = Date.now();
    const data = getRateLimitData();

    // No existing data - user can generate
    if (!data) {
      return {
        allowed: true,
        remaining: MAX_REQUESTS,
        resetTime: now + WINDOW_MS,
      };
    }

    // Check if the window has expired
    const windowExpired = now >= data.firstUsageTime + WINDOW_MS;
    
    if (windowExpired) {
      // Reset the counter
      return {
        allowed: true,
        remaining: MAX_REQUESTS,
        resetTime: now + WINDOW_MS,
      };
    }

    // Window is still active
    const resetTime = data.firstUsageTime + WINDOW_MS;
    const remaining = Math.max(0, MAX_REQUESTS - data.count);
    const allowed = data.count < MAX_REQUESTS;

    return {
      allowed,
      remaining,
      resetTime,
    };
  }, [getRateLimitData]);

  /**
   * Increment the usage count after a successful generation
   */
  const incrementUsage = useCallback((): void => {
    const now = Date.now();
    const data = getRateLimitData();

    if (!data) {
      // First usage
      const newData: RateLimitData = {
        count: 1,
        firstUsageTime: now,
      };
      saveRateLimitData(newData);
    } else {
      // Check if window has expired
      const windowExpired = now >= data.firstUsageTime + WINDOW_MS;
      
      if (windowExpired) {
        // Reset with new window
        const newData: RateLimitData = {
          count: 1,
          firstUsageTime: now,
        };
        saveRateLimitData(newData);
      } else {
        // Increment existing count
        const newData: RateLimitData = {
          count: data.count + 1,
          firstUsageTime: data.firstUsageTime,
        };
        saveRateLimitData(newData);
      }
    }

    // Update status after incrementing
    const newStatus = checkCanGenerate();
    setRateLimitStatus(newStatus);
  }, [getRateLimitData, saveRateLimitData, checkCanGenerate]);

  /**
   * Get human-readable time until reset
   */
  const getTimeUntilReset = useCallback((resetTime: number): string => {
    const now = Date.now();
    const diff = resetTime - now;

    if (diff <= 0) return '0 hours';

    const hours = Math.ceil(diff / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }, []);

  /**
   * Reset rate limit (useful for testing or admin purposes)
   */
  const resetRateLimit = useCallback((): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRateLimitStatus({
        allowed: true,
        remaining: MAX_REQUESTS,
        resetTime: 0,
      });
    } catch (error) {
      console.error('Error resetting rate limit:', error);
    }
  }, []);

  // Update status on mount and when localStorage might change
  useEffect(() => {
    const status = checkCanGenerate();
    setRateLimitStatus(status);
  }, [checkCanGenerate]);

  return {
    rateLimitStatus,
    checkCanGenerate,
    incrementUsage,
    getTimeUntilReset,
    resetRateLimit,
  };
}

