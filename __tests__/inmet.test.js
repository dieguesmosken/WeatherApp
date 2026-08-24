import { render, screen, waitFor, act } from '@testing-library/react';
import InmetCapitals from '../pages/inmet';
import { I18nProvider } from '../lib/i18n/i18nContext';

// Store original fetch
const originalFetch = global.fetch;

describe('InmetCapitals Page', () => {
  beforeEach(() => {
    // Reset global fetch mock before each test
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const renderComponent = () => {
    render(
      <I18nProvider defaultLang="pt">
        <InmetCapitals />
      </I18nProvider>
    );
  };

  it('renders loading state initially', async () => {
    // Mock a pending promise so the component stays in loading state
    global.fetch.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      renderComponent();
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders weather data successfully when fetch returns an array', async () => {
    const mockData = [
      {
        CAPITAL: 'SAO PAULO',
        TMIN18: '18',
        TMAX18: '28',
        UMIN18: '45',
        PMAX12: '0'
      },
      {
        CAPITAL: 'RIO DE JANEIRO',
        TMIN18: '22',
        TMAX18: '35',
        UMIN18: '60',
        PMAX12: '5'
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('SAO PAULO')).toBeInTheDocument();
    expect(screen.getByText('18 °C')).toBeInTheDocument();
    expect(screen.getByText('28 °C')).toBeInTheDocument();
    expect(screen.getByText('RIO DE JANEIRO')).toBeInTheDocument();
    expect(screen.getByText('22 °C')).toBeInTheDocument();
  });

  it('handles and renders data when API returns an object instead of array', async () => {
    const mockDataObj = {
      "item1": {
        CAPITAL: 'BELO HORIZONTE',
        TMIN18: '15',
        TMAX18: '25',
        UMIN18: '50',
        PMAX12: '0'
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDataObj
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('BELO HORIZONTE')).toBeInTheDocument();
    expect(screen.getByText('15 °C')).toBeInTheDocument();
  });

  it('retries with yesterday date if today data is empty and then renders data', async () => {
    const mockYesterdayData = [
      {
        CAPITAL: 'CURITIBA',
        TMIN18: '10',
        TMAX18: '18',
        UMIN18: '80',
        PMAX12: '15'
      }
    ];

    // First call (today) returns empty array
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Second call (yesterday) returns valid data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockYesterdayData
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText('CURITIBA')).toBeInTheDocument();
    expect(screen.getByText('10 °C')).toBeInTheDocument();
  });

  it('renders no data message when both today and yesterday fail or are empty', async () => {
    // Both calls return empty arrays
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(screen.getByText('No data available right now.')).toBeInTheDocument();
  });

  it('renders error state if API fails completely (HTTP error)', async () => {
    // Force a fetch rejection (e.g., network error or non-200 ok for today)
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error fetching data: HTTP error! status: 500')).toBeInTheDocument();
  });

  it('renders error state if fetch throws an exception', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error fetching data: Network failure')).toBeInTheDocument();
  });
});
