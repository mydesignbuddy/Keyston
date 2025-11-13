import React from 'react';
import { render, screen } from '@testing-library/react';
import Workouts from './Workouts';

test('renders Workouts page with header', () => {
  render(<Workouts />);
  // Look for heading text which is unique to the page
  const headingElement = screen.getByText(/Workout Tracker/i);
  expect(headingElement).toBeInTheDocument();
});

test('displays workout features', () => {
  render(<Workouts />);
  const descriptionText = screen.getByText(/Log your exercises and track your fitness progress/i);
  expect(descriptionText).toBeInTheDocument();
});
