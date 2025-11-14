import { UsdaApiService } from '../usdaApiService';
import { db } from '../../database';

// Mock fetch
global.fetch = jest.fn();

describe('UsdaApiService', () => {
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
        totalHits: 10,
        currentPage: 1,
        totalPages: 1,
        foods: [
          {
            fdcId: 123456,
            description: 'Apple, raw',
            brandOwner: 'Generic',
            dataType: 'Foundation',
            foodNutrients: [
              {
                nutrientId: 1008,
                nutrientName: 'Energy',
                nutrientNumber: '208',
                value: 52,
                unitName: 'kcal',
              },
              {
                nutrientId: 1003,
                nutrientName: 'Protein',
                nutrientNumber: '203',
                value: 0.3,
                unitName: 'g',
              },
              {
                nutrientId: 1005,
                nutrientName: 'Carbohydrate',
                nutrientNumber: '205',
                value: 14,
                unitName: 'g',
              },
              {
                nutrientId: 1004,
                nutrientName: 'Total lipid (fat)',
                nutrientNumber: '204',
                value: 0.2,
                unitName: 'g',
              },
            ],
            servingSize: 100,
            servingSizeUnit: 'g',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await UsdaApiService.searchFoods('apple');

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Apple, raw');
      expect(results[0].dataSource).toBe('usda');
      expect(results[0].calories).toBe(52);
      expect(results[0].protein).toBe(0.3);
      expect(results[0].carbs).toBe(14);
      expect(results[0].fat).toBe(0.2);
    });

    it('should use cached results on subsequent calls', async () => {
      const mockResponse = {
        totalHits: 1,
        currentPage: 1,
        totalPages: 1,
        foods: [
          {
            fdcId: 123456,
            description: 'Apple, raw',
            dataType: 'Foundation',
            foodNutrients: [
              {
                nutrientId: 1008,
                nutrientName: 'Energy',
                nutrientNumber: '208',
                value: 52,
                unitName: 'kcal',
              },
              {
                nutrientId: 1003,
                nutrientName: 'Protein',
                nutrientNumber: '203',
                value: 0.3,
                unitName: 'g',
              },
              {
                nutrientId: 1005,
                nutrientName: 'Carbohydrate',
                nutrientNumber: '205',
                value: 14,
                unitName: 'g',
              },
              {
                nutrientId: 1004,
                nutrientName: 'Total lipid (fat)',
                nutrientNumber: '204',
                value: 0.2,
                unitName: 'g',
              },
            ],
            servingSize: 100,
            servingSizeUnit: 'g',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // First call - should hit API
      await UsdaApiService.searchFoods('apple');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const results = await UsdaApiService.searchFoods('apple');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      expect(results).toHaveLength(1);
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(UsdaApiService.searchFoods('apple')).rejects.toThrow(
        'USDA API error: Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('fetch failed'));

      await expect(UsdaApiService.searchFoods('apple')).rejects.toThrow(
        'Network error while connecting to USDA API'
      );
    });

    it('should respect pagination parameters', async () => {
      const mockResponse = {
        totalHits: 100,
        currentPage: 2,
        totalPages: 4,
        foods: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await UsdaApiService.searchFoods('apple', { pageSize: 25, pageNumber: 2 });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(fetchCall).toContain('pageSize=25');
      expect(fetchCall).toContain('pageNumber=2');
    });

    it('should normalize serving units', async () => {
      const mockResponse = {
        totalHits: 1,
        currentPage: 1,
        totalPages: 1,
        foods: [
          {
            fdcId: 123456,
            description: 'Test Food',
            dataType: 'Foundation',
            foodNutrients: [
              {
                nutrientId: 1008,
                nutrientName: 'Energy',
                nutrientNumber: '208',
                value: 100,
                unitName: 'kcal',
              },
              {
                nutrientId: 1003,
                nutrientName: 'Protein',
                nutrientNumber: '203',
                value: 5,
                unitName: 'g',
              },
              {
                nutrientId: 1005,
                nutrientName: 'Carbohydrate',
                nutrientNumber: '205',
                value: 20,
                unitName: 'g',
              },
              {
                nutrientId: 1004,
                nutrientName: 'Total lipid (fat)',
                nutrientNumber: '204',
                value: 3,
                unitName: 'g',
              },
            ],
            servingSize: 150,
            servingSizeUnit: 'grams', // Should normalize to 'g'
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await UsdaApiService.searchFoods('test');
      expect(results[0].servingUnit).toBe('g');
    });
  });

  describe('getFoodById', () => {
    it('should get food by FDC ID', async () => {
      const mockResponse = {
        fdcId: 123456,
        description: 'Apple, raw',
        dataType: 'Foundation',
        foodNutrients: [
          {
            nutrientId: 1008,
            nutrientName: 'Energy',
            nutrientNumber: '208',
            value: 52,
            unitName: 'kcal',
          },
          {
            nutrientId: 1003,
            nutrientName: 'Protein',
            nutrientNumber: '203',
            value: 0.3,
            unitName: 'g',
          },
          {
            nutrientId: 1005,
            nutrientName: 'Carbohydrate',
            nutrientNumber: '205',
            value: 14,
            unitName: 'g',
          },
          {
            nutrientId: 1004,
            nutrientName: 'Total lipid (fat)',
            nutrientNumber: '204',
            value: 0.2,
            unitName: 'g',
          },
        ],
        servingSize: 100,
        servingSizeUnit: 'g',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await UsdaApiService.getFoodById(123456);

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Apple, raw');
      expect(result?.externalId).toBe('123456');
    });

    it('should return null for 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await UsdaApiService.getFoodById(999999);
      expect(result).toBeNull();
    });

    it('should use cache for repeated requests', async () => {
      const mockResponse = {
        fdcId: 123456,
        description: 'Apple, raw',
        dataType: 'Foundation',
        foodNutrients: [
          {
            nutrientId: 1008,
            nutrientName: 'Energy',
            nutrientNumber: '208',
            value: 52,
            unitName: 'kcal',
          },
          {
            nutrientId: 1003,
            nutrientName: 'Protein',
            nutrientNumber: '203',
            value: 0.3,
            unitName: 'g',
          },
          {
            nutrientId: 1005,
            nutrientName: 'Carbohydrate',
            nutrientNumber: '205',
            value: 14,
            unitName: 'g',
          },
          {
            nutrientId: 1004,
            nutrientName: 'Total lipid (fat)',
            nutrientNumber: '204',
            value: 0.2,
            unitName: 'g',
          },
        ],
        servingSize: 100,
        servingSizeUnit: 'g',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // First call
      await UsdaApiService.getFoodById(123456);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result = await UsdaApiService.getFoodById(123456);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).not.toBeNull();
    });
  });

  describe('testConnection', () => {
    it('should return true if API is accessible', async () => {
      const mockResponse = {
        totalHits: 1,
        currentPage: 1,
        totalPages: 1,
        foods: [
          {
            fdcId: 123456,
            description: 'Apple',
            dataType: 'Foundation',
            foodNutrients: [],
            servingSize: 100,
            servingSizeUnit: 'g',
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const isConnected = await UsdaApiService.testConnection();
      expect(isConnected).toBe(true);
    });

    it('should return false if API is not accessible', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const isConnected = await UsdaApiService.testConnection();
      expect(isConnected).toBe(false);
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit information', () => {
      const info = UsdaApiService.getRateLimitInfo();
      expect(info.requestsPerHour).toBe(1000);
      expect(info.note).toContain('Demo API key');
    });
  });
});
