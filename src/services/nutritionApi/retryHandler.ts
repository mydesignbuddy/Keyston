/**
 * Retry Handler for Nutrition API Calls
 *
 * Implements exponential backoff retry logic for transient failures.
 */

import { isRetryableError } from './errors';

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number; // Maximum number of retry attempts
  initialDelayMs: number; // Initial delay before first retry
  maxDelayMs: number; // Maximum delay between retries
  backoffMultiplier: number; // Multiplier for exponential backoff
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay for next retry using exponential backoff
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Execute function with retry logic
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @returns Result of the function execution
 * @throws Last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if error is not retryable
      if (!isRetryableError(lastError)) {
        throw lastError;
      }

      // Don't retry if this was the last attempt
      if (attempt === config.maxAttempts) {
        throw lastError;
      }

      // Calculate delay and wait before retry
      const delay = calculateDelay(attempt, config);
      // eslint-disable-next-line no-console
      console.log(`[RetryHandler] Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error during retry');
}

/**
 * Create a retry wrapper for a function
 *
 * @param fn - Function to wrap with retry logic
 * @param config - Retry configuration
 * @returns Wrapped function with retry logic
 */
export function createRetryWrapper<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): (...args: T) => Promise<R> {
  return (...args: T) => withRetry(() => fn(...args), config);
}
