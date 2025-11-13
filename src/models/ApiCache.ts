/**
 * API response cache entry
 */
export interface ApiCache {
  cacheKey: string; // Unique cache key (PK)
  data: unknown; // Cached response data (can be any JSON)
  cachedAt: Date;
  ttlSeconds: number; // Time to live in seconds
}

/**
 * Check if cache entry is expired
 */
export function isCacheExpired(cache: ApiCache): boolean {
  const expiresAt = new Date(cache.cachedAt.getTime() + cache.ttlSeconds * 1000);
  return new Date() > expiresAt;
}

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  FOOD_SEARCH: 86400, // 24 hours
  NUTRITION_DATA: 604800, // 7 days
  RECENT_FOODS: 2592000, // 30 days
  BARCODE_LOOKUP: 2592000, // 30 days
} as const;
