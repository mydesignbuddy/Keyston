import { withRetry, createRetryWrapper, DEFAULT_RETRY_CONFIG } from '../retryHandler';
import { NetworkError, ApiResponseError } from '../errors';

describe('Retry Handler', () => {
  describe('withRetry', () => {
    it('should return result on first attempt if successful', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await withRetry(fn, {
        ...DEFAULT_RETRY_CONFIG,
        initialDelayMs: 1, // Use very short delays for testing
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable error and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError('Network failed'))
        .mockResolvedValueOnce('success');

      const result = await withRetry(fn, {
        ...DEFAULT_RETRY_CONFIG,
        initialDelayMs: 1,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should retry up to maxAttempts times', async () => {
      const fn = jest.fn().mockRejectedValue(new NetworkError('Network failed'));

      await expect(
        withRetry(fn, {
          maxAttempts: 3,
          initialDelayMs: 1,
          maxDelayMs: 10,
          backoffMultiplier: 2,
        })
      ).rejects.toThrow('Network failed');

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable error', async () => {
      const error = new Error('Non-retryable error');
      const fn = jest.fn().mockRejectedValue(error);

      await expect(withRetry(fn)).rejects.toThrow('Non-retryable error');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on 5xx API response errors', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new ApiResponseError('Server error', 500, 'Internal Server Error'))
        .mockResolvedValueOnce('success');

      const result = await withRetry(fn, {
        ...DEFAULT_RETRY_CONFIG,
        initialDelayMs: 1,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use default config if not provided', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await withRetry(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('createRetryWrapper', () => {
    it('should create a wrapped function with retry logic', async () => {
      const originalFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = createRetryWrapper(originalFn);

      const result = await wrappedFn('arg1', 'arg2');

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should retry wrapped function on failure', async () => {
      const originalFn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError('Network failed'))
        .mockResolvedValueOnce('success');

      const wrappedFn = createRetryWrapper(originalFn, {
        ...DEFAULT_RETRY_CONFIG,
        initialDelayMs: 1,
      });

      const result = await wrappedFn();

      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledTimes(2);
    });

    it('should pass custom config to wrapped function', async () => {
      const originalFn = jest.fn().mockRejectedValue(new NetworkError('Network failed'));
      const config = {
        maxAttempts: 2,
        initialDelayMs: 1,
        maxDelayMs: 10,
        backoffMultiplier: 2,
      };

      const wrappedFn = createRetryWrapper(originalFn, config);

      await expect(wrappedFn()).rejects.toThrow();
      expect(originalFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('DEFAULT_RETRY_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBe(3);
      expect(DEFAULT_RETRY_CONFIG.initialDelayMs).toBe(1000);
      expect(DEFAULT_RETRY_CONFIG.maxDelayMs).toBe(10000);
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
    });
  });
});
