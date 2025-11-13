import { FoodSearchResult, DataSource } from '../../models';
import { ApiCacheService } from '../apiCacheService';
import { CACHE_TTL } from '../../models/ApiCache';

/**
 * USDA FoodData Central API Service
 *
 * Client-side integration with USDA FoodData Central API.
 * All calls are made directly from the client (privacy-first).
 *
 * API Documentation: https://fdc.nal.usda.gov/api-guide.html
 * Rate Limit: 1000 requests per hour
 */

// API Configuration
const USDA_API_KEY = 'HCceeipX6FzrO9GfcTzCC2HhsmfccKjnptYTKyLL';
const USDA_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.nal.usda.gov/fdc/v1' : '/api/usda'; // Development proxy to avoid CORS

/**
 * USDA API Response Types
 */
interface UsdaSearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: UsdaFood[];
}

interface UsdaFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  foodNutrients: UsdaNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
}

interface UsdaNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  value: number;
  unitName: string;
}

/**
 * Nutrient ID mappings from USDA
 */
const NUTRIENT_IDS = {
  ENERGY: 1008, // Energy (calories)
  PROTEIN: 1003, // Protein
  CARBS: 1005, // Carbohydrate, by difference
  FAT: 1004, // Total lipid (fat)
  FIBER: 1079, // Fiber, total dietary
  SUGAR: 2000, // Sugars, total
  SODIUM: 1093, // Sodium
};

/**
 * USDA FoodData Central API Service
 */
export class UsdaApiService {
  /**
   * Search foods in USDA database
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Array of food search results
   */
  static async searchFoods(
    query: string,
    options: {
      pageSize?: number;
      pageNumber?: number;
      dataType?: string[]; // ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded']
    } = {}
  ): Promise<FoodSearchResult[]> {
    const { pageSize = 25, pageNumber = 1, dataType } = options;

    // Check cache first
    const cacheKey = `usda_search_${query}_${pageNumber}_${pageSize}`;
    const cached = await ApiCacheService.getCachedSearchResults(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        api_key: USDA_API_KEY,
        query,
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
      });

      if (dataType && dataType.length > 0) {
        params.append('dataType', dataType.join(','));
      }

      // Make API request
      const response = await fetch(`${USDA_BASE_URL}/foods/search?${params}`);

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data: UsdaSearchResponse = await response.json();

      // Transform to our FoodSearchResult format
      const results = data.foods.map((food) => this.transformToSearchResult(food));

      // Cache results
      await ApiCacheService.cacheSearchResults(cacheKey, results);

      return results;
    } catch (error) {
      console.error('USDA API search error:', error);
      throw new Error('Failed to search USDA food database');
    }
  }

  /**
   * Get food details by FDC ID
   *
   * @param fdcId - USDA FDC ID
   * @returns Food search result with detailed nutrition
   */
  static async getFoodById(fdcId: number): Promise<FoodSearchResult | null> {
    // Check cache first
    const cacheKey = `usda_food_${fdcId}`;
    const cached = await ApiCacheService.get(cacheKey);
    if (cached) {
      return cached as FoodSearchResult;
    }

    try {
      const params = new URLSearchParams({
        api_key: USDA_API_KEY,
      });

      const response = await fetch(`${USDA_BASE_URL}/food/${fdcId}?${params}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data: UsdaFood = await response.json();
      const result = this.transformToSearchResult(data);

      // Cache result
      await ApiCacheService.set(cacheKey, result, CACHE_TTL.FOOD_DETAILS);

      return result;
    } catch (error) {
      console.error('USDA API get food error:', error);
      throw new Error('Failed to get food from USDA');
    }
  }

  /**
   * Transform USDA food to our FoodSearchResult format
   */
  private static transformToSearchResult(food: UsdaFood): FoodSearchResult {
    // Extract nutrient values
    const nutrients = new Map<number, number>();
    food.foodNutrients.forEach((nutrient) => {
      nutrients.set(nutrient.nutrientId, nutrient.value);
    });

    // Default serving size (100g if not specified)
    const servingSize = food.servingSize || 100;
    let servingUnit = food.servingSizeUnit?.toLowerCase() || 'g';

    // Normalize serving units
    if (servingUnit === 'grams') servingUnit = 'g';
    if (servingUnit === 'milliliters') servingUnit = 'ml';

    return {
      id: `usda_${food.fdcId}`,
      name: food.description,
      brand: food.brandOwner,
      dataSource: 'usda' as DataSource,
      externalId: food.fdcId.toString(),
      servingSize,
      servingUnit,
      calories: nutrients.get(NUTRIENT_IDS.ENERGY) || 0,
      protein: nutrients.get(NUTRIENT_IDS.PROTEIN) || 0,
      carbs: nutrients.get(NUTRIENT_IDS.CARBS) || 0,
      fat: nutrients.get(NUTRIENT_IDS.FAT) || 0,
    };
  }

  /**
   * Test API connectivity and key validity
   *
   * @returns true if API is accessible and key is valid
   */
  static async testConnection(): Promise<boolean> {
    try {
      const results = await this.searchFoods('apple', { pageSize: 1 });
      return results.length > 0;
    } catch (error) {
      console.error('USDA API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API rate limit information
   *
   * USDA FoodData Central API has a rate limit of 1000 requests per hour.
   * This is a demo key and may have additional restrictions.
   */
  static getRateLimitInfo(): {
    requestsPerHour: number;
    note: string;
  } {
    return {
      requestsPerHour: 1000,
      note: 'Demo API key provided. For production, obtain your own API key at https://fdc.nal.usda.gov/api-key-signup.html',
    };
  }
}
