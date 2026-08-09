import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/index';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Mock next/head
jest.mock('next/head', () => ({ children }) => <>{children}</>);
// Mock fetch
global.fetch = jest.fn();

const renderHomePage = (locale = 'pt') => {
  return render(
    <I18nProvider defaultLang={locale}>
      <Home />
    </I18nProvider>
  );
};

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV, NEXT_PUBLIC_OPENWEATHER_API_KEY: 'testkey' };
  global.fetch.mockClear();
  localStorage.clear();
});

afterAll(() => {
  process.env = OLD_ENV;
});

const mockWeatherData = (city = 'Berlim') => ({
  name: city,
  main: { temp: 20, humidity: 60, feels_like: 19, pressure: 1010 },
  weather: [{ description: 'nuvens dispersas', icon: '03d' }],
  wind: { speed: 3, deg: 90 },
  visibility: 10000,
  sys: { sunrise: 1609459200, sunset: 1609495200 },
  timezone: 0,
  cod: 200,
});

describe('Home Page', () => {
  it('renders title, input, and initial messages in Portuguese', () => {
    renderHomePage();
    expect(screen.getByRole('heading', { name: /Previsão do Tempo/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome da cidade')).toBeInTheDocument();
    //expect(screen.getByText('Digite uma cidade para ver o clima.')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma cidade favorita ainda. Adicione algumas!')).toBeInTheDocument();
  });

  it('fetches and displays weather data on location submit (Portuguese)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData('Berlim'),
    });

    renderHomePage();
    fireEvent.change(screen.getByPlaceholderText('Digite o nome da cidade'), { target: { value: 'Berlim' } });
    fireEvent.click(screen.getByRole('button', { name: /Buscar Clima/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Clima em Berlim/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/Temperatura: 20°C/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=Berlim&appid=testkey&units=metric&lang=pt');
  });

  it('adds a city to favorites, displays it, and persists to localStorage', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData('Londres')
    });
    renderHomePage();

    // Search for a city
    fireEvent.change(screen.getByPlaceholderText('Digite o nome da cidade'), { target: { value: 'Londres' } });
    fireEvent.click(screen.getByRole('button', { name: /Buscar Clima/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /Clima em Londres/i })).toBeInTheDocument());

    // Add to favorites
    const addToFavButton = screen.getByRole('button', { name: '🤍' });
    fireEvent.click(addToFavButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '❤️' })).toBeInTheDocument();
    });
    expect(screen.getByText('Londres', { selector: '.favoriteCityName' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('weatherAppFavorites'))).toEqual(['Londres']);
  });

  it('removes a city from favorites', async () => {
    localStorage.setItem('weatherAppFavorites', JSON.stringify(['Paris']));
    fetch.mockResolvedValue({ ok: true, json: async () => mockWeatherData('Paris') });

    renderHomePage();

    await waitFor(() => expect(screen.getByText('Paris', { selector: '.favoriteCityName' })).toBeInTheDocument());

    const removeButtons = screen.getAllByRole('button', { name: /Remover dos Favoritos/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Paris', { selector: '.favoriteCityName' })).not.toBeInTheDocument();
    });
    expect(JSON.parse(localStorage.getItem('weatherAppFavorites'))).toEqual([]);
  });

  it('displays "City already favorited" message', async () => {
    localStorage.setItem('weatherAppFavorites', JSON.stringify(['Londres']));
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockWeatherData('Londres') });
    renderHomePage();

    fireEvent.change(screen.getByPlaceholderText('Digite o nome da cidade'), { target: { value: 'Londres' } });
    fireEvent.click(screen.getByRole('button', { name: /Buscar Clima/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /Clima em Londres/i })).toBeInTheDocument());

    const addToFavButton = screen.getByRole('button', { name: '❤️' });
    fireEvent.click(addToFavButton);

    expect(addToFavButton).toBeDisabled();
  });
});
