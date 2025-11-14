import { FoodSearchResult, DataSource } from '../../models';
import { ApiCacheService } from '../apiCacheService';

/**
 * Open Food Facts API Service
 *
 * Client-side integration with Open Food Facts API.
 * All calls are made directly from the client (privacy-first).
 *
 * API Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/
 * Rate Limit: No strict limit, but be respectful (100 requests/minute recommended)
 *
 * Open Food Facts is a collaborative database of food products worldwide.
 * Best for: Barcode lookups, international brands, packaged foods
 */

// API Configuration
const OFF_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://world.openfoodfacts.org/api/v2'
    : '/api/openfoodfacts'; // Development proxy to avoid CORS

/**
 * Open Food Facts API Response Types
 */
interface OffSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OffProduct[];
}

interface OffProduct {
  code?: string; // Barcode
  product_name?: string;
  brands?: string;
  quantity?: string;
  serving_size?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
  };
}

interface OffProductResponse {
  code: string;
  product?: OffProduct;
  status: number;
  status_verbose: string;
}

/**
 * Open Food Facts API Service
 */
export class OpenFoodFactsApiService {
  /**
   * Search foods in Open Food Facts database
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Array of food search results
   */
  static async searchFoods(
    query: string,
    options: {
      pageSize?: number;
      page?: number;
    } = {}
  ): Promise<FoodSearchResult[]> {
    const { pageSize = 25, page = 1 } = options;

    // Check cache first
    const cacheKey = `off_search_${query}_${page}_${pageSize}`;
    const cached = await ApiCacheService.getCachedSearchResults<FoodSearchResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        search_terms: query,
        page: page.toString(),
        page_size: pageSize.toString(),
        json: '1',
        fields: 'code,product_name,brands,quantity,serving_size,nutriments',
      });

      // Make API request
      const response = await fetch(`${OFF_BASE_URL}/search?${params}`);

      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.status} ${response.statusText}`);
      }

      const data: OffSearchResponse = await response.json();

      // Transform to our FoodSearchResult format
      const results = data.products
        .filter((product) => product.product_name) // Filter out products without names
        .map((product) => this.transformToSearchResult(product));

      // Cache results
      await ApiCacheService.cacheSearchResults(cacheKey, results);

      return results;
    } catch (error) {
      console.error('Open Food Facts API search error:', error);
      throw new Error('Failed to search Open Food Facts database');
    }
  }

  /**
   * Get food by barcode
   *
   * @param barcode - Product barcode (UPC/EAN)
   * @returns Food search result or null if not found
   */
  static async getFoodByBarcode(barcode: string): Promise<FoodSearchResult | null> {
    // Check cache first
    const cacheKey = `off_barcode_${barcode}`;
    const cached = await ApiCacheService.getCachedBarcodeLookup<FoodSearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${OFF_BASE_URL}/product/${barcode}.json`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Open Food Facts API error: ${response.status} ${response.statusText}`);
      }

      const data: OffProductResponse = await response.json();

      if (data.status === 0 || !data.product) {
        return null; // Product not found
      }

      const result = this.transformToSearchResult(data.product);

      // Cache result
      await ApiCacheService.cacheBarcodeLookup(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Open Food Facts API barcode lookup error:', error);
      throw new Error('Failed to lookup barcode in Open Food Facts');
    }
  }

  /**
   * Transform Open Food Facts product to our FoodSearchResult format
   */
  private static transformToSearchResult(product: OffProduct): FoodSearchResult {
    const nutriments = product.nutriments || {};

    // Parse serving size (e.g., "150g", "250ml")
    let servingSize = 100;
    let servingUnit = 'g';

    if (product.serving_size) {
      const match = product.serving_size.match(/(\d+\.?\d*)\s*([a-zA-Z]+)/);
      if (match) {
        servingSize = parseFloat(match[1]);
        servingUnit = match[2].toLowerCase();
      }
    }

    // Normalize serving units
    if (servingUnit === 'grams') servingUnit = 'g';
    if (servingUnit === 'milliliters') servingUnit = 'ml';

    // Open Food Facts provides nutrition per 100g
    // We need to scale to the serving size
    const scaleFactor = servingSize / 100;

    return {
      id: `off_${product.code || 'unknown'}`,
      name: product.product_name || 'Unknown Product',
      brand: product.brands,
      dataSource: 'openfoodfacts' as DataSource,
      externalId: product.code,
      servingSize,
      servingUnit,
      calories: (nutriments['energy-kcal_100g'] || 0) * scaleFactor,
      protein: (nutriments['proteins_100g'] || 0) * scaleFactor,
      carbs: (nutriments['carbohydrates_100g'] || 0) * scaleFactor,
      fat: (nutriments['fat_100g'] || 0) * scaleFactor,
    };
  }

  /**
   * Test API connectivity
   *
   * @returns true if API is accessible
   */
  static async testConnection(): Promise<boolean> {
    try {
      const results = await this.searchFoods('apple', { pageSize: 1 });
      return results.length > 0;
    } catch (error) {
      console.error('Open Food Facts API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API rate limit information
   *
   * Open Food Facts doesn't have a strict rate limit, but recommends
   * being respectful with request frequency.
   */
  static getRateLimitInfo(): {
    requestsPerMinute: number;
    note: string;
  } {
    return {
      requestsPerMinute: 100,
      note: 'No strict rate limit. Be respectful - recommended max 100 requests/minute. Free and open API.',
    };
  }
}
