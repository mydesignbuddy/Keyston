/**
 * Theme Management Tests
 * Tests the theme system functionality including light, dark, and system modes
 */

import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useTheme } from '../AppContext';

describe('Theme Management', () => {
  let mockClassList: DOMTokenList;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock document.body.classList
    const classes: string[] = [];
    mockClassList = {
      add: jest.fn((...tokens: string[]) => {
        tokens.forEach((token) => {
          if (!classes.includes(token)) {
            classes.push(token);
          }
        });
      }),
      remove: jest.fn((...tokens: string[]) => {
        tokens.forEach((token) => {
          const index = classes.indexOf(token);
          if (index > -1) {
            classes.splice(index, 1);
          }
        });
      }),
      contains: jest.fn((token: string) => classes.includes(token)),
      toggle: jest.fn(),
      replace: jest.fn(),
      item: jest.fn(),
      value: '',
      length: 0,
      forEach: jest.fn(),
      entries: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      [Symbol.iterator]: jest.fn(),
    } as DOMTokenList;

    Object.defineProperty(document.body, 'classList', {
      value: mockClassList,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Theme Application', () => {
    it('should apply light-theme class when theme is set to light', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'light' }}>{children}</AppProvider>
      );

      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockClassList.remove).toHaveBeenCalledWith('light-theme', 'dark-theme');
      });
      expect(mockClassList.add).toHaveBeenCalledWith('light-theme');
    });

    it('should apply dark-theme class when theme is set to dark', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'dark' }}>{children}</AppProvider>
      );

      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockClassList.remove).toHaveBeenCalledWith('light-theme', 'dark-theme');
      });
      expect(mockClassList.add).toHaveBeenCalledWith('dark-theme');
    });

    it('should not apply any class when theme is set to system', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'system' }}>{children}</AppProvider>
      );

      renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(mockClassList.remove).toHaveBeenCalledWith('light-theme', 'dark-theme');
      });
      // Should not add any class for system theme
      expect(mockClassList.add).not.toHaveBeenCalledWith('light-theme');
      expect(mockClassList.add).not.toHaveBeenCalledWith('dark-theme');
    });
  });

  describe('Theme Switching', () => {
    it('should switch from light to dark theme', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'light' }}>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Initial state should be light
      expect(result.current[0]).toBe('light');

      // Switch to dark
      await waitFor(() => {
        result.current[1]('dark');
      });

      await waitFor(() => {
        expect(result.current[0]).toBe('dark');
      });
      expect(mockClassList.add).toHaveBeenCalledWith('dark-theme');
    });

    it('should switch from dark to system theme', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'dark' }}>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Initial state should be dark
      expect(result.current[0]).toBe('dark');

      // Switch to system
      await waitFor(() => {
        result.current[1]('system');
      });

      await waitFor(() => {
        expect(result.current[0]).toBe('system');
      });
      // Should remove dark-theme class
      expect(mockClassList.remove).toHaveBeenCalledWith('light-theme', 'dark-theme');
    });

    it('should switch from system to light theme', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'system' }}>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Initial state should be system
      expect(result.current[0]).toBe('system');

      // Switch to light
      await waitFor(() => {
        result.current[1]('light');
      });

      await waitFor(() => {
        expect(result.current[0]).toBe('light');
      });
      expect(mockClassList.add).toHaveBeenCalledWith('light-theme');
    });
  });

  describe('Theme Persistence', () => {
    it('should persist theme preference to localStorage', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'dark' }}>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Change theme
      await waitFor(() => {
        result.current[1]('light');
      });

      await waitFor(() => {
        const stored = localStorage.getItem('keyston_ui_preferences');
        expect(stored).toBeTruthy();
      });
      const stored = localStorage.getItem('keyston_ui_preferences');
      const parsed = stored ? JSON.parse(stored) : null;
      expect(parsed?.theme).toBe('light');
    });

    it('should restore theme from localStorage on initialization', async () => {
      // Set theme in localStorage
      localStorage.setItem(
        'keyston_ui_preferences',
        JSON.stringify({ theme: 'dark', isLoading: false })
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current[0]).toBe('dark');
      });
    });
  });

  describe('Theme Hook', () => {
    it('should return current theme and setter function', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialState={{ theme: 'light' }}>{children}</AppProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe('light');
      expect(typeof result.current[1]).toBe('function');
    });
  });
});
