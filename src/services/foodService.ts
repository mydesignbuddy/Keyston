import { db } from './database';
import { Food, FoodSearchResult } from '../models';

/**
 * Food Service
 * Manages food database (cached nutrition data)
 */
export class FoodService {
  /**
   * Add a new food to the database
   */
  static async addFood(food: Omit<Food, 'id' | 'createdAt'>): Promise<Food> {
    try {
      const newFood: Food = {
        ...food,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };

      await db.foods.add(newFood);
      return newFood;
    } catch (error) {
      console.error('Failed to add food:', error);
      throw new Error('Failed to save food');
    }
  }

  /**
   * Get a food by ID
   */
  static async getFood(id: string): Promise<Food | undefined> {
    try {
      return await db.foods.get(id);
    } catch (error) {
      console.error('Failed to get food:', error);
      throw new Error('Failed to load food');
    }
  }

  /**
   * Get a food by barcode
   */
  static async getFoodByBarcode(barcode: string): Promise<Food | undefined> {
    try {
      return await db.foods.where('barcode').equals(barcode).first();
    } catch (error) {
      console.error('Failed to get food by barcode:', error);
      throw new Error('Failed to load food');
    }
  }

  /**
   * Search foods by name
   */
  static async searchFoods(query: string, limit = 20): Promise<Food[]> {
    try {
      const lowerQuery = query.toLowerCase();

      // Search by name (case-insensitive)
      const results = await db.foods
        .filter((food) => food.name.toLowerCase().includes(lowerQuery))
        .limit(limit)
        .toArray();

      return results;
    } catch (error) {
      console.error('Failed to search foods:', error);
      throw new Error('Failed to search foods');
    }
  }

  /**
   * Update an existing food
   */
  static async updateFood(
    id: string,
    updates: Partial<Omit<Food, 'id' | 'createdAt'>>
  ): Promise<Food> {
    try {
      const existingFood = await db.foods.get(id);
      if (!existingFood) {
        throw new Error('Food not found');
      }

      const updatedFood: Food = {
        ...existingFood,
        ...updates,
      };

      await db.foods.put(updatedFood);
      return updatedFood;
    } catch (error) {
      console.error('Failed to update food:', error);
      throw new Error('Failed to update food');
    }
  }

  /**
   * Delete a food
   */
  static async deleteFood(id: string): Promise<void> {
    try {
      await db.foods.delete(id);
    } catch (error) {
      console.error('Failed to delete food:', error);
      throw new Error('Failed to delete food');
    }
  }

  /**
   * Get recently added foods
   */
  static async getRecentFoods(limit = 10): Promise<Food[]> {
    try {
      return await db.foods.orderBy('createdAt').reverse().limit(limit).toArray();
    } catch (error) {
      console.error('Failed to get recent foods:', error);
      throw new Error('Failed to load recent foods');
    }
  }

  /**
   * Check if food exists by external ID
   */
  static async foodExistsByExternalId(
    dataSource: Food['dataSource'],
    externalId: string
  ): Promise<Food | undefined> {
    try {
      return await db.foods
        .where('[dataSource+externalId]')
        .equals([dataSource, externalId])
        .first();
    } catch (error) {
      console.error('Failed to check food existence:', error);
      return undefined;
    }
  }

  /**
   * Import food from search result
   * Converts FoodSearchResult to Food and saves to database
   */
  static async importFromSearchResult(result: FoodSearchResult): Promise<Food> {
    try {
      // Check if already exists
      if (result.externalId && result.dataSource) {
        const existing = await this.foodExistsByExternalId(result.dataSource, result.externalId);
        if (existing) {
          return existing;
        }
      }

      const food: Omit<Food, 'id' | 'createdAt'> = {
        name: result.name,
        brand: result.brand,
        dataSource: result.dataSource,
        externalId: result.externalId,
        servingSizeDefault: result.servingSize || 100,
        servingUnitDefault: result.servingUnit || 'g',
        caloriesPerServing: result.calories || 0,
        proteinG: result.protein || 0,
        carbsG: result.carbs || 0,
        fatG: result.fat || 0,
      };

      return await this.addFood(food);
    } catch (error) {
      console.error('Failed to import food:', error);
      throw new Error('Failed to import food');
    }
  }

  /**
   * Get total food count
   */
  static async getTotalCount(): Promise<number> {
    try {
      return await db.foods.count();
    } catch (error) {
      console.error('Failed to get food count:', error);
      return 0;
    }
  }
}
