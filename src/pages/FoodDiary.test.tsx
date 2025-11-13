import React from 'react';
import { render, screen } from '@testing-library/react';
import FoodDiary from './FoodDiary';
import { AppProvider } from '../context/AppContext';

test('renders Food Diary page with header', () => {
  render(
    <AppProvider>
      <FoodDiary />
    </AppProvider>
  );
  // Look for heading text which is unique to the page
  const headingElement = screen.getByText(/Daily Nutrition Tracking/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays food diary features', () => {
  render(
    <AppProvider>
      <FoodDiary />
    </AppProvider>
  );
  const descriptionText = screen.getByText(/Track your meals and monitor your nutritional goals/i);
  expect(descriptionText).toBeInTheDocument();
});

test('displays current date from state', () => {
  render(
    <AppProvider>
      <FoodDiary />
    </AppProvider>
  );
  const dateCard = screen.getByText(/Current Date/i);
  expect(dateCard).toBeInTheDocument();
});

test('displays daily goals from state', () => {
  render(
    <AppProvider>
      <FoodDiary />
    </AppProvider>
  );
  expect(screen.getByText(/Your Daily Goals/i)).toBeInTheDocument();
  expect(screen.getByText(/2000 kcal/i)).toBeInTheDocument();
  expect(screen.getByText(/150g/i)).toBeInTheDocument(); // protein
  expect(screen.getByText(/200g/i)).toBeInTheDocument(); // carbs
  expect(screen.getByText(/65g/i)).toBeInTheDocument(); // fat
});
