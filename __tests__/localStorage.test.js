import { getFavoritesFromStorage, saveFavoritesToStorage } from '../lib/favorites/localStorage';

describe('localStorage utilities', () => {
  const FAVORITES_KEY = 'weatherAppFavorites';

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
      jest.clearAllMocks();
    }
  });

  describe('getFavoritesFromStorage', () => {
    it('returns an empty array if localStorage has no data', () => {
      const result = getFavoritesFromStorage();
      expect(result).toEqual([]);
    });

    it('returns parsed data if localStorage has valid JSON', () => {
      const mockData = ['London', 'Paris'];
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(mockData));

      const result = getFavoritesFromStorage();
      expect(result).toEqual(mockData);
    });

    it('handles SSR gracefully by returning an empty array when window is undefined', () => {
      const originalWindow = global.window;
      // Temporarily remove window to simulate SSR
      delete global.window;

      const result = getFavoritesFromStorage();
      expect(result).toEqual([]);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('saveFavoritesToStorage', () => {
    it('saves favorites to localStorage correctly', () => {
      const mockData = ['London', 'Paris', 'Tokyo'];
      saveFavoritesToStorage(mockData);

      const storedData = window.localStorage.getItem(FAVORITES_KEY);
      expect(JSON.parse(storedData)).toEqual(mockData);
    });

    it('does nothing when window is undefined (SSR)', () => {
      const originalWindow = global.window;
      delete global.window;

      // We can't directly check localStorage since we deleted window,
      // but we can ensure it doesn't throw an error.
      expect(() => {
        saveFavoritesToStorage(['London']);
      }).not.toThrow();

      global.window = originalWindow;
    });
  });
});
