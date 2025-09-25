import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FloatingActionButton from '../components/FloatingActionButton';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('FloatingActionButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders FloatingActionButton with default props', () => {
    renderWithTheme(
      <FloatingActionButton onClick={mockOnClick} />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'add');
  });

  
  test('calls onClick when button is clicked', () => {
    renderWithTheme(
      <FloatingActionButton onClick={mockOnClick} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not render when visible is false', () => {
    renderWithTheme(
      <FloatingActionButton 
        onClick={mockOnClick} 
        visible={false} 
      />
    );

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  test('renders when visible is true', () => {
    renderWithTheme(
      <FloatingActionButton 
        onClick={mockOnClick} 
        visible={true} 
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    renderWithTheme(
      <FloatingActionButton 
        onClick={mockOnClick} 
        disabled={true} 
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });


});