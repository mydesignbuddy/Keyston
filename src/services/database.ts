import Dexie, { Table } from 'dexie';
import {
  UserSettings,
  FoodDiaryEntry,
  Food,
  FavoriteFood,
  WorkoutEntry,
  WorkoutExercise,
  WorkoutPreset,
  PresetExercise,
  GoogleDriveSync,
  ApiCache,
} from '../models';

/**
 * Keyston Database
 * IndexedDB database using Dexie.js wrapper
 * All user data stored locally - no backend server
 */
export class KeystonDatabase extends Dexie {
  // Object stores (tables)
  userSettings!: Table<UserSettings, string>;
  foodDiaryEntries!: Table<FoodDiaryEntry, string>;
  foods!: Table<Food, string>;
  favoriteFoods!: Table<FavoriteFood, string>;
  workoutEntries!: Table<WorkoutEntry, string>;
  workoutExercises!: Table<WorkoutExercise, string>;
  workoutPresets!: Table<WorkoutPreset, string>;
  presetExercises!: Table<PresetExercise, string>;
  googleDriveSync!: Table<GoogleDriveSync, string>;
  apiCache!: Table<ApiCache, string>;

  constructor() {
    super('KeystonDB');

    // Define database schema
    // Version 1: Initial schema
    this.version(1).stores({
      // User settings (single record)
      userSettings: 'id, updatedAt',

      // Food diary entries - indexed by date and meal type
      foodDiaryEntries: 'id, foodId, entryDate, mealType, [entryDate+mealType], createdAt',

      // Foods cache - indexed by name and barcode for search
      foods: 'id, name, barcode, dataSource, createdAt',

      // Favorite foods - indexed by last used
      favoriteFoods: 'id, foodId, lastUsedAt, usageCount',

      // Workout entries - indexed by date
      workoutEntries: 'id, presetId, workoutDate, workoutType, createdAt',

      // Workout exercises - indexed by workout entry
      workoutExercises: 'id, workoutEntryId, orderIndex',

      // Workout presets - indexed by name
      workoutPresets: 'id, presetName, workoutType, createdAt',

      // Preset exercises - indexed by preset
      presetExercises: 'id, presetId, orderIndex',

      // Google Drive sync metadata (single record)
      googleDriveSync: 'id, lastSyncAt',

      // API cache - indexed by cache key with TTL
      apiCache: 'cacheKey, cachedAt',
    });
  }

  /**
   * Initialize database with default data
   * Called on first app launch
   */
  async initializeDefaults(): Promise<void> {
    try {
      // Check if user settings exist
      const existingSettings = await this.userSettings.get('settings');
      if (!existingSettings) {
        // Import default settings from models
        const { DEFAULT_USER_SETTINGS } = await import('../models/UserSettings');
        await this.userSettings.add(DEFAULT_USER_SETTINGS);
      }

      // Check if sync settings exist
      const existingSync = await this.googleDriveSync.get('sync');
      if (!existingSync) {
        const { DEFAULT_GOOGLE_DRIVE_SYNC } = await import('../models/GoogleDriveSync');
        await this.googleDriveSync.add(DEFAULT_GOOGLE_DRIVE_SYNC);
      }
    } catch (error) {
      console.error('Failed to initialize database defaults:', error);
      throw error;
    }
  }

  /**
   * Clear all user data from database
   * Used for testing or data reset
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        this.foodDiaryEntries.clear(),
        this.foods.clear(),
        this.favoriteFoods.clear(),
        this.workoutEntries.clear(),
        this.workoutExercises.clear(),
        this.workoutPresets.clear(),
        this.presetExercises.clear(),
        this.apiCache.clear(),
      ]);

      // Reinitialize defaults after clearing
      await this.initializeDefaults();
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw error;
    }
  }

  /**
   * Export all user data as JSON
   * Used for backup/export functionality
   */
  async exportAllData(): Promise<string> {
    try {
      const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        userSettings: await this.userSettings.toArray(),
        foodDiaryEntries: await this.foodDiaryEntries.toArray(),
        foods: await this.foods.toArray(),
        favoriteFoods: await this.favoriteFoods.toArray(),
        workoutEntries: await this.workoutEntries.toArray(),
        workoutExercises: await this.workoutExercises.toArray(),
        workoutPresets: await this.workoutPresets.toArray(),
        presetExercises: await this.presetExercises.toArray(),
        googleDriveSync: await this.googleDriveSync.toArray(),
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   * Returns counts of records in each table
   */
  async getStatistics(): Promise<Record<string, number>> {
    try {
      const [
        userSettingsCount,
        foodDiaryEntriesCount,
        foodsCount,
        favoriteFoodsCount,
        workoutEntriesCount,
        workoutExercisesCount,
        workoutPresetsCount,
        presetExercisesCount,
        apiCacheCount,
      ] = await Promise.all([
        this.userSettings.count(),
        this.foodDiaryEntries.count(),
        this.foods.count(),
        this.favoriteFoods.count(),
        this.workoutEntries.count(),
        this.workoutExercises.count(),
        this.workoutPresets.count(),
        this.presetExercises.count(),
        this.apiCache.count(),
      ]);

      return {
        userSettings: userSettingsCount,
        foodDiaryEntries: foodDiaryEntriesCount,
        foods: foodsCount,
        favoriteFoods: favoriteFoodsCount,
        workoutEntries: workoutEntriesCount,
        workoutExercises: workoutExercisesCount,
        workoutPresets: workoutPresetsCount,
        presetExercises: presetExercisesCount,
        apiCache: apiCacheCount,
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }
}

/**
 * Singleton database instance
 * Use this throughout the app for all database operations
 */
export const db = new KeystonDatabase();
