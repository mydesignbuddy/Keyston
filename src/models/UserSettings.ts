/**
 * User settings and preferences
 * Stored as a single record with id='settings'
 */
export interface UserSettings {
  id: string; // Always 'settings'
  displayName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  heightCm?: number;
  currentWeightKg?: number;
  dailyCalorieGoal: number;
  macroTargets: MacroTargets;
  preferences: UserPreferences;
  updatedAt: Date;
}

/**
 * Daily macro nutrient targets
 */
export interface MacroTargets {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams (optional)
}

/**
 * User preferences for app behavior
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  measurementSystem?: 'metric' | 'imperial';
  defaultMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  autoBackup?: boolean;
  reminderEnabled?: boolean;
  reminderTime?: string; // HH:MM format
}

/**
 * Default user settings
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  id: 'settings',
  dailyCalorieGoal: 2000,
  macroTargets: {
    protein: 150,
    carbs: 200,
    fat: 65,
  },
  preferences: {
    theme: 'system',
    measurementSystem: 'metric',
    defaultMealType: 'breakfast',
    autoBackup: false,
    reminderEnabled: false,
  },
  updatedAt: new Date(),
};
