import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapDisplay from '../components/MapDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom }) => (
    <div data-testid="map-container" data-center={JSON.stringify(center)} data-zoom={zoom}>
      {children}
    </div>
  ),
  TileLayer: ({ url, attribution }) => (
    <div data-testid="tile-layer" data-url={url} data-attribution={attribution} />
  ),
  Marker: ({ position, children }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
  Popup: ({ children }) => (
    <div data-testid="popup">{children}</div>
  )
}));

// Mock leaflet
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn()
      },
      mergeOptions: jest.fn()
    }
  }
}));

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('MapDisplay', () => {
  it('renders loading state when latitude or longitude is missing', () => {
    const { unmount } = renderWithI18n(<MapDisplay />);
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
    unmount();

    const { unmount: unmount2 } = renderWithI18n(<MapDisplay latitude={10} />);
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
    unmount2();

    const { unmount: unmount3 } = renderWithI18n(<MapDisplay longitude={20} />);
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
    unmount3();
  });

  it('renders map with correct parameters when coordinates are provided', () => {
    renderWithI18n(<MapDisplay latitude={-23.5505} longitude={-46.6333} zoom={10} />);

    expect(screen.getByText('Mapa da Localização')).toBeInTheDocument();

    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveAttribute('data-center', JSON.stringify([-23.5505, -46.6333]));
    expect(mapContainer).toHaveAttribute('data-zoom', '10');

    const tileLayer = screen.getByTestId('tile-layer');
    expect(tileLayer).toBeInTheDocument();

    const marker = screen.getByTestId('marker');
    expect(marker).toBeInTheDocument();
    expect(marker).toHaveAttribute('data-position', JSON.stringify([-23.5505, -46.6333]));

    const popup = screen.getByTestId('popup');
    expect(popup).toBeInTheDocument();
  });

  it('uses default zoom when zoom is not provided', () => {
    renderWithI18n(<MapDisplay latitude={-23.5505} longitude={-46.6333} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('data-zoom', '13');
  });
});
