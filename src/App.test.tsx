import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Keyston app', () => {
  render(<App />);
  const headingElement = screen.getByText(/Privacy-First Fitness Tracker/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders tab navigation with all tabs', () => {
  render(<App />);
  
  // Check for tab buttons in the tab bar
  const tabBar = document.querySelector('ion-tab-bar');
  expect(tabBar).toBeInTheDocument();
  
  const tabButtons = document.querySelectorAll('ion-tab-button');
  expect(tabButtons).toHaveLength(3);
  
  // Verify tab names by checking aria labels or tab attributes
  const homeTab = document.querySelector('[tab="home"]');
  const foodDiaryTab = document.querySelector('[tab="food-diary"]');
  const workoutsTab = document.querySelector('[tab="workouts"]');
  
  expect(homeTab).toBeInTheDocument();
  expect(foodDiaryTab).toBeInTheDocument();
  expect(workoutsTab).toBeInTheDocument();
});
