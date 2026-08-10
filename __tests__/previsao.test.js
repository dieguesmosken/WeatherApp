import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Previsao from '../pages/previsao';

// Mock fetch
global.fetch = jest.fn((url) => {
  if (url.includes('geocoding')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        results: [{ name: 'São Paulo', admin1: 'São Paulo', country: 'Brazil', latitude: -23.5, longitude: -46.6 }]
      })
    });
  } else if (url.includes('api.open-meteo.com')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        daily: {
          time: ['2026-08-10', '2026-08-11'],
          temperature_2m_max: [25, 26],
          temperature_2m_min: [15, 16],
          weathercode: [0, 3],
          precipitation_probability_max: [10, 20]
        }
      })
    });
  }
  return Promise.reject(new Error('Unknown url'));
});

describe('Previsao Page', () => {
  it('renders the previsao page', async () => {
    await act(async () => {
      render(<Previsao />);
    });
    expect(screen.getByText('Previsão de 7 Dias (Open-Meteo)')).toBeInTheDocument();
  });

  it('searches and displays forecast data', async () => {
    await act(async () => {
      render(<Previsao />);
    });

    const input = screen.getByPlaceholderText('Digite o nome de uma cidade...');
    const button = screen.getByText('Buscar');

    fireEvent.change(input, { target: { value: 'São Paulo' } });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('São Paulo, São Paulo - Brazil')).toBeInTheDocument();
      expect(screen.getByText('10/08')).toBeInTheDocument();
      expect(screen.getByText('11/08')).toBeInTheDocument();
    });
  });
});
