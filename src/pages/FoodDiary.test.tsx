import React from 'react';
import { render, screen } from '@testing-library/react';
import FoodDiary from './FoodDiary';

test('renders Food Diary page with header', () => {
  render(<FoodDiary />);
  // Look for heading text which is unique to the page
  const headingElement = screen.getByText(/Daily Nutrition Tracking/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays food diary features', () => {
  render(<FoodDiary />);
  const descriptionText = screen.getByText(/Track your meals and monitor your nutritional goals/i);
  expect(descriptionText).toBeInTheDocument();
});
