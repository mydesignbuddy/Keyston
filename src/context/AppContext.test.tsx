import React from 'react';
import { renderHook, act } from '@testing-library/react';
import {
  AppProvider,
  useApp,
  useCurrentDate,
  useDailyGoals,
  useTheme,
  useLoading,
} from './AppContext';
import { DEFAULT_APP_STATE, DEFAULT_DAILY_GOALS } from '../models/AppState';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('AppContext', () => {
  describe('useApp hook', () => {
    it('should throw error when used outside of AppProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        // Intentionally empty to suppress error output in tests
      });

      expect(() => {
        renderHook(() => useApp());
      }).toThrow('useApp must be used within AppProvider');

      consoleError.mockRestore();
    });

    it('should provide default state when initialized', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      expect(result.current.state.dailyGoals).toEqual(DEFAULT_DAILY_GOALS);
      expect(result.current.state.theme).toBe('system');
      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.currentDate).toBeInstanceOf(Date);
    });

    it('should accept custom initial state', () => {
      const customDate = new Date('2024-01-01');
      const customGoals = { calories: 2500, protein: 200, carbs: 250, fat: 80 };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ currentDate: customDate, dailyGoals: customGoals }}>
          {children}
        </AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      expect(result.current.state.currentDate).toEqual(customDate);
      expect(result.current.state.dailyGoals).toEqual(customGoals);
    });
  });

  describe('state persistence', () => {
    it('should persist only UI preferences (theme) to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      const stored = JSON.parse(localStorage.getItem('keyston_ui_preferences') || '{}');
      expect(stored.theme).toBe('dark');
      // Health data should NOT be in localStorage
      expect(stored.dailyGoals).toBeUndefined();
      expect(stored.currentDate).toBeUndefined();
    });

    it('should load only UI preferences from localStorage on mount', () => {
      const savedPreferences = {
        theme: 'dark',
        isLoading: false,
      };
      localStorage.setItem('keyston_ui_preferences', JSON.stringify(savedPreferences));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      // Theme should be loaded from localStorage
      expect(result.current.state.theme).toBe('dark');
      // Health data should use defaults (not from localStorage)
      expect(result.current.state.dailyGoals.calories).toBe(DEFAULT_DAILY_GOALS.calories);
    });

    it('should not persist health data (dailyGoals, currentDate) to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateDailyGoals({ calories: 3000, protein: 200, carbs: 300, fat: 100 });
        result.current.setCurrentDate(new Date('2024-01-01'));
      });

      const stored = JSON.parse(localStorage.getItem('keyston_ui_preferences') || '{}');
      // Health data should NOT be persisted to localStorage
      expect(stored.dailyGoals).toBeUndefined();
      expect(stored.currentDate).toBeUndefined();
      // Only UI preferences should be stored
      expect(stored.theme).toBeDefined();
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('keyston_ui_preferences', 'invalid json');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      // Should fall back to default state
      expect(result.current.state).toBeDefined();
      expect(result.current.state.theme).toBe(DEFAULT_APP_STATE.theme);
    });
  });

  describe('setCurrentDate', () => {
    it('should update current date', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });
      const newDate = new Date('2024-06-15');

      act(() => {
        result.current.setCurrentDate(newDate);
      });

      expect(result.current.state.currentDate).toEqual(newDate);
    });
  });

  describe('updateDailyGoals', () => {
    it('should update daily goals', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });
      const newGoals = { calories: 2500, protein: 180, carbs: 250, fat: 70 };

      act(() => {
        result.current.updateDailyGoals(newGoals);
      });

      expect(result.current.state.dailyGoals).toEqual(newGoals);
    });
  });

  describe('setTheme', () => {
    it('should update theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.state.theme).toBe('dark');
    });
  });

  describe('setIsLoading', () => {
    it('should update loading state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setIsLoading(true);
      });

      expect(result.current.state.isLoading).toBe(true);

      act(() => {
        result.current.setIsLoading(false);
      });

      expect(result.current.state.isLoading).toBe(false);
    });
  });

  describe('resetState', () => {
    it('should reset state to defaults and clear localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useApp(), { wrapper });

      // Modify state
      act(() => {
        result.current.setTheme('dark');
        result.current.updateDailyGoals({ calories: 3000, protein: 200, carbs: 300, fat: 100 });
      });

      // Verify state was changed
      expect(result.current.state.theme).toBe('dark');

      // Reset state
      act(() => {
        result.current.resetState();
      });

      // State should be reset to defaults
      expect(result.current.state.theme).toBe(DEFAULT_APP_STATE.theme);
      expect(result.current.state.dailyGoals).toEqual(DEFAULT_DAILY_GOALS);

      // After reset, localStorage should contain default preferences (due to useEffect)
      const stored = JSON.parse(localStorage.getItem('keyston_ui_preferences') || '{}');
      expect(stored.theme).toBe(DEFAULT_APP_STATE.theme);
    });
  });

  describe('convenience hooks', () => {
    it('useCurrentDate should provide date and setter', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useCurrentDate(), { wrapper });
      const newDate = new Date('2024-12-25');

      expect(result.current[0]).toBeInstanceOf(Date);

      act(() => {
        result.current[1](newDate);
      });

      expect(result.current[0]).toEqual(newDate);
    });

    it('useDailyGoals should provide goals and setter', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useDailyGoals(), { wrapper });
      const newGoals = { calories: 2200, protein: 160, carbs: 220, fat: 70 };

      expect(result.current[0]).toEqual(DEFAULT_DAILY_GOALS);

      act(() => {
        result.current[1](newGoals);
      });

      expect(result.current[0]).toEqual(newGoals);
    });

    it('useTheme should provide theme and setter', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current[0]).toBe('system');

      act(() => {
        result.current[1]('light');
      });

      expect(result.current[0]).toBe('light');
    });

    it('useLoading should provide loading state and setter', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useLoading(), { wrapper });

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('state persistence across navigation', () => {
    it('should maintain UI preferences (theme) when component remounts', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      // First mount
      const { result: result1, unmount } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result1.current.setTheme('dark');
        result1.current.updateDailyGoals({ calories: 2800, protein: 190, carbs: 280, fat: 90 });
      });

      // Theme should be persisted, but health data should not
      expect(result1.current.state.theme).toBe('dark');
      unmount();

      // Second mount (simulating navigation)
      const { result: result2 } = renderHook(() => useApp(), { wrapper });

      // Theme preference should persist
      expect(result2.current.state.theme).toBe('dark');
      // Health data should NOT persist (back to defaults)
      expect(result2.current.state.dailyGoals).toEqual(DEFAULT_DAILY_GOALS);
    });
  });
});
