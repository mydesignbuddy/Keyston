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
 * Storage key for persisting state to localStorage
 */
const STORAGE_KEY = 'keyston_app_state';

/**
 * App Context for global state management
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Load state from localStorage
 */
const loadStateFromStorage = (): Partial<AppState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date string back to Date object
      if (parsed.currentDate) {
        parsed.currentDate = new Date(parsed.currentDate);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load state from storage:', error);
  }
  return {};
};

/**
 * Save state to localStorage
 */
const saveStateToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to storage:', error);
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
 * Manages global application state and persists it to localStorage
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children, initialState }) => {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<AppState>(() => {
    const storedState = loadStateFromStorage();
    return {
      ...DEFAULT_APP_STATE,
      ...storedState,
      ...initialState, // Override with test initial state if provided
    };
  });

  // Track if we should persist to localStorage
  const [shouldPersist, setShouldPersist] = useState(true);

  // Persist state to localStorage whenever it changes (if persistence is enabled)
  useEffect(() => {
    if (shouldPersist) {
      saveStateToStorage(state);
    }
  }, [state, shouldPersist]);

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
   * Reset state to defaults
   */
  const resetState = (): void => {
    setShouldPersist(false);
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_APP_STATE);
    // Re-enable persistence after reset
    setTimeout(() => setShouldPersist(true), 0);
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
