import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../index'; // Adjust path as necessary

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Mock fetch
global.fetch = jest.fn();

// Mock environment variable
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  global.fetch.mockClear();
});

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});


describe('Home Page', () => {
  it('renders the title, input, and initial weather message', () => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'testkey';
    render(<Home />);
    expect(screen.getByRole('heading', { name: /weather forecaster/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByText('Enter a city to see the weather.')).toBeInTheDocument();
  });

  it('fetches and displays weather data on location submit', async () => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'testkey';
    const mockWeatherData = {
      name: 'Berlin',
      main: { temp: 20, humidity: 60 },
      weather: [{ description: 'few clouds', icon: '02d' }],
      cod: 200,
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'Berlin' } });
    fireEvent.click(screen.getByRole('button', { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /weather in berlin/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Temperature: 20°C')).toBeInTheDocument();
    expect(screen.getByText('Condition: few clouds')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 60%')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=Berlin&appid=testkey&units=metric');
  });

  it('displays an error message if API key is missing', async () => {
    delete process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Simulate missing API key
    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'London' } });
    fireEvent.click(screen.getByRole('button', { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getByText('API key is missing. Please check your environment configuration.')).toBeInTheDocument();
    });
  });

  it('displays an error message for city not found (404)', async () => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'testkey';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'city not found' }),
    });

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'NonExistentCity' } });
    fireEvent.click(screen.getByRole('button', { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getByText('City not found: NonExistentCity')).toBeInTheDocument();
    });
  });

  it('displays an error message for invalid API key (401)', async () => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'testkey';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Invalid API key' }),
    });

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'London' } });
    fireEvent.click(screen.getByRole('button', { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid API key. Please check your .env.local file.')).toBeInTheDocument();
    });
  });

  it('displays a generic error for other fetch errors', async () => {
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'testkey';
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'London' } });
    fireEvent.click(screen.getByRole('button', { name: /get weather/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch weather data. Check console for details.')).toBeInTheDocument();
    });
  });
});
