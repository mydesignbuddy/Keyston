import { db } from '../database';
import { UserSettingsService } from '../userSettingsService';
import { DEFAULT_USER_SETTINGS } from '../../models';

describe('UserSettingsService', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    await db.initializeDefaults();
  });

  afterAll(async () => {
    await db.delete();
  });

  describe('getSettings', () => {
    it('should return default settings when none exist', async () => {
      await db.userSettings.clear();
      const settings = await UserSettingsService.getSettings();

      expect(settings).toBeDefined();
      expect(settings.id).toBe('settings');
      expect(settings.dailyCalorieGoal).toBe(DEFAULT_USER_SETTINGS.dailyCalorieGoal);
    });

    it('should return existing settings', async () => {
      const settings = await UserSettingsService.getSettings();

      expect(settings).toBeDefined();
      expect(settings.id).toBe('settings');
    });
  });

  describe('updateSettings', () => {
    it('should update settings', async () => {
      const updated = await UserSettingsService.updateSettings({
        displayName: 'Test User',
        dailyCalorieGoal: 2500,
      });

      expect(updated.displayName).toBe('Test User');
      expect(updated.dailyCalorieGoal).toBe(2500);
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    it('should merge with existing settings', async () => {
      await UserSettingsService.updateSettings({
        displayName: 'Test User',
      });

      const updated = await UserSettingsService.updateSettings({
        dailyCalorieGoal: 2200,
      });

      expect(updated.displayName).toBe('Test User');
      expect(updated.dailyCalorieGoal).toBe(2200);
    });

    it('should always keep id as "settings"', async () => {
      const updated = await UserSettingsService.updateSettings({
        dailyCalorieGoal: 2500,
      });

      expect(updated.id).toBe('settings');
    });
  });

  describe('updateCalorieGoal', () => {
    it('should update calorie goal', async () => {
      await UserSettingsService.updateCalorieGoal(2800);

      const settings = await UserSettingsService.getSettings();
      expect(settings.dailyCalorieGoal).toBe(2800);
    });

    it('should reject negative calorie goals', async () => {
      await expect(UserSettingsService.updateCalorieGoal(-100)).rejects.toThrow();
    });

    it('should reject zero calorie goals', async () => {
      await expect(UserSettingsService.updateCalorieGoal(0)).rejects.toThrow();
    });
  });

  describe('updateMacroTargets', () => {
    it('should update macro targets', async () => {
      await UserSettingsService.updateMacroTargets({
        protein: 180,
        carbs: 250,
        fat: 70,
      });

      const settings = await UserSettingsService.getSettings();
      expect(settings.macroTargets.protein).toBe(180);
      expect(settings.macroTargets.carbs).toBe(250);
      expect(settings.macroTargets.fat).toBe(70);
    });

    it('should partially update macro targets', async () => {
      await UserSettingsService.updateMacroTargets({
        protein: 160,
      });

      const settings = await UserSettingsService.getSettings();
      expect(settings.macroTargets.protein).toBe(160);
      expect(settings.macroTargets.carbs).toBe(DEFAULT_USER_SETTINGS.macroTargets.carbs);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences', async () => {
      await UserSettingsService.updatePreferences({
        theme: 'dark',
        measurementSystem: 'imperial',
      });

      const settings = await UserSettingsService.getSettings();
      expect(settings.preferences.theme).toBe('dark');
      expect(settings.preferences.measurementSystem).toBe('imperial');
    });

    it('should partially update preferences', async () => {
      await UserSettingsService.updatePreferences({
        theme: 'light',
      });

      const settings = await UserSettingsService.getSettings();
      expect(settings.preferences.theme).toBe('light');
      expect(settings.preferences.measurementSystem).toBe(
        DEFAULT_USER_SETTINGS.preferences.measurementSystem
      );
    });
  });

  describe('resetToDefaults', () => {
    it('should reset to default settings', async () => {
      await UserSettingsService.updateSettings({
        displayName: 'Test User',
        dailyCalorieGoal: 3000,
      });

      const reset = await UserSettingsService.resetToDefaults();

      expect(reset.displayName).toBeUndefined();
      expect(reset.dailyCalorieGoal).toBe(DEFAULT_USER_SETTINGS.dailyCalorieGoal);
    });
  });
});
