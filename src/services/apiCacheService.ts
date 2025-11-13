import { db } from './database';
import { ApiCache, CACHE_TTL, isCacheExpired } from '../models';

/**
 * API Cache Service
 * Manages cached API responses with TTL
 */
export class ApiCacheService {
  /**
   * Get cached data by key
   * Returns undefined if not found or expired
   */
  static async get<T = unknown>(cacheKey: string): Promise<T | undefined> {
    try {
      const cached = await db.apiCache.get(cacheKey);

      if (!cached) {
        return undefined;
      }

      if (isCacheExpired(cached)) {
        // Delete expired cache
        await this.delete(cacheKey);
        return undefined;
      }

      return cached.data as T;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return undefined;
    }
  }

  /**
   * Set cached data with TTL
   */
  static async set(
    cacheKey: string,
    data: unknown,
    ttlSeconds: number = CACHE_TTL.FOOD_SEARCH
  ): Promise<void> {
    try {
      const cacheEntry: ApiCache = {
        cacheKey,
        data,
        cachedAt: new Date(),
        ttlSeconds,
      };

      await db.apiCache.put(cacheEntry);
    } catch (error) {
      console.error('Failed to set cached data:', error);
      throw new Error('Failed to save cache');
    }
  }

  /**
   * Delete cached data by key
   */
  static async delete(cacheKey: string): Promise<void> {
    try {
      await db.apiCache.delete(cacheKey);
    } catch (error) {
      console.error('Failed to delete cached data:', error);
      // Don't throw - cache deletion is non-critical
    }
  }

  /**
   * Clear all cached data
   */
  static async clearAll(): Promise<void> {
    try {
      await db.apiCache.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw new Error('Failed to clear cache');
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpired(): Promise<number> {
    try {
      const allCache = await db.apiCache.toArray();
      const expiredKeys = allCache
        .filter((cache) => isCacheExpired(cache))
        .map((cache) => cache.cacheKey);

      if (expiredKeys.length > 0) {
        await db.apiCache.bulkDelete(expiredKeys);
      }

      return expiredKeys.length;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      return 0;
    }
  }

  /**
   * Check if cache key exists and is not expired
   */
  static async has(cacheKey: string): Promise<boolean> {
    try {
      const cached = await db.apiCache.get(cacheKey);
      return cached !== undefined && !isCacheExpired(cached);
    } catch (error) {
      console.error('Failed to check cache existence:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    expired: number;
    active: number;
  }> {
    try {
      const allCache = await db.apiCache.toArray();
      const expired = allCache.filter((cache) => isCacheExpired(cache)).length;

      return {
        total: allCache.length,
        expired,
        active: allCache.length - expired,
      };
    } catch (error) {
      console.error('Failed to get cache statistics:', error);
      return { total: 0, expired: 0, active: 0 };
    }
  }

  /**
   * Cache food search results
   */
  static async cacheSearchResults(query: string, results: unknown): Promise<void> {
    const cacheKey = `food_search_${query.toLowerCase()}`;
    await this.set(cacheKey, results, CACHE_TTL.FOOD_SEARCH);
  }

  /**
   * Get cached food search results
   */
  static async getCachedSearchResults<T = unknown>(query: string): Promise<T | undefined> {
    const cacheKey = `food_search_${query.toLowerCase()}`;
    return await this.get<T>(cacheKey);
  }

  /**
   * Cache barcode lookup result
   */
  static async cacheBarcodeLookup(barcode: string, result: unknown): Promise<void> {
    const cacheKey = `barcode_${barcode}`;
    await this.set(cacheKey, result, CACHE_TTL.BARCODE_LOOKUP);
  }

  /**
   * Get cached barcode lookup result
   */
  static async getCachedBarcodeLookup<T = unknown>(barcode: string): Promise<T | undefined> {
    const cacheKey = `barcode_${barcode}`;
    return await this.get<T>(cacheKey);
  }
}
