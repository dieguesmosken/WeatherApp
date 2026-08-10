import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDisplay from '../components/WeatherDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

const mockWeatherData = {
  name: 'Londres',
  main: { temp: 15, feels_like: 14, humidity: 70, pressure: 1012 },
  weather: [{ description: 'nuvens dispersas', icon: '03d' }],
  wind: { speed: 5 },
  visibility: 10000,
  timezone: 0,
  sys: { sunrise: 1699999999, sunset: 1700000000, country: 'GB' },
};

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('WeatherDisplay', () => {
  it('renders weather information correctly in Portuguese', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText('Clima em Londres')).toBeInTheDocument();
    expect(screen.getByText(/15°C/)).toBeInTheDocument();
    expect(screen.getByText(/Condição: nuvens dispersas/)).toBeInTheDocument();
    expect(screen.getByText(/Umidade: 70%/)).toBeInTheDocument();
  });

  it('renders detailed weather information', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByText(/Sensação Térmica:/)).toBeInTheDocument();
    expect(screen.getByText(/14°C/)).toBeInTheDocument();
    expect(screen.getByText(/Vento:/)).toBeInTheDocument();
    expect(screen.getByText(/Pressão:/)).toBeInTheDocument();
    expect(screen.getByText(/Visibilidade:/)).toBeInTheDocument();
    expect(screen.getByText(/Nascer do Sol:/)).toBeInTheDocument();
    expect(screen.getByText(/Pôr do Sol:/)).toBeInTheDocument();
  });

  it('renders weather information correctly in English', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} />, { locale: 'en' });

    expect(screen.getByText('Weather in Londres')).toBeInTheDocument();
    expect(screen.getByText(/Condition: nuvens dispersas/)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 70%/)).toBeInTheDocument();
    expect(screen.getByText(/Feels Like:/)).toBeInTheDocument();
  });

  it('renders nothing when data is not provided', () => {
    const { container } = renderWithI18n(<WeatherDisplay data={null} />);
    expect(container).not.toBeEmptyDOMElement();
    expect(screen.getByText('Digite uma cidade para ver o clima.')).toBeInTheDocument();
  });

  it('renders Add to Favorites button correctly', () => {
    const mockAddFavorite = jest.fn();
    renderWithI18n(<WeatherDisplay data={mockWeatherData} onAddToFavorites={mockAddFavorite} isFavorited={false} />);
    const favButton = screen.getByRole('button', { name: /🤍/i });
    expect(favButton).toBeInTheDocument();
    expect(favButton).not.toBeDisabled();
    fireEvent.click(favButton);
    expect(mockAddFavorite).toHaveBeenCalledWith('Londres');
  });

});
