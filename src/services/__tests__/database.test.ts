import { KeystonDatabase, db } from '../database';
import { DEFAULT_USER_SETTINGS, DEFAULT_GOOGLE_DRIVE_SYNC } from '../../models';

describe('KeystonDatabase', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await db.delete();
    await db.open();
  });

  afterAll(async () => {
    // Clean up after all tests
    await db.delete();
  });

  describe('Database Initialization', () => {
    it('should create database instance', () => {
      expect(db).toBeInstanceOf(KeystonDatabase);
    });

    it('should have all required tables', () => {
      expect(db.userSettings).toBeDefined();
      expect(db.foodDiaryEntries).toBeDefined();
      expect(db.foods).toBeDefined();
      expect(db.favoriteFoods).toBeDefined();
      expect(db.workoutEntries).toBeDefined();
      expect(db.workoutExercises).toBeDefined();
      expect(db.workoutPresets).toBeDefined();
      expect(db.presetExercises).toBeDefined();
      expect(db.googleDriveSync).toBeDefined();
      expect(db.apiCache).toBeDefined();
    });

    it('should initialize defaults', async () => {
      await db.initializeDefaults();

      const settings = await db.userSettings.get('settings');
      expect(settings).toBeDefined();
      expect(settings?.id).toBe('settings');
      expect(settings?.dailyCalorieGoal).toBe(DEFAULT_USER_SETTINGS.dailyCalorieGoal);

      const sync = await db.googleDriveSync.get('sync');
      expect(sync).toBeDefined();
      expect(sync?.id).toBe('sync');
      expect(sync?.autoSyncEnabled).toBe(DEFAULT_GOOGLE_DRIVE_SYNC.autoSyncEnabled);
    });

    it('should not duplicate defaults on multiple init calls', async () => {
      await db.initializeDefaults();
      await db.initializeDefaults();

      const settingsCount = await db.userSettings.count();
      expect(settingsCount).toBe(1);

      const syncCount = await db.googleDriveSync.count();
      expect(syncCount).toBe(1);
    });
  });

  describe('clearAllData', () => {
    it('should clear all user data', async () => {
      // Add some test data
      await db.foodDiaryEntries.add({
        id: '1',
        foodId: 'food1',
        entryDate: '2024-01-01',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        createdAt: new Date(),
      });

      await db.foods.add({
        id: 'food1',
        name: 'Test Food',
        dataSource: 'manual',
        servingSizeDefault: 100,
        servingUnitDefault: 'g',
        caloriesPerServing: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        createdAt: new Date(),
      });

      // Clear all data
      await db.clearAllData();

      // Verify data is cleared
      const entriesCount = await db.foodDiaryEntries.count();
      expect(entriesCount).toBe(0);

      const foodsCount = await db.foods.count();
      expect(foodsCount).toBe(0);

      // Verify defaults are reinitialized
      const settings = await db.userSettings.get('settings');
      expect(settings).toBeDefined();
    });
  });

  describe('exportAllData', () => {
    it('should export all data as JSON', async () => {
      await db.initializeDefaults();

      await db.foodDiaryEntries.add({
        id: '1',
        foodId: 'food1',
        entryDate: '2024-01-01',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        createdAt: new Date(),
      });

      const exported = await db.exportAllData();
      expect(exported).toBeDefined();

      const data = JSON.parse(exported);
      expect(data.version).toBe(1);
      expect(data.exportedAt).toBeDefined();
      expect(data.userSettings).toHaveLength(1);
      expect(data.foodDiaryEntries).toHaveLength(1);
      expect(data.foodDiaryEntries[0].id).toBe('1');
    });

    it('should export empty arrays for empty tables', async () => {
      const exported = await db.exportAllData();
      const data = JSON.parse(exported);

      expect(data.foodDiaryEntries).toEqual([]);
      expect(data.foods).toEqual([]);
      expect(data.workoutEntries).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for all tables', async () => {
      await db.initializeDefaults();

      await db.foodDiaryEntries.add({
        id: '1',
        foodId: 'food1',
        entryDate: '2024-01-01',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        createdAt: new Date(),
      });

      await db.foods.add({
        id: 'food1',
        name: 'Test Food',
        dataSource: 'manual',
        servingSizeDefault: 100,
        servingUnitDefault: 'g',
        caloriesPerServing: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        createdAt: new Date(),
      });

      const stats = await db.getStatistics();

      expect(stats.userSettings).toBe(1);
      expect(stats.foodDiaryEntries).toBe(1);
      expect(stats.foods).toBe(1);
      expect(stats.favoriteFoods).toBe(0);
      expect(stats.workoutEntries).toBe(0);
    });
  });
});
