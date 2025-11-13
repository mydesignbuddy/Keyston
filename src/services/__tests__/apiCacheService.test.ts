import { db } from '../database';
import { ApiCacheService } from '../apiCacheService';
import { CACHE_TTL } from '../../models';

describe('ApiCacheService', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(async () => {
    await db.delete();
  });

  describe('set and get', () => {
    it('should cache and retrieve data', async () => {
      const data = { name: 'Apple', calories: 95 };
      await ApiCacheService.set('food_apple', data, CACHE_TTL.FOOD_SEARCH);

      const cached = await ApiCacheService.get('food_apple');
      expect(cached).toEqual(data);
    });

    it('should return undefined for non-existent key', async () => {
      const cached = await ApiCacheService.get('non_existent');
      expect(cached).toBeUndefined();
    });

    it('should return undefined for expired cache', async () => {
      const data = { name: 'Apple' };
      // Set with 0 second TTL (already expired)
      await ApiCacheService.set('food_apple', data, 0);

      const cached = await ApiCacheService.get('food_apple');
      expect(cached).toBeUndefined();
    });

    it('should auto-delete expired cache on get', async () => {
      await ApiCacheService.set('food_apple', { name: 'Apple' }, 0);
      await ApiCacheService.get('food_apple');

      const exists = await ApiCacheService.has('food_apple');
      expect(exists).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete cached data', async () => {
      await ApiCacheService.set('food_apple', { name: 'Apple' }, 3600);
      await ApiCacheService.delete('food_apple');

      const cached = await ApiCacheService.get('food_apple');
      expect(cached).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('should clear all cached data', async () => {
      await ApiCacheService.set('key1', { data: 1 }, 3600);
      await ApiCacheService.set('key2', { data: 2 }, 3600);
      await ApiCacheService.set('key3', { data: 3 }, 3600);

      await ApiCacheService.clearAll();

      const count = await db.apiCache.count();
      expect(count).toBe(0);
    });
  });

  describe('clearExpired', () => {
    it('should clear only expired cache entries', async () => {
      await ApiCacheService.set('key1', { data: 1 }, 0); // Expired
      await ApiCacheService.set('key2', { data: 2 }, 3600); // Active
      await ApiCacheService.set('key3', { data: 3 }, 0); // Expired

      const cleared = await ApiCacheService.clearExpired();
      expect(cleared).toBe(2);

      const count = await db.apiCache.count();
      expect(count).toBe(1);

      const active = await ApiCacheService.get('key2');
      expect(active).toEqual({ data: 2 });
    });

    it('should return 0 when no expired entries', async () => {
      await ApiCacheService.set('key1', { data: 1 }, 3600);

      const cleared = await ApiCacheService.clearExpired();
      expect(cleared).toBe(0);
    });
  });

  describe('has', () => {
    it('should return true for active cache', async () => {
      await ApiCacheService.set('key1', { data: 1 }, 3600);

      const exists = await ApiCacheService.has('key1');
      expect(exists).toBe(true);
    });

    it('should return false for expired cache', async () => {
      // Set cache with -1 second TTL (already expired in the past)
      const cache = {
        cacheKey: 'key1',
        data: { data: 1 },
        cachedAt: new Date(Date.now() - 2000), // 2 seconds ago
        ttlSeconds: 1, // 1 second TTL
      };
      await db.apiCache.put(cache);

      const exists = await ApiCacheService.has('key1');
      expect(exists).toBe(false);
    });

    it('should return false for non-existent key', async () => {
      const exists = await ApiCacheService.has('non_existent');
      expect(exists).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should return cache statistics', async () => {
      await ApiCacheService.set('key1', { data: 1 }, 3600); // Active
      await ApiCacheService.set('key2', { data: 2 }, 0); // Expired
      await ApiCacheService.set('key3', { data: 3 }, 3600); // Active

      const stats = await ApiCacheService.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.expired).toBe(1);
      expect(stats.active).toBe(2);
    });

    it('should return zeros for empty cache', async () => {
      const stats = await ApiCacheService.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.expired).toBe(0);
      expect(stats.active).toBe(0);
    });
  });

  describe('cacheSearchResults and getCachedSearchResults', () => {
    it('should cache and retrieve search results', async () => {
      const results = [
        { name: 'Apple', calories: 95 },
        { name: 'Banana', calories: 105 },
      ];

      await ApiCacheService.cacheSearchResults('apple', results);

      const cached = await ApiCacheService.getCachedSearchResults('apple');
      expect(cached).toEqual(results);
    });

    it('should be case-insensitive for queries', async () => {
      const results = [{ name: 'Apple' }];

      await ApiCacheService.cacheSearchResults('APPLE', results);

      const cached = await ApiCacheService.getCachedSearchResults('apple');
      expect(cached).toEqual(results);
    });
  });

  describe('cacheBarcodeLookup and getCachedBarcodeLookup', () => {
    it('should cache and retrieve barcode lookups', async () => {
      const result = { name: 'Product', barcode: '123456789' };

      await ApiCacheService.cacheBarcodeLookup('123456789', result);

      const cached = await ApiCacheService.getCachedBarcodeLookup('123456789');
      expect(cached).toEqual(result);
    });
  });
});
