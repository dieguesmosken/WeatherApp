import { render, screen, act } from '@testing-library/react';
import Mapa from '../pages/mapa';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Mock the dynamic map component since leaflet requires a real DOM/browser window
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div>Mocked Map Component</div>;
  return DynamicComponent;
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { CAPITAL: 'SAO PAULO', TMAX18: '25', RESUMO: 'Encoberto' }
    ]),
    clone: function() { return this; }
  })
);

describe('Mapa Page', () => {
  it('renders the map page title', async () => {
    await act(async () => {
      render(
        <I18nProvider>
          <Mapa />
        </I18nProvider>
      );
    });

    expect(screen.getByText('Mapa Meteorológico - INMET Capitais')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    // Override the global fetch mock for this specific test
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve([])
      })
    ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve([])
      })
    );

    await act(async () => {
      render(
        <I18nProvider>
          <Mapa />
        </I18nProvider>
      );
    });

    // Wait for the error message to appear
    expect(await screen.findByText('Erro: Failed to fetch INMET data')).toBeInTheDocument();
  });
});
