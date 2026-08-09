import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDisplay from '../components/WeatherDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Helper to render with I18nProvider
const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

const mockWeatherData = {
  name: 'Londres',
  main: { temp: 15, humidity: 70, feels_like: 14, pressure: 1012 },
  weather: [{ description: 'céu limpo', icon: '01d' }],
  wind: { speed: 5, deg: 180 },
  visibility: 10000,
  sys: { sunrise: 1618300000, sunset: 1618340000 },
  timezone: 3600,
  cod: 200,
};

describe('WeatherDisplay', () => {
  it('renders initial message when no data is provided (Portuguese)', () => {
    renderWithI18n(<WeatherDisplay data={null} />);
    expect(screen.getByText('Digite uma cidade para ver o clima.')).toBeInTheDocument();
  });

  it('renders weather information correctly with valid data (Portuguese)', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} />);

    expect(screen.getByRole('heading', { name: /Clima em Londres/i })).toBeInTheDocument();
    expect(screen.getByText(/Temperatura:/i)).toBeInTheDocument();
    expect(screen.getByText(/15°C/i)).toBeInTheDocument();
    expect(screen.getByText(/Condição:/i)).toBeInTheDocument();
    expect(screen.getByText(/céu limpo/i)).toBeInTheDocument();
    expect(screen.getByText(/Umidade:/i)).toBeInTheDocument();
    expect(screen.getByText(/70%/i)).toBeInTheDocument();
  });

  it('renders weather information correctly with valid data (English)', () => {
     renderWithI18n(<WeatherDisplay data={mockWeatherData} />, { locale: 'en' });
     expect(screen.getByRole('heading', { name: /Weather in Londres/i })).toBeInTheDocument();
     expect(screen.getByText(/Temperature:/i)).toBeInTheDocument();
     expect(screen.getByText(/15°C/i)).toBeInTheDocument();
  });

  it('calls onAddToFavorites when favorite button is clicked and it is not already favorited', () => {
    const mockAddToFavorites = jest.fn();
    renderWithI18n(<WeatherDisplay data={mockWeatherData} onAddToFavorites={mockAddToFavorites} isFavorited={false} />);

    const favButton = screen.getByRole('button', { name: /🤍/i });
    fireEvent.click(favButton);
    expect(mockAddToFavorites).toHaveBeenCalledTimes(1);
    expect(mockAddToFavorites).toHaveBeenCalledWith(mockWeatherData.name);
  });

  it('renders filled heart when isFavorited is true', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} onAddToFavorites={() => {}} isFavorited={true} />);
    expect(screen.getByRole('button', { name: /❤️/i })).toBeInTheDocument();
  });

  it('renders API error message when data contains an error message', () => {
    const errorData = { cod: '404', message: 'city not found' };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText(/city not found/i)).toBeInTheDocument();
  });

  it('renders API error message when data contains an error code', () => {
    const errorData = { cod: '404' };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText(/Não foi possível obter os dados meteorológicos/i)).toBeInTheDocument();
  });

  it('renders custom error message if API message is not present', () => {
    const errorData = { cod: '500' };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText(/Não foi possível obter os dados meteorológicos/i)).toBeInTheDocument();
  });

  it('handles missing nested data gracefully', () => {
    const partialData = {
      name: 'Desconhecido',
      main: {}, // Missing temp, humidity, etc.
      weather: [],
      timezone: 3600,
      cod: 200
    };
    renderWithI18n(<WeatherDisplay data={partialData} />);
    expect(screen.getByText(/Temperatura:/i)).toBeInTheDocument();
  });

  it('handles missing weather description and icon gracefully', () => {
    const partialData = {
      name: 'Desconhecido',
      main: { temp: 20, humidity: 50 },
      weather: [{}], // Missing description and icon
      timezone: 3600,
      cod: 200
    };
    renderWithI18n(<WeatherDisplay data={partialData} />);
    expect(screen.getByText(/Condição:/i)).toBeInTheDocument();
  });
});
