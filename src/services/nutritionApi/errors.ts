/**
 * Nutrition API Error Types
 *
 * Standardized error handling for all nutrition API services.
 */

/**
 * Base error class for all nutrition API errors
 */
export class NutritionApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NutritionApiError';
    Object.setPrototypeOf(this, NutritionApiError.prototype);
  }
}

/**
 * Network-related errors (connection failures, timeouts)
 */
export class NetworkError extends NutritionApiError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', originalError);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * API rate limit exceeded
 */
export class RateLimitError extends NutritionApiError {
  constructor(
    message: string,
    public retryAfter?: number // seconds until retry allowed
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * API returned an error response (4xx, 5xx)
 */
export class ApiResponseError extends NutritionApiError {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string
  ) {
    super(message, 'API_RESPONSE_ERROR');
    this.name = 'ApiResponseError';
    Object.setPrototypeOf(this, ApiResponseError.prototype);
  }
}

/**
 * Resource not found (404)
 */
export class NotFoundError extends NutritionApiError {
  constructor(
    message: string,
    public resourceId: string
  ) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Invalid API key or authentication failure
 */
export class AuthenticationError extends NutritionApiError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Invalid request parameters
 */
export class ValidationError extends NutritionApiError {
  constructor(
    message: string,
    public validationErrors: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Check if error is retryable (temporary failures)
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof ApiResponseError) {
    // Retry on 5xx server errors and 429 rate limit
    return error.statusCode >= 500 || error.statusCode === 429;
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect to the nutrition database. Please check your internet connection.';
  }

  if (error instanceof RateLimitError) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error instanceof NotFoundError) {
    return 'Food item not found in the database.';
  }

  if (error instanceof AuthenticationError) {
    return 'Unable to authenticate with the nutrition database. Please try again later.';
  }

  if (error instanceof ValidationError) {
    return 'Invalid search parameters. Please try a different search.';
  }

  if (error instanceof ApiResponseError) {
    if (error.statusCode === 404) {
      return 'Resource not found.';
    }
    if (error.statusCode >= 500) {
      return 'The nutrition database is temporarily unavailable. Please try again later.';
    }
    return 'An error occurred while fetching nutrition data.';
  }

  return 'An unexpected error occurred. Please try again.';
}
