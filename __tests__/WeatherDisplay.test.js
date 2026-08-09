import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDisplay from '../components/WeatherDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('WeatherDisplay', () => {
  it('renders "Enter a city" message when no data is provided', () => {
    renderWithI18n(<WeatherDisplay data={null} />);
    expect(screen.getByText('Digite uma cidade para ver o clima.')).toBeInTheDocument();
  });

  it('renders API error message when data contains an error code', () => {
    const errorData = { cod: '404', message: 'city not found' };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText('city not found')).toBeInTheDocument();
  });

  it('renders weather information correctly with valid data', () => {
    const validData = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      wind: { speed: 5 }
    };
    renderWithI18n(<WeatherDisplay data={validData} />);
    expect(screen.getByText('Clima em London')).toBeInTheDocument();
    expect(screen.getByText(/15°C/)).toBeInTheDocument();
    expect(screen.getByText(/70%/)).toBeInTheDocument();
  });

  it('handles missing nested data gracefully', () => {
    const incompleteData = {
      name: 'London',
      // sys is missing
      main: { temp: 15 },
      // weather is missing
      // wind is missing
    };
    renderWithI18n(<WeatherDisplay data={incompleteData} />);
    expect(screen.getByText('Clima em London')).toBeInTheDocument();
    expect(screen.getByText(/15°C/)).toBeInTheDocument();
  });

  it('handles missing weather description and icon gracefully', () => {
    const dataWithoutWeatherDetails = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15, humidity: 70 },
      weather: [{}], // Empty weather object
      wind: { speed: 5 }
    };
    renderWithI18n(<WeatherDisplay data={dataWithoutWeatherDetails} />);
    expect(screen.getByText('Clima em London')).toBeInTheDocument();
    expect(screen.getByText(/15°C/)).toBeInTheDocument();
  });
});
