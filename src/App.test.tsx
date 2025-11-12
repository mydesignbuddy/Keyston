import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Keyston app', () => {
  render(<App />);
  const headingElement = screen.getByText(/Privacy-First Fitness Tracker/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders tab navigation with all three tabs', () => {
  render(<App />);

  // Verify all three tab labels are present in the tab bar
  // Using getAllByText to find all instances, then checking we have at least 3
  const homeLabels = screen.getAllByText('Home');
  const foodDiaryLabels = screen.getAllByText('Food Diary');
  const workoutsLabels = screen.getAllByText('Workouts');

  // Each tab label should appear at least once
  expect(homeLabels.length).toBeGreaterThanOrEqual(1);
  expect(foodDiaryLabels.length).toBeGreaterThanOrEqual(1);
  expect(workoutsLabels.length).toBeGreaterThanOrEqual(1);
});
