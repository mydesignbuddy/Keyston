import { db } from './database';
import { FavoriteFood } from '../models';

/**
 * Favorite Foods Service
 * Manages user's favorite foods for quick access
 */
export class FavoriteFoodsService {
  /**
   * Add a food to favorites
   */
  static async addFavorite(foodId: string): Promise<FavoriteFood> {
    try {
      // Check if already in favorites
      const existing = await db.favoriteFoods.where('foodId').equals(foodId).first();

      if (existing) {
        // Update usage count and last used timestamp
        return await this.incrementUsage(existing.id);
      }

      // Create new favorite
      const favorite: FavoriteFood = {
        id: crypto.randomUUID(),
        foodId,
        usageCount: 1,
        lastUsedAt: new Date(),
        createdAt: new Date(),
      };

      await db.favoriteFoods.add(favorite);
      return favorite;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw new Error('Failed to save favorite food');
    }
  }

  /**
   * Remove a food from favorites
   */
  static async removeFavorite(id: string): Promise<void> {
    try {
      await db.favoriteFoods.delete(id);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw new Error('Failed to remove favorite');
    }
  }

  /**
   * Remove favorite by food ID
   */
  static async removeFavoriteByFoodId(foodId: string): Promise<void> {
    try {
      await db.favoriteFoods.where('foodId').equals(foodId).delete();
    } catch (error) {
      console.error('Failed to remove favorite by food ID:', error);
      throw new Error('Failed to remove favorite');
    }
  }

  /**
   * Check if a food is in favorites
   */
  static async isFavorite(foodId: string): Promise<boolean> {
    try {
      const count = await db.favoriteFoods.where('foodId').equals(foodId).count();
      return count > 0;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  }

  /**
   * Get all favorite foods
   * Sorted by last used (most recent first)
   */
  static async getAllFavorites(): Promise<FavoriteFood[]> {
    try {
      return await db.favoriteFoods.orderBy('lastUsedAt').reverse().toArray();
    } catch (error) {
      console.error('Failed to get favorites:', error);
      throw new Error('Failed to load favorite foods');
    }
  }

  /**
   * Get top N most used favorite foods
   */
  static async getTopFavorites(limit = 10): Promise<FavoriteFood[]> {
    try {
      return await db.favoriteFoods.orderBy('usageCount').reverse().limit(limit).toArray();
    } catch (error) {
      console.error('Failed to get top favorites:', error);
      throw new Error('Failed to load favorite foods');
    }
  }

  /**
   * Increment usage count for a favorite
   */
  static async incrementUsage(id: string): Promise<FavoriteFood> {
    try {
      const favorite = await db.favoriteFoods.get(id);
      if (!favorite) {
        throw new Error('Favorite not found');
      }

      const updated: FavoriteFood = {
        ...favorite,
        usageCount: favorite.usageCount + 1,
        lastUsedAt: new Date(),
      };

      await db.favoriteFoods.put(updated);
      return updated;
    } catch (error) {
      console.error('Failed to increment usage:', error);
      throw new Error('Failed to update favorite');
    }
  }

  /**
   * Increment usage by food ID
   */
  static async incrementUsageByFoodId(foodId: string): Promise<void> {
    try {
      const favorite = await db.favoriteFoods.where('foodId').equals(foodId).first();

      if (favorite) {
        await this.incrementUsage(favorite.id);
      }
    } catch (error) {
      console.error('Failed to increment usage by food ID:', error);
      // Don't throw - this is a non-critical operation
    }
  }

  /**
   * Get favorite food by ID
   */
  static async getFavorite(id: string): Promise<FavoriteFood | undefined> {
    try {
      return await db.favoriteFoods.get(id);
    } catch (error) {
      console.error('Failed to get favorite:', error);
      throw new Error('Failed to load favorite');
    }
  }

  /**
   * Get total favorite count
   */
  static async getTotalCount(): Promise<number> {
    try {
      return await db.favoriteFoods.count();
    } catch (error) {
      console.error('Failed to get favorite count:', error);
      return 0;
    }
  }
}
