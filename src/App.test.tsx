import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppContent } from "./App";

test('renders learn react link', () => {
  render(<AppContent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
