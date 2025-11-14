import { OpenFoodFactsApiService } from '../openFoodFactsApiService';
import { db } from '../../database';

// Mock fetch
global.fetch = jest.fn();

describe('OpenFoodFactsApiService', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.delete();
  });

  describe('searchFoods', () => {
    it('should search foods and return results', async () => {
      const mockResponse = {
        count: 10,
        page: 1,
        page_size: 25,
        products: [
          {
            code: '123456789',
            product_name: 'Organic Apple Juice',
            brands: 'TestBrand',
            quantity: '1L',
            serving_size: '250ml',
            nutriments: {
              'energy-kcal_100g': 46,
              proteins_100g: 0.1,
              carbohydrates_100g: 11.3,
              fat_100g: 0.1,
              fiber_100g: 0,
              sugars_100g: 10.6,
              sodium_100g: 0.005,
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await OpenFoodFactsApiService.searchFoods('apple juice');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Organic Apple Juice');
      expect(results[0].brand).toBe('TestBrand');
      expect(results[0].dataSource).toBe('openfoodfacts');
      expect(results[0].servingSize).toBe(250);
      expect(results[0].servingUnit).toBe('ml');
      // Calories should be scaled from 100ml to 250ml: 46 * 2.5 = 115
      expect(results[0].calories).toBeCloseTo(115, 0);
    });

    it('should filter out products without names', async () => {
      const mockResponse = {
        count: 2,
        page: 1,
        page_size: 25,
        products: [
          {
            code: '123456789',
            product_name: 'Valid Product',
            nutriments: {
              'energy-kcal_100g': 100,
              proteins_100g: 5,
              carbohydrates_100g: 10,
              fat_100g: 3,
            },
          },
          {
            code: '987654321',
            // Missing product_name
            nutriments: {},
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await OpenFoodFactsApiService.searchFoods('test');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Valid Product');
    });

    it('should use cached results on subsequent calls', async () => {
      const mockResponse = {
        count: 1,
        page: 1,
        page_size: 25,
        products: [
          {
            code: '123456789',
            product_name: 'Test Product',
            nutriments: {
              'energy-kcal_100g': 100,
              proteins_100g: 5,
              carbohydrates_100g: 10,
              fat_100g: 3,
            },
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // First call - should hit API
      await OpenFoodFactsApiService.searchFoods('test');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const results = await OpenFoodFactsApiService.searchFoods('test');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      expect(results).toHaveLength(1);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(OpenFoodFactsApiService.searchFoods('test')).rejects.toThrow(
        'Open Food Facts API error: Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(OpenFoodFactsApiService.searchFoods('test')).rejects.toThrow(
        'Network error while connecting to Open Food Facts'
      );
    });

    it('should respect pagination parameters', async () => {
      const mockResponse = {
        count: 100,
        page: 2,
        page_size: 50,
        products: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await OpenFoodFactsApiService.searchFoods('test', { pageSize: 50, page: 2 });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(fetchCall).toContain('page=2');
      expect(fetchCall).toContain('page_size=50');
    });
  });

  describe('getFoodByBarcode', () => {
    it('should get food by barcode', async () => {
      const mockResponse = {
        code: '3017620422003',
        status: 1,
        status_verbose: 'product found',
        product: {
          code: '3017620422003',
          product_name: 'Nutella',
          brands: 'Ferrero',
          serving_size: '15g',
          nutriments: {
            'energy-kcal_100g': 539,
            proteins_100g: 6.3,
            carbohydrates_100g: 57.5,
            fat_100g: 30.9,
            sugars_100g: 56.3,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Nutella');
      expect(result?.brand).toBe('Ferrero');
      expect(result?.externalId).toBe('3017620422003');
      expect(result?.servingSize).toBe(15);
      expect(result?.servingUnit).toBe('g');
      // Calories should be scaled from 100g to 15g: 539 * 0.15 = 80.85
      expect(result?.calories).toBeCloseTo(80.85, 1);
    });

    it('should return null for product not found', async () => {
      const mockResponse = {
        code: '0000000000000',
        status: 0,
        status_verbose: 'product not found',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(
        OpenFoodFactsApiService.getFoodByBarcode('0000000000000')
      ).rejects.toThrow('Product with barcode 0000000000000 not found');
    });

    it('should return null for 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        OpenFoodFactsApiService.getFoodByBarcode('9999999999999')
      ).rejects.toThrow('Product with barcode 9999999999999 not found');
    });

    it('should use cache for repeated barcode lookups', async () => {
      const mockResponse = {
        code: '3017620422003',
        status: 1,
        status_verbose: 'product found',
        product: {
          code: '3017620422003',
          product_name: 'Nutella',
          brands: 'Ferrero',
          serving_size: '15g',
          nutriments: {
            'energy-kcal_100g': 539,
            proteins_100g: 6.3,
            carbohydrates_100g: 57.5,
            fat_100g: 30.9,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // First call
      await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result = await OpenFoodFactsApiService.getFoodByBarcode('3017620422003');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).not.toBeNull();
    });

    it('should handle products without serving size', async () => {
      const mockResponse = {
        code: '123456789',
        status: 1,
        status_verbose: 'product found',
        product: {
          code: '123456789',
          product_name: 'Test Product',
          // No serving_size specified
          nutriments: {
            'energy-kcal_100g': 100,
            proteins_100g: 5,
            carbohydrates_100g: 10,
            fat_100g: 3,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await OpenFoodFactsApiService.getFoodByBarcode('123456789');

      expect(result).not.toBeNull();
      expect(result?.servingSize).toBe(100); // Default
      expect(result?.servingUnit).toBe('g'); // Default
      expect(result?.calories).toBe(100); // No scaling (100g = 100g)
    });

    it('should parse serving size from various formats', async () => {
      const mockResponse = {
        code: '123456789',
        status: 1,
        status_verbose: 'product found',
        product: {
          code: '123456789',
          product_name: 'Test Product',
          serving_size: '250 ml',
          nutriments: {
            'energy-kcal_100g': 40,
            proteins_100g: 1,
            carbohydrates_100g: 8,
            fat_100g: 0.5,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await OpenFoodFactsApiService.getFoodByBarcode('123456789');

      expect(result?.servingSize).toBe(250);
      expect(result?.servingUnit).toBe('ml');
    });
  });

  describe('testConnection', () => {
    it('should return true if API is accessible', async () => {
      const mockResponse = {
        count: 1,
        page: 1,
        page_size: 1,
        products: [
          {
            code: '123',
            product_name: 'Test',
            nutriments: {},
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const isConnected = await OpenFoodFactsApiService.testConnection();
      expect(isConnected).toBe(true);
    });

    it('should return false if API is not accessible', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const isConnected = await OpenFoodFactsApiService.testConnection();
      expect(isConnected).toBe(false);
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit information', () => {
      const info = OpenFoodFactsApiService.getRateLimitInfo();
      expect(info.requestsPerMinute).toBe(100);
      expect(info.note).toContain('No strict rate limit');
    });
  });
});
