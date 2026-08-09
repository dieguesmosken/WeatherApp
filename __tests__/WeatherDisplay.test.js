import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDisplay from '../components/WeatherDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

const mockWeatherData = {
  name: 'Londres',
  main: { temp: 15, humidity: 70, feels_like: 14, pressure: 1012 },
  weather: [{ description: 'céu limpo', icon: '01d' }],
  wind: { speed: 5, deg: 180 },
  visibility: 10000,
  sys: { sunrise: 1609459200, sunset: 1609495200 },
  timezone: 0,
  cod: 200,
};

describe('WeatherDisplay', () => {
  it('renders "Enter a city" message when no data is provided', () => {
    renderWithI18n(<WeatherDisplay data={null} />);
    expect(screen.getByText('Digite uma cidade para ver o clima.')).toBeInTheDocument();
  });

  it('renders weather information correctly with valid data (Portuguese)', () => {
    renderWithI18n(<WeatherDisplay data={mockWeatherData} onAddToFavorites={() => {}} isFavorited={false} />);
    expect(screen.getByRole('heading', { name: /Clima em Londres/i })).toBeInTheDocument();
    expect(screen.getByText(/Temperatura:/i)).toHaveTextContent('Temperatura: 15°C');
    expect(screen.getByText(/Condição:/i)).toHaveTextContent('Condição: céu limpo');
    expect(screen.getByText(/Umidade:/i)).toHaveTextContent('Umidade: 70%');
    expect(screen.getByText(/Sensação Térmica:/i)).toHaveTextContent('Sensação Térmica: 14°C');
    expect(screen.getByText(/Vento:/i)).toHaveTextContent('Vento: 5 m/s S');
    expect(screen.getByText(/Pressão:/i)).toHaveTextContent('Pressão: 1012 hPa');
    expect(screen.getByText(/Visibilidade:/i)).toHaveTextContent('Visibilidade: 10000 metros');
    expect(screen.getByText(/Nascer do Sol:/i)).toBeInTheDocument();
    expect(screen.getByText(/Pôr do Sol:/i)).toBeInTheDocument();
    expect(screen.getByAltText('céu limpo')).toHaveAttribute('src', 'http://openweathermap.org/img/wn/01d@2x.png');
  });

  it('renders Add to Favorites button correctly', () => {
    const mockAddFavorite = jest.fn();
    renderWithI18n(
      <WeatherDisplay
        data={mockWeatherData}
        onAddToFavorites={mockAddFavorite}
        isFavorited={false}
      />
    );
    const favButton = screen.getByRole('button', { name: '🤍' });
    expect(favButton).toBeInTheDocument();
    expect(favButton).not.toBeDisabled();
    fireEvent.click(favButton);
    expect(mockAddFavorite).toHaveBeenCalledWith('Londres');
  });

  it('renders Add to Favorites button as disabled (favorited state)', () => {
    renderWithI18n(
      <WeatherDisplay
        data={mockWeatherData}
        onAddToFavorites={() => {}}
        isFavorited={true}
      />
    );
    const favButton = screen.getByRole('button', { name: '❤️' });
    expect(favButton).toBeInTheDocument();
    expect(favButton).toBeDisabled();
  });

  it('renders API error message when data contains an error code', () => {
    const errorData = { cod: 404, message: 'City not found' };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText('City not found')).toBeInTheDocument();
  });

  it('renders custom error message if API message is not present', () => {
    const errorData = { cod: 500 };
    renderWithI18n(<WeatherDisplay data={errorData} />);
    expect(screen.getByText('Não foi possível obter os dados meteorológicos.')).toBeInTheDocument();
  });

  it('handles missing nested data gracefully', () => {
    const partialData = { name: 'Test City', cod: 200 };
    renderWithI18n(<WeatherDisplay data={partialData} />);
    expect(screen.getByRole('heading', { name: /Clima em Test City/i })).toBeInTheDocument();
    expect(screen.getByText('Temperatura: N/D°C')).toBeInTheDocument();
    //expect(screen.getByText('Condição: N/D')).toBeInTheDocument();
    expect(screen.getByText('Umidade: N/D%')).toBeInTheDocument();
  });

  it('handles missing weather description and icon gracefully', () => {
    const dataWithoutWeatherDetails = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15, humidity: 70 },
      weather: [{}],
      cod: 200,
    };
    renderWithI18n(<WeatherDisplay data={dataWithoutWeatherDetails} />);
    //expect(screen.getByText('Condição: N/D')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('does not render an image if the icon code contains invalid characters (XSS protection)', () => {
    const maliciousData = {
      name: 'London',
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'clear sky', icon: '01d" onerror="alert(1)' }],
      cod: 200,
    };
    renderWithI18n(<WeatherDisplay data={maliciousData} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
