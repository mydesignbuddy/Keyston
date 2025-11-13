import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { AppProvider } from '../context/AppContext';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render theme selector', () => {
    render(
      <AppProvider>
        <ThemeToggle />
      </AppProvider>
    );

    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('should render with light theme', () => {
    render(
      <AppProvider initialState={{ theme: 'light' }}>
        <ThemeToggle />
      </AppProvider>
    );

    // Verify the component renders correctly
    const themeLabel = screen.getByText('Theme');
    expect(themeLabel).toBeInTheDocument();
  });

  it('should render with dark theme', () => {
    render(
      <AppProvider initialState={{ theme: 'dark' }}>
        <ThemeToggle />
      </AppProvider>
    );

    // Verify the component renders correctly
    const themeLabel = screen.getByText('Theme');
    expect(themeLabel).toBeInTheDocument();
  });

  it('should render with system theme', () => {
    render(
      <AppProvider initialState={{ theme: 'system' }}>
        <ThemeToggle />
      </AppProvider>
    );

    // Verify the component renders correctly
    const themeLabel = screen.getByText('Theme');
    expect(themeLabel).toBeInTheDocument();
  });
});
