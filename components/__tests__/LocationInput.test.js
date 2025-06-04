import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationInput from '../LocationInput';

describe('LocationInput', () => {
  it('renders an input and a button', () => {
    render(<LocationInput onLocationSubmit={() => {}} />);
    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<LocationInput onLocationSubmit={() => {}} />);
    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'London' } });
    expect(input.value).toBe('London');
  });

  it('calls onLocationSubmit with the input value when form is submitted', () => {
    const mockSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Enter city name');
    const button = screen.getByRole('button', { name: /get weather/i });

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Paris');
  });

  it('does not call onLocationSubmit if input is empty or only whitespace', () => {
    const mockSubmit = jest.fn();
    render(<LocationInput onLocationSubmit={mockSubmit} />);
    const button = screen.getByRole('button', { name: /get weather/i });

    // Test with empty input
    fireEvent.click(button);
    expect(mockSubmit).not.toHaveBeenCalled();

    // Test with whitespace
    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
