import { NutritionApiClient } from '../nutritionApiClient';
import { UsdaApiService } from '../usdaApiService';
import { OpenFoodFactsApiService } from '../openFoodFactsApiService';
import { NetworkError, NutritionApiError, NotFoundError } from '../errors';
import { FoodSearchResult } from '../../../models';

// Mock the API services
jest.mock('../usdaApiService');
jest.mock('../openFoodFactsApiService');

describe('NutritionApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchFoods', () => {
    const mockUsdaResults: FoodSearchResult[] = [
      {
        id: 'usda_1',
        name: 'Apple, raw',
        dataSource: 'usda',
        externalId: '123456',
        servingSize: 100,
        servingUnit: 'g',
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
      },
    ];

    const mockOffResults: FoodSearchResult[] = [
      {
        id: 'off_1',
        name: 'Apple Juice',
        brand: 'TestBrand',
        dataSource: 'openfoodfacts',
        externalId: '789',
        servingSize: 250,
        servingUnit: 'ml',
        calories: 115,
        protein: 0.1,
        carbs: 28,
        fat: 0.1,
      },
    ];

    it('should search both USDA and Open Food Facts by default', async () => {
      (UsdaApiService.searchFoods as jest.Mock).mockResolvedValue(mockUsdaResults);
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue(mockOffResults);

      const promise = NutritionApiClient.searchFoods('apple');

      const results = await promise;

      expect(results).toHaveLength(2);
      expect(UsdaApiService.searchFoods).toHaveBeenCalledWith('apple', {
        pageSize: 25,
        pageNumber: 1,
      });
      expect(OpenFoodFactsApiService.searchFoods).toHaveBeenCalledWith('apple', {
        pageSize: 25,
        page: 1,
      });
    });

    it('should search only USDA when specified', async () => {
      (UsdaApiService.searchFoods as jest.Mock).mockResolvedValue(mockUsdaResults);

      const promise = NutritionApiClient.searchFoods('apple', {
        sources: ['usda'],
      });

      const results = await promise;

      expect(results).toHaveLength(1);
      expect(results[0].dataSource).toBe('usda');
      expect(UsdaApiService.searchFoods).toHaveBeenCalled();
      expect(OpenFoodFactsApiService.searchFoods).not.toHaveBeenCalled();
    });

    it('should search only Open Food Facts when specified', async () => {
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue(mockOffResults);

      const promise = NutritionApiClient.searchFoods('apple', {
        sources: ['openfoodfacts'],
      });

      const results = await promise;

      expect(results).toHaveLength(1);
      expect(results[0].dataSource).toBe('openfoodfacts');
      expect(OpenFoodFactsApiService.searchFoods).toHaveBeenCalled();
      expect(UsdaApiService.searchFoods).not.toHaveBeenCalled();
    });

    it('should throw error for empty query', async () => {
      await expect(NutritionApiClient.searchFoods('')).rejects.toThrow(NutritionApiError);
      await expect(NutritionApiClient.searchFoods('')).rejects.toThrow(
        'Search query cannot be empty'
      );
    });

    it('should handle pagination options', async () => {
      (UsdaApiService.searchFoods as jest.Mock).mockResolvedValue(mockUsdaResults);
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue(mockOffResults);

      const promise = NutritionApiClient.searchFoods('apple', {
        pageSize: 50,
        page: 2,
      });

      await promise;

      expect(UsdaApiService.searchFoods).toHaveBeenCalledWith('apple', {
        pageSize: 50,
        pageNumber: 2,
      });
      expect(OpenFoodFactsApiService.searchFoods).toHaveBeenCalledWith('apple', {
        pageSize: 50,
        page: 2,
      });
    });

    it('should continue if one API fails', async () => {
      (UsdaApiService.searchFoods as jest.Mock).mockRejectedValue(new NetworkError('USDA failed'));
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue(mockOffResults);

      const promise = NutritionApiClient.searchFoods('apple');

      const results = await promise;

      expect(results).toHaveLength(1);
      expect(results[0].dataSource).toBe('openfoodfacts');
    });

    it('should deduplicate results with same name and brand', async () => {
      const duplicateResults: FoodSearchResult[] = [
        {
          id: 'off_1',
          name: 'Apple, raw',
          dataSource: 'openfoodfacts',
          servingSize: 100,
          servingUnit: 'g',
          calories: 52,
        },
      ];

      (UsdaApiService.searchFoods as jest.Mock).mockResolvedValue(mockUsdaResults);
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue(duplicateResults);

      const promise = NutritionApiClient.searchFoods('apple');

      const results = await promise;

      // Should have only one "Apple, raw" result (deduplicated)
      expect(results).toHaveLength(1);
    });

    it('should sort results by relevance', async () => {
      const mixedResults: FoodSearchResult[] = [
        { id: '1', name: 'Red Apple', dataSource: 'usda', servingSize: 100, servingUnit: 'g' },
        {
          id: '2',
          name: 'Apple',
          dataSource: 'usda',
          servingSize: 100,
          servingUnit: 'g',
        }, // Exact match
        {
          id: '3',
          name: 'Banana',
          dataSource: 'usda',
          servingSize: 100,
          servingUnit: 'g',
        },
        {
          id: '4',
          name: 'Apple Juice',
          dataSource: 'usda',
          servingSize: 100,
          servingUnit: 'g',
        }, // Starts with
      ];

      (UsdaApiService.searchFoods as jest.Mock).mockResolvedValue(mixedResults);
      (OpenFoodFactsApiService.searchFoods as jest.Mock).mockResolvedValue([]);

      const promise = NutritionApiClient.searchFoods('apple');

      const results = await promise;

      // Exact match first, then starts with, then contains
      expect(results[0].name).toBe('Apple');
      expect(results[1].name).toBe('Apple Juice');
      expect(results[2].name).toBe('Red Apple');
      expect(results[3].name).toBe('Banana');
    });
  });

  describe('getFoodByBarcode', () => {
    const mockBarcodeResult: FoodSearchResult = {
      id: 'off_123',
      name: 'Test Product',
      brand: 'TestBrand',
      dataSource: 'openfoodfacts',
      externalId: '123456789',
      servingSize: 100,
      servingUnit: 'g',
      calories: 200,
      protein: 10,
      carbs: 20,
      fat: 8,
    };

    it('should lookup barcode using Open Food Facts', async () => {
      (OpenFoodFactsApiService.getFoodByBarcode as jest.Mock).mockResolvedValue(mockBarcodeResult);

      const promise = NutritionApiClient.getFoodByBarcode('123456789');

      const result = await promise;

      expect(result).toEqual(mockBarcodeResult);
      expect(OpenFoodFactsApiService.getFoodByBarcode).toHaveBeenCalledWith('123456789');
    });

    it('should return null if barcode not found', async () => {
      (OpenFoodFactsApiService.getFoodByBarcode as jest.Mock).mockRejectedValue(
        new NotFoundError('Not found', '123456789')
      );

      const promise = NutritionApiClient.getFoodByBarcode('123456789');

      const result = await promise;

      expect(result).toBeNull();
    });

    it('should throw error for empty barcode', async () => {
      await expect(NutritionApiClient.getFoodByBarcode('')).rejects.toThrow(NutritionApiError);
      await expect(NutritionApiClient.getFoodByBarcode('')).rejects.toThrow(
        'Barcode cannot be empty'
      );
    });

    it('should throw network errors', async () => {
      (OpenFoodFactsApiService.getFoodByBarcode as jest.Mock).mockRejectedValue(
        new NetworkError('Network failed')
      );

      const promise = NutritionApiClient.getFoodByBarcode('123456789');

      await expect(promise).rejects.toThrow(NetworkError);
    });
  });

  describe('getFoodById', () => {
    const mockUsdaFood: FoodSearchResult = {
      id: 'usda_123',
      name: 'Apple',
      dataSource: 'usda',
      externalId: '123456',
      servingSize: 100,
      servingUnit: 'g',
      calories: 52,
    };

    it('should get food from USDA by FDC ID', async () => {
      (UsdaApiService.getFoodById as jest.Mock).mockResolvedValue(mockUsdaFood);

      const promise = NutritionApiClient.getFoodById('123456', 'usda');

      const result = await promise;

      expect(result).toEqual(mockUsdaFood);
      expect(UsdaApiService.getFoodById).toHaveBeenCalledWith(123456);
    });

    it('should get food from Open Food Facts by barcode', async () => {
      const mockOffFood: FoodSearchResult = {
        id: 'off_123',
        name: 'Product',
        dataSource: 'openfoodfacts',
        servingSize: 100,
        servingUnit: 'g',
        calories: 100,
      };

      (OpenFoodFactsApiService.getFoodByBarcode as jest.Mock).mockResolvedValue(mockOffFood);

      const promise = NutritionApiClient.getFoodById('123456789', 'openfoodfacts');

      const result = await promise;

      expect(result).toEqual(mockOffFood);
      expect(OpenFoodFactsApiService.getFoodByBarcode).toHaveBeenCalledWith('123456789');
    });

    it('should throw error for invalid USDA ID', async () => {
      await expect(NutritionApiClient.getFoodById('invalid', 'usda')).rejects.toThrow(
        NutritionApiError
      );
      await expect(NutritionApiClient.getFoodById('invalid', 'usda')).rejects.toThrow(
        'Invalid USDA FDC ID'
      );
    });

    it('should return null if food not found', async () => {
      (UsdaApiService.getFoodById as jest.Mock).mockRejectedValue(
        new NotFoundError('Not found', '999999')
      );

      const promise = NutritionApiClient.getFoodById('999999', 'usda');

      const result = await promise;

      expect(result).toBeNull();
    });

    it('should throw error for empty ID', async () => {
      await expect(NutritionApiClient.getFoodById('', 'usda')).rejects.toThrow(NutritionApiError);
      await expect(NutritionApiClient.getFoodById('', 'usda')).rejects.toThrow(
        'Food ID cannot be empty'
      );
    });
  });

  describe('testConnections', () => {
    it('should return status for both APIs', async () => {
      (UsdaApiService.testConnection as jest.Mock).mockResolvedValue(true);
      (OpenFoodFactsApiService.testConnection as jest.Mock).mockResolvedValue(true);

      const status = await NutritionApiClient.testConnections();

      expect(status).toEqual({
        usda: true,
        openfoodfacts: true,
      });
    });

    it('should handle API failures', async () => {
      (UsdaApiService.testConnection as jest.Mock).mockRejectedValue(new Error('Failed'));
      (OpenFoodFactsApiService.testConnection as jest.Mock).mockResolvedValue(true);

      const status = await NutritionApiClient.testConnections();

      expect(status).toEqual({
        usda: false,
        openfoodfacts: true,
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly error message', () => {
      const error = new NetworkError('Network failed');
      const message = NutritionApiClient.getErrorMessage(error);

      expect(message).toContain('internet connection');
    });

    it('should handle generic errors', () => {
      const error = new Error('Generic error');
      const message = NutritionApiClient.getErrorMessage(error);

      expect(message).toContain('unexpected error');
    });
  });
});
