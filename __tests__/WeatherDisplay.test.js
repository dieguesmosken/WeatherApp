import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDisplay from '../WeatherDisplay';

describe('WeatherDisplay', () => {
  it('renders "Enter a city" message when no data is provided', () => {
    render(<WeatherDisplay data={null} />);
    expect(screen.getByText('Enter a city to see the weather.')).toBeInTheDocument();
  });

  it('renders API error message when data contains an error code', () => {
    const errorData = { cod: 404, message: 'City not found' };
    render(<WeatherDisplay data={errorData} />);
    expect(screen.getByText('Error: City not found')).toBeInTheDocument();
  });

  it('renders custom error message if API message is not present', () => {
    const errorData = { cod: 500 };
    render(<WeatherDisplay data={errorData} />);
    expect(screen.getByText('Error: Could not retrieve weather data.')).toBeInTheDocument();
  });

  it('renders weather information correctly with valid data', () => {
    const weatherData = {
      name: 'London',
      main: { temp: 15, humidity: 70 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      cod: 200,
    };
    render(<WeatherDisplay data={weatherData} />);
    expect(screen.getByRole('heading', { name: /weather in london/i })).toBeInTheDocument();
    expect(screen.getByText('Temperature: 15°C')).toBeInTheDocument();
    expect(screen.getByText('Condition: clear sky')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 70%')).toBeInTheDocument();
    expect(screen.getByAltText('clear sky')).toHaveAttribute('src', 'http://openweathermap.org/img/wn/01d@2x.png');
  });

  it('handles missing nested data gracefully', () => {
    const partialData = { name: 'Test City', cod: 200 };
    render(<WeatherDisplay data={partialData} />);
    expect(screen.getByRole('heading', { name: /weather in test city/i })).toBeInTheDocument();
    expect(screen.getByText('Temperature: N/A°C')).toBeInTheDocument(); // main is missing
    expect(screen.getByText('Condition: N/A')).toBeInTheDocument();     // weather is missing
    expect(screen.getByText('Humidity: N/A%')).toBeInTheDocument();    // main is missing
  });

   it('handles missing weather description and icon gracefully', () => {
    const dataWithoutWeatherDetails = {
      name: 'London',
      main: { temp: 15, humidity: 70 },
      weather: [{}], // Empty weather object
      cod: 200,
    };
    render(<WeatherDisplay data={dataWithoutWeatherDetails} />);
    expect(screen.getByText('Condition: N/A')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
