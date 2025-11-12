import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Keyston app', () => {
  render(<App />);
  const headingElement = screen.getByText(/Privacy-First Fitness Tracker/i);
  expect(headingElement).toBeInTheDocument();
});
