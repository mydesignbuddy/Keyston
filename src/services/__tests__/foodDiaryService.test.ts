import { db } from '../database';
import { FoodDiaryService } from '../foodDiaryService';

describe('FoodDiaryService', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(async () => {
    await db.delete();
  });

  describe('addEntry', () => {
    it('should add a new food diary entry', async () => {
      const entry = await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 150,
        servingUnit: 'g',
        calories: 300,
        proteinG: 20,
        carbsG: 30,
        fatG: 10,
      });

      expect(entry.id).toBeDefined();
      expect(entry.foodId).toBe('food1');
      expect(entry.mealType).toBe('breakfast');
      expect(entry.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs', async () => {
      const entry1 = await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      const entry2 = await FoodDiaryService.addEntry({
        foodId: 'food2',
        entryDate: '2024-01-15',
        mealType: 'lunch',
        servingSize: 200,
        servingUnit: 'g',
        calories: 400,
        proteinG: 25,
        carbsG: 40,
        fatG: 15,
      });

      expect(entry1.id).not.toBe(entry2.id);
    });
  });

  describe('getEntriesForDate', () => {
    beforeEach(async () => {
      await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food2',
        entryDate: '2024-01-15',
        mealType: 'lunch',
        servingSize: 150,
        servingUnit: 'g',
        calories: 350,
        proteinG: 25,
        carbsG: 30,
        fatG: 15,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food3',
        entryDate: '2024-01-16',
        mealType: 'breakfast',
        servingSize: 120,
        servingUnit: 'g',
        calories: 250,
        proteinG: 15,
        carbsG: 25,
        fatG: 8,
      });
    });

    it('should get all entries for a specific date', async () => {
      const entries = await FoodDiaryService.getEntriesForDate('2024-01-15');

      expect(entries).toHaveLength(2);
      expect(entries[0].entryDate).toBe('2024-01-15');
      expect(entries[1].entryDate).toBe('2024-01-15');
    });

    it('should return empty array for date with no entries', async () => {
      const entries = await FoodDiaryService.getEntriesForDate('2024-01-20');

      expect(entries).toHaveLength(0);
    });

    it('should sort entries by creation time', async () => {
      const entries = await FoodDiaryService.getEntriesForDate('2024-01-15');

      expect(entries[0].mealType).toBe('breakfast');
      expect(entries[1].mealType).toBe('lunch');
    });
  });

  describe('getEntriesByMeal', () => {
    beforeEach(async () => {
      await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food2',
        entryDate: '2024-01-15',
        mealType: 'lunch',
        servingSize: 150,
        servingUnit: 'g',
        calories: 350,
        proteinG: 25,
        carbsG: 30,
        fatG: 15,
      });
    });

    it('should get entries for specific meal', async () => {
      const entries = await FoodDiaryService.getEntriesByMeal('2024-01-15', 'breakfast');

      expect(entries).toHaveLength(1);
      expect(entries[0].mealType).toBe('breakfast');
    });
  });

  describe('updateEntry', () => {
    it('should update an entry', async () => {
      const entry = await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      const updated = await FoodDiaryService.updateEntry(entry.id, {
        servingSize: 150,
        calories: 300,
      });

      expect(updated.servingSize).toBe(150);
      expect(updated.calories).toBe(300);
      expect(updated.proteinG).toBe(10); // Unchanged
    });

    it('should throw error for non-existent entry', async () => {
      await expect(
        FoodDiaryService.updateEntry('non-existent', { calories: 100 })
      ).rejects.toThrow();
    });
  });

  describe('deleteEntry', () => {
    it('should delete an entry', async () => {
      const entry = await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      await FoodDiaryService.deleteEntry(entry.id);

      const retrieved = await FoodDiaryService.getEntry(entry.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('calculateDailyTotals', () => {
    beforeEach(async () => {
      await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
        fiberG: 3,
        sugarG: 2,
        sodiumMg: 100,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food2',
        entryDate: '2024-01-15',
        mealType: 'lunch',
        servingSize: 150,
        servingUnit: 'g',
        calories: 400,
        proteinG: 25,
        carbsG: 40,
        fatG: 15,
        fiberG: 5,
        sugarG: 8,
        sodiumMg: 200,
      });
    });

    it('should calculate daily nutrition totals', async () => {
      const totals = await FoodDiaryService.calculateDailyTotals('2024-01-15');

      expect(totals.date).toBe('2024-01-15');
      expect(totals.calories).toBe(600);
      expect(totals.proteinG).toBe(35);
      expect(totals.carbsG).toBe(60);
      expect(totals.fatG).toBe(20);
      expect(totals.fiberG).toBe(8);
      expect(totals.sugarG).toBe(10);
      expect(totals.sodiumMg).toBe(300);
      expect(totals.entryCount).toBe(2);
    });

    it('should return zero totals for date with no entries', async () => {
      const totals = await FoodDiaryService.calculateDailyTotals('2024-01-20');

      expect(totals.calories).toBe(0);
      expect(totals.entryCount).toBe(0);
    });
  });

  describe('getEntriesInRange', () => {
    beforeEach(async () => {
      await FoodDiaryService.addEntry({
        foodId: 'food1',
        entryDate: '2024-01-15',
        mealType: 'breakfast',
        servingSize: 100,
        servingUnit: 'g',
        calories: 200,
        proteinG: 10,
        carbsG: 20,
        fatG: 5,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food2',
        entryDate: '2024-01-16',
        mealType: 'lunch',
        servingSize: 150,
        servingUnit: 'g',
        calories: 300,
        proteinG: 20,
        carbsG: 30,
        fatG: 10,
      });

      await FoodDiaryService.addEntry({
        foodId: 'food3',
        entryDate: '2024-01-18',
        mealType: 'dinner',
        servingSize: 200,
        servingUnit: 'g',
        calories: 400,
        proteinG: 30,
        carbsG: 40,
        fatG: 15,
      });
    });

    it('should get entries within date range', async () => {
      const entries = await FoodDiaryService.getEntriesInRange('2024-01-15', '2024-01-16');

      expect(entries).toHaveLength(2);
      expect(entries[0].entryDate).toBe('2024-01-15');
      expect(entries[1].entryDate).toBe('2024-01-16');
    });

    it('should include boundary dates', async () => {
      const entries = await FoodDiaryService.getEntriesInRange('2024-01-15', '2024-01-18');

      expect(entries).toHaveLength(3);
    });
  });
});
