import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationInput from '../LocationInput';
import { I18nProvider } from '../../lib/i18n/i18nContext'; // Adjusted path

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
    renderWithI18n(<LocationInput onLocationSubmit={mockSubmit} />);
    const input = screen.getByPlaceholderText('Digite o nome da cidade');
    const button = screen.getByRole('button', { name: /Buscar Clima/i });

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Paris');
  });
});
