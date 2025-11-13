import { db } from './database';
import { FoodDiaryEntry, DailyNutritionTotals } from '../models';

/**
 * Food Diary Service
 * Manages food diary entries and nutrition tracking
 */
export class FoodDiaryService {
  /**
   * Add a new food diary entry
   */
  static async addEntry(entry: Omit<FoodDiaryEntry, 'id' | 'createdAt'>): Promise<FoodDiaryEntry> {
    try {
      const newEntry: FoodDiaryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };

      await db.foodDiaryEntries.add(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Failed to add food diary entry:', error);
      throw new Error('Failed to save food entry');
    }
  }

  /**
   * Get all entries for a specific date
   */
  static async getEntriesForDate(date: string): Promise<FoodDiaryEntry[]> {
    try {
      return await db.foodDiaryEntries.where('entryDate').equals(date).sortBy('createdAt');
    } catch (error) {
      console.error('Failed to get entries for date:', error);
      throw new Error('Failed to load food entries');
    }
  }

  /**
   * Get entries for a specific date and meal type
   */
  static async getEntriesByMeal(
    date: string,
    mealType: FoodDiaryEntry['mealType']
  ): Promise<FoodDiaryEntry[]> {
    try {
      return await db.foodDiaryEntries
        .where('[entryDate+mealType]')
        .equals([date, mealType])
        .sortBy('createdAt');
    } catch (error) {
      console.error('Failed to get entries by meal:', error);
      throw new Error('Failed to load meal entries');
    }
  }

  /**
   * Get a specific entry by ID
   */
  static async getEntry(id: string): Promise<FoodDiaryEntry | undefined> {
    try {
      return await db.foodDiaryEntries.get(id);
    } catch (error) {
      console.error('Failed to get entry:', error);
      throw new Error('Failed to load food entry');
    }
  }

  /**
   * Update an existing food diary entry
   */
  static async updateEntry(
    id: string,
    updates: Partial<Omit<FoodDiaryEntry, 'id' | 'createdAt'>>
  ): Promise<FoodDiaryEntry> {
    try {
      const existingEntry = await db.foodDiaryEntries.get(id);
      if (!existingEntry) {
        throw new Error('Entry not found');
      }

      const updatedEntry: FoodDiaryEntry = {
        ...existingEntry,
        ...updates,
      };

      await db.foodDiaryEntries.put(updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Failed to update entry:', error);
      throw new Error('Failed to update food entry');
    }
  }

  /**
   * Delete a food diary entry
   */
  static async deleteEntry(id: string): Promise<void> {
    try {
      await db.foodDiaryEntries.delete(id);
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw new Error('Failed to delete food entry');
    }
  }

  /**
   * Delete all entries for a specific date
   */
  static async deleteEntriesForDate(date: string): Promise<number> {
    try {
      return await db.foodDiaryEntries.where('entryDate').equals(date).delete();
    } catch (error) {
      console.error('Failed to delete entries:', error);
      throw new Error('Failed to delete food entries');
    }
  }

  /**
   * Calculate daily nutrition totals for a specific date
   */
  static async calculateDailyTotals(date: string): Promise<DailyNutritionTotals> {
    try {
      const entries = await this.getEntriesForDate(date);

      const totals: DailyNutritionTotals = {
        date,
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        fiberG: 0,
        sugarG: 0,
        sodiumMg: 0,
        entryCount: entries.length,
      };

      entries.forEach((entry) => {
        totals.calories += entry.calories || 0;
        totals.proteinG += entry.proteinG || 0;
        totals.carbsG += entry.carbsG || 0;
        totals.fatG += entry.fatG || 0;
        totals.fiberG += entry.fiberG || 0;
        totals.sugarG += entry.sugarG || 0;
        totals.sodiumMg += entry.sodiumMg || 0;
      });

      return totals;
    } catch (error) {
      console.error('Failed to calculate daily totals:', error);
      throw new Error('Failed to calculate nutrition totals');
    }
  }

  /**
   * Get entries for a date range
   */
  static async getEntriesInRange(startDate: string, endDate: string): Promise<FoodDiaryEntry[]> {
    try {
      return await db.foodDiaryEntries
        .where('entryDate')
        .between(startDate, endDate, true, true)
        .sortBy('createdAt');
    } catch (error) {
      console.error('Failed to get entries in range:', error);
      throw new Error('Failed to load food entries');
    }
  }

  /**
   * Get total entry count
   */
  static async getTotalCount(): Promise<number> {
    try {
      return await db.foodDiaryEntries.count();
    } catch (error) {
      console.error('Failed to get entry count:', error);
      return 0;
    }
  }
}
