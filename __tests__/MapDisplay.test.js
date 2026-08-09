import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapDisplay from '../components/MapDisplay';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Mock react-leaflet to avoid JSDOM errors with real Leaflet maps
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

const renderWithI18n = (ui, { locale = 'en', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('MapDisplay', () => {
  it('renders "Loading map..." when latitude or longitude is missing', () => {
    renderWithI18n(<MapDisplay latitude={undefined} longitude={undefined} />);
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
  });

  it('renders the map correctly when latitude and longitude are provided', () => {
    renderWithI18n(<MapDisplay latitude={51.505} longitude={-0.09} zoom={13} />);

    // Check if the MapContainer is rendered
    expect(screen.getByTestId('map-container')).toBeInTheDocument();

    // Check for other map elements
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });
});
