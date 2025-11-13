import { db } from './database';
import { UserSettings, DEFAULT_USER_SETTINGS } from '../models';

/**
 * User Settings Service
 * Manages user preferences and settings
 */
export class UserSettingsService {
  /**
   * Get current user settings
   * Returns default settings if none exist
   */
  static async getSettings(): Promise<UserSettings> {
    try {
      const settings = await db.userSettings.get('settings');
      return settings || DEFAULT_USER_SETTINGS;
    } catch (error) {
      console.error('Failed to get user settings:', error);
      throw new Error('Failed to load user settings');
    }
  }

  /**
   * Update user settings
   * Merges provided updates with existing settings
   */
  static async updateSettings(updates: Partial<Omit<UserSettings, 'id'>>): Promise<UserSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings: UserSettings = {
        ...currentSettings,
        ...updates,
        id: 'settings', // Ensure ID is always 'settings'
        updatedAt: new Date(),
      };

      await db.userSettings.put(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Failed to update user settings:', error);
      throw new Error('Failed to save user settings');
    }
  }

  /**
   * Update daily calorie goal
   */
  static async updateCalorieGoal(calories: number): Promise<void> {
    if (calories <= 0) {
      throw new Error('Calorie goal must be positive');
    }

    try {
      await this.updateSettings({ dailyCalorieGoal: calories });
    } catch (error) {
      console.error('Failed to update calorie goal:', error);
      throw error;
    }
  }

  /**
   * Update macro targets
   */
  static async updateMacroTargets(macros: {
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  }): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedMacros = {
        ...currentSettings.macroTargets,
        ...macros,
      };

      await this.updateSettings({ macroTargets: updatedMacros });
    } catch (error) {
      console.error('Failed to update macro targets:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(preferences: Partial<UserSettings['preferences']>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedPreferences = {
        ...currentSettings.preferences,
        ...preferences,
      };

      await this.updateSettings({ preferences: updatedPreferences });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }

  /**
   * Reset settings to defaults
   */
  static async resetToDefaults(): Promise<UserSettings> {
    try {
      await db.userSettings.put(DEFAULT_USER_SETTINGS);
      return DEFAULT_USER_SETTINGS;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw new Error('Failed to reset settings to defaults');
    }
  }
}
