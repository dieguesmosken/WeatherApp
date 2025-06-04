import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationInput from '../components/LocationInput';
import { I18nProvider } from '../lib/i18n/i18nContext'; // Adjusted path

// Helper to render with I18nProvider
const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('LocationInput', () => {
  it('renders an input and a button with Portuguese text by default', () => {
    renderWithI18n(<LocationInput onLocationSubmit={() => {}} />);
    expect(screen.getByPlaceholderText('Digite o nome da cidade')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar Clima/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    renderWithI18n(<LocationInput onLocationSubmit={() => {}} />);
    const input = screen.getByPlaceholderText('Digite o nome da cidade');
    fireEvent.change(input, { target: { value: 'Londres' } });
    expect(input.value).toBe('Londres');
  });

  it('calls onLocationSubmit with the input value when form is submitted', () => {
    const mockSubmit = jest.fn();
<<<<<<< HEAD
    renderWithI18n(<LocationInput onLocationSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Digite o nome da cidade');
    const button = screen.getByRole('button', { name: /Buscar Clima/i });
=======
    render(<LocationInput onLocationSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Enter city name');
    const button = screen.getByRole('button', { name: /get weather/i });
>>>>>>> 629dc5c8476551a5a8ccf353e10aa090c580eef8

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Paris');
  });
<<<<<<< HEAD
=======

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
>>>>>>> 629dc5c8476551a5a8ccf353e10aa090c580eef8
});
