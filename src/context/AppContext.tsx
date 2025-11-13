import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, DailyGoals, Theme, DEFAULT_APP_STATE } from '../models/AppState';

/**
 * Context value type with state and updater functions
 */
interface AppContextType {
  state: AppState;
  setCurrentDate: (date: Date) => void;
  updateDailyGoals: (goals: DailyGoals) => void;
  setTheme: (theme: Theme) => void;
  setIsLoading: (isLoading: boolean) => void;
  resetState: () => void;
}

/**
 * Storage key for persisting UI preferences to localStorage
 * Note: Only non-health-related preferences (theme, UI state) are stored here.
 * Health data like dailyGoals and currentDate should be managed via IndexedDB in production.
 */
const STORAGE_KEY = 'keyston_ui_preferences';

/**
 * Interface for UI preferences stored in localStorage
 * Only contains non-health-related UI state
 */
interface UIPreferences {
  theme: Theme;
  isLoading: boolean;
}

/**
 * App Context for global state management
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Load UI preferences from localStorage
 * Note: dailyGoals and currentDate are NOT persisted to localStorage
 * as they are health-related data that should use IndexedDB
 */
const loadPreferencesFromStorage = (): Partial<UIPreferences> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load preferences from storage:', error);
  }
  return {};
};

/**
 * Save UI preferences to localStorage
 * Only saves theme and isLoading (non-health-related preferences)
 */
const savePreferencesToStorage = (preferences: UIPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences to storage:', error);
  }
};

/**
 * Props for AppProvider component
 */
interface AppProviderProps {
  children: ReactNode;
  /**
   * Optional initial state for testing purposes
   */
  initialState?: Partial<AppState>;
}

/**
 * App Context Provider Component
 * Manages global application state.
 * Only theme and isLoading are persisted to localStorage (UI preferences).
 * Health-related data (dailyGoals, currentDate) remain in memory and should
 * be managed via IndexedDB in production features.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children, initialState }) => {
  // Initialize state from localStorage preferences or defaults
  const [state, setState] = useState<AppState>(() => {
    const storedPreferences = loadPreferencesFromStorage();
    return {
      ...DEFAULT_APP_STATE,
      // Only apply UI preferences from localStorage
      ...(storedPreferences.theme && { theme: storedPreferences.theme }),
      ...(storedPreferences.isLoading !== undefined && { isLoading: storedPreferences.isLoading }),
      ...initialState, // Override with test initial state if provided
    };
  });

  // Persist only UI preferences to localStorage whenever they change
  useEffect(() => {
    const preferences: UIPreferences = {
      theme: state.theme,
      isLoading: state.isLoading,
    };
    savePreferencesToStorage(preferences);
  }, [state.theme, state.isLoading]);

  /**
   * Update the current date
   */
  const setCurrentDate = (date: Date): void => {
    setState((prev) => ({ ...prev, currentDate: date }));
  };

  /**
   * Update daily nutrition goals
   */
  const updateDailyGoals = (goals: DailyGoals): void => {
    setState((prev) => ({ ...prev, dailyGoals: goals }));
  };

  /**
   * Update theme preference
   */
  const setTheme = (theme: Theme): void => {
    setState((prev) => ({ ...prev, theme }));
  };

  /**
   * Update loading state
   */
  const setIsLoading = (isLoading: boolean): void => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  /**
   * Reset state to defaults and clear localStorage
   */
  const resetState = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_APP_STATE);
  };

  const contextValue: AppContextType = {
    state,
    setCurrentDate,
    updateDailyGoals,
    setTheme,
    setIsLoading,
    resetState,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to access app context
 * @throws Error if used outside of AppProvider
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * Custom hook to access current date
 */
export const useCurrentDate = (): [Date, (date: Date) => void] => {
  const { state, setCurrentDate } = useApp();
  return [state.currentDate, setCurrentDate];
};

/**
 * Custom hook to access daily goals
 */
export const useDailyGoals = (): [DailyGoals, (goals: DailyGoals) => void] => {
  const { state, updateDailyGoals } = useApp();
  return [state.dailyGoals, updateDailyGoals];
};

/**
 * Custom hook to access theme
 */
export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const { state, setTheme } = useApp();
  return [state.theme, setTheme];
};

/**
 * Custom hook to access loading state
 */
export const useLoading = (): [boolean, (isLoading: boolean) => void] => {
  const { state, setIsLoading } = useApp();
  return [state.isLoading, setIsLoading];
};
