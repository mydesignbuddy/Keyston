/**
 * Daily nutrition goals configuration
 */
export interface DailyGoals {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

/**
 * Theme configuration
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Global application state
 */
export interface AppState {
  /**
   * Currently selected date for food diary and other date-specific views
   */
  currentDate: Date;

  /**
   * User's daily nutrition goals
   */
  dailyGoals: DailyGoals;

  /**
   * Current theme preference
   */
  theme: Theme;

  /**
   * Whether the app is in loading state
   */
  isLoading: boolean;
}

/**
 * Default daily nutrition goals
 */
export const DEFAULT_DAILY_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

/**
 * Default application state
 */
export const DEFAULT_APP_STATE: AppState = {
  currentDate: new Date(),
  dailyGoals: DEFAULT_DAILY_GOALS,
  theme: 'system',
  isLoading: false,
};
