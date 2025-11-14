/**
 * Unified Nutrition API Client
 *
 * Provides a single interface for searching foods and looking up nutrition data
 * across multiple nutrition databases (USDA FoodData Central, Open Food Facts).
 *
 * This client handles:
 * - Unified search across multiple sources
 * - Automatic retry for transient failures
 * - Result merging and deduplication
 * - Error handling and user-friendly messages
 * - Caching strategy
 */

import { FoodSearchResult } from '../../models';
import { UsdaApiService } from './usdaApiService';
import { OpenFoodFactsApiService } from './openFoodFactsApiService';
import { withRetry, DEFAULT_RETRY_CONFIG, RetryConfig } from './retryHandler';
import { NutritionApiError, NetworkError, NotFoundError, getUserFriendlyMessage } from './errors';

/**
 * Nutrition API data source
 */
export type NutritionApiSource = 'usda' | 'openfoodfacts' | 'all';

/**
 * Search options
 */
export interface SearchOptions {
  pageSize?: number;
  page?: number;
  sources?: NutritionApiSource[]; // Which APIs to search (default: all)
  retryConfig?: RetryConfig; // Custom retry configuration
}

/**
 * Unified Nutrition API Client
 */
export class NutritionApiClient {
  /**
   * Search foods across multiple nutrition databases
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Combined array of food search results from all sources
   */
  static async searchFoods(
    query: string,
    options: SearchOptions = {}
  ): Promise<FoodSearchResult[]> {
    const {
      pageSize = 25,
      page = 1,
      sources = ['usda', 'openfoodfacts'],
      retryConfig = DEFAULT_RETRY_CONFIG,
    } = options;

    if (!query || query.trim().length === 0) {
      throw new NutritionApiError('Search query cannot be empty', 'VALIDATION_ERROR');
    }

    const promises: Promise<FoodSearchResult[]>[] = [];

    // Search USDA if requested
    if (sources.includes('usda') || sources.includes('all')) {
      promises.push(
        withRetry(
          () =>
            UsdaApiService.searchFoods(query, {
              pageSize,
              pageNumber: page,
            }),
          retryConfig
        ).catch((error) => {
          console.error('[NutritionApiClient] USDA search failed:', error);
          // Return empty array on error to allow other sources to succeed
          return [];
        })
      );
    }

    // Search Open Food Facts if requested
    if (sources.includes('openfoodfacts') || sources.includes('all')) {
      promises.push(
        withRetry(
          () =>
            OpenFoodFactsApiService.searchFoods(query, {
              pageSize,
              page,
            }),
          retryConfig
        ).catch((error) => {
          console.error('[NutritionApiClient] Open Food Facts search failed:', error);
          // Return empty array on error to allow other sources to succeed
          return [];
        })
      );
    }

    try {
      // Wait for all searches to complete
      const results = await Promise.all(promises);

      // Merge and deduplicate results
      const mergedResults = this.mergeResults(results);

      // Sort by relevance (basic: prioritize exact matches)
      return this.sortByRelevance(mergedResults, query);
    } catch (error) {
      console.error('[NutritionApiClient] Search failed:', error);
      throw new NetworkError('Failed to search nutrition databases', error as Error);
    }
  }

  /**
   * Get food by barcode (uses Open Food Facts)
   *
   * @param barcode - Product barcode (UPC/EAN)
   * @returns Food search result or null if not found
   */
  static async getFoodByBarcode(
    barcode: string,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<FoodSearchResult | null> {
    if (!barcode || barcode.trim().length === 0) {
      throw new NutritionApiError('Barcode cannot be empty', 'VALIDATION_ERROR');
    }

    try {
      return await withRetry(() => OpenFoodFactsApiService.getFoodByBarcode(barcode), retryConfig);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      console.error('[NutritionApiClient] Barcode lookup failed:', error);
      throw error;
    }
  }

  /**
   * Get food by ID from a specific source
   *
   * @param id - Food ID or external ID
   * @param source - Data source (usda or openfoodfacts)
   * @returns Food search result or null if not found
   */
  static async getFoodById(
    id: string,
    source: 'usda' | 'openfoodfacts',
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<FoodSearchResult | null> {
    if (!id || id.trim().length === 0) {
      throw new NutritionApiError('Food ID cannot be empty', 'VALIDATION_ERROR');
    }

    try {
      if (source === 'usda') {
        const fdcId = parseInt(id, 10);
        if (isNaN(fdcId)) {
          throw new NutritionApiError('Invalid USDA FDC ID', 'VALIDATION_ERROR');
        }
        return await withRetry(() => UsdaApiService.getFoodById(fdcId), retryConfig);
      } else {
        // Open Food Facts uses barcode as ID
        return await withRetry(() => OpenFoodFactsApiService.getFoodByBarcode(id), retryConfig);
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      console.error('[NutritionApiClient] Get food by ID failed:', error);
      throw error;
    }
  }

  /**
   * Test connectivity to all nutrition APIs
   *
   * @returns Object with connectivity status for each API
   */
  static async testConnections(): Promise<{
    usda: boolean;
    openfoodfacts: boolean;
  }> {
    const [usdaStatus, offStatus] = await Promise.all([
      UsdaApiService.testConnection().catch(() => false),
      OpenFoodFactsApiService.testConnection().catch(() => false),
    ]);

    return {
      usda: usdaStatus,
      openfoodfacts: offStatus,
    };
  }

  /**
   * Get user-friendly error message from an error
   *
   * @param error - Error object
   * @returns User-friendly error message
   */
  static getErrorMessage(error: Error): string {
    return getUserFriendlyMessage(error);
  }

  /**
   * Merge results from multiple sources, removing duplicates
   */
  private static mergeResults(results: FoodSearchResult[][]): FoodSearchResult[] {
    const merged: FoodSearchResult[] = [];
    const seen = new Set<string>();

    for (const sourceResults of results) {
      for (const result of sourceResults) {
        // Create a unique key based on name and brand (case-insensitive)
        const key = `${result.name.toLowerCase()}_${(result.brand || '').toLowerCase()}`;

        if (!seen.has(key)) {
          seen.add(key);
          merged.push(result);
        }
      }
    }

    return merged;
  }

  /**
   * Sort results by relevance to query
   */
  private static sortByRelevance(results: FoodSearchResult[], query: string): FoodSearchResult[] {
    const lowerQuery = query.toLowerCase();

    return results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // Exact match comes first
      if (aName === lowerQuery && bName !== lowerQuery) return -1;
      if (bName === lowerQuery && aName !== lowerQuery) return 1;

      // Starts with query comes second
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;

      // Contains query comes third
      const aContains = aName.includes(lowerQuery);
      const bContains = bName.includes(lowerQuery);
      if (aContains && !bContains) return -1;
      if (bContains && !aContains) return 1;

      // Otherwise, sort alphabetically
      return aName.localeCompare(bName);
    });
  }
}
