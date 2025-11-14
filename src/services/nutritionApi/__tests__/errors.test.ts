import {
  NutritionApiError,
  NetworkError,
  RateLimitError,
  ApiResponseError,
  NotFoundError,
  AuthenticationError,
  ValidationError,
  isRetryableError,
  getUserFriendlyMessage,
} from '../errors';

describe('Nutrition API Errors', () => {
  describe('NutritionApiError', () => {
    it('should create a base nutrition API error', () => {
      const error = new NutritionApiError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('NutritionApiError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should include original error if provided', () => {
      const originalError = new Error('Original error');
      const error = new NutritionApiError('Test error', 'TEST_CODE', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('NetworkError', () => {
    it('should create a network error', () => {
      const error = new NetworkError('Network failed');
      expect(error.message).toBe('Network failed');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.name).toBe('NetworkError');
      expect(error).toBeInstanceOf(NutritionApiError);
    });

    it('should include original error', () => {
      const originalError = new Error('Connection timeout');
      const error = new NetworkError('Network failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error', () => {
      const error = new RateLimitError('Too many requests', 60);
      expect(error.message).toBe('Too many requests');
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.name).toBe('RateLimitError');
      expect(error.retryAfter).toBe(60);
    });

    it('should work without retry after', () => {
      const error = new RateLimitError('Too many requests');
      expect(error.retryAfter).toBeUndefined();
    });
  });

  describe('ApiResponseError', () => {
    it('should create an API response error', () => {
      const error = new ApiResponseError('API failed', 500, 'Internal Server Error');
      expect(error.message).toBe('API failed');
      expect(error.code).toBe('API_RESPONSE_ERROR');
      expect(error.name).toBe('ApiResponseError');
      expect(error.statusCode).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error', () => {
      const error = new NotFoundError('Resource not found', '12345');
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('NotFoundError');
      expect(error.resourceId).toBe('12345');
    });
  });

  describe('AuthenticationError', () => {
    it('should create an authentication error', () => {
      const error = new AuthenticationError('Invalid API key');
      expect(error.message).toBe('Invalid API key');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.name).toBe('AuthenticationError');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error', () => {
      const validationErrors = { query: 'Required', page: 'Must be positive' };
      const error = new ValidationError('Validation failed', validationErrors);
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
      expect(error.validationErrors).toEqual(validationErrors);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for network errors', () => {
      const error = new NetworkError('Network failed');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for 5xx API response errors', () => {
      const error = new ApiResponseError('Server error', 500, 'Internal Server Error');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for 429 rate limit errors', () => {
      const error = new ApiResponseError('Rate limited', 429, 'Too Many Requests');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for 4xx client errors (except 429)', () => {
      const error = new ApiResponseError('Bad request', 400, 'Bad Request');
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for not found errors', () => {
      const error = new NotFoundError('Not found', '123');
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for authentication errors', () => {
      const error = new AuthenticationError('Invalid key');
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for generic errors', () => {
      const error = new Error('Generic error');
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for network errors', () => {
      const error = new NetworkError('Network failed');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('internet connection');
    });

    it('should return friendly message for rate limit errors', () => {
      const error = new RateLimitError('Too many requests');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('Too many requests');
    });

    it('should return friendly message for not found errors', () => {
      const error = new NotFoundError('Not found', '123');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('not found');
    });

    it('should return friendly message for authentication errors', () => {
      const error = new AuthenticationError('Invalid key');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('authenticate');
    });

    it('should return friendly message for validation errors', () => {
      const error = new ValidationError('Invalid params', {});
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('Invalid search parameters');
    });

    it('should return friendly message for 404 API errors', () => {
      const error = new ApiResponseError('Not found', 404, 'Not Found');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('not found');
    });

    it('should return friendly message for 5xx API errors', () => {
      const error = new ApiResponseError('Server error', 500, 'Internal Server Error');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('temporarily unavailable');
    });

    it('should return friendly message for generic API errors', () => {
      const error = new ApiResponseError('Error', 400, 'Bad Request');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('error occurred');
    });

    it('should return friendly message for unknown errors', () => {
      const error = new Error('Unknown error');
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('unexpected error');
    });
  });
});
