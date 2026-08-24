import { getFavoritesFromStorage, saveFavoritesToStorage } from '../lib/favorites/localStorage';

describe('localStorage utility', () => {
  const FAVORITES_KEY = 'weatherAppFavorites';
  let consoleErrorSpy;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Spy on console.error to prevent it from cluttering the test output
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the spy
    consoleErrorSpy.mockRestore();
  });

  describe('getFavoritesFromStorage', () => {
    it('returns an empty array if localStorage is empty', () => {
      expect(getFavoritesFromStorage()).toEqual([]);
    });

    it('returns parsed favorites if localStorage has valid JSON', () => {
      const mockFavorites = ['London', 'Paris'];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(mockFavorites));
      expect(getFavoritesFromStorage()).toEqual(mockFavorites);
    });

    it('returns an empty array and logs an error if localStorage has invalid JSON', () => {
      localStorage.setItem(FAVORITES_KEY, 'invalid-json');
      expect(getFavoritesFromStorage()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('saveFavoritesToStorage', () => {
    it('saves favorites as valid JSON to localStorage', () => {
      const mockFavorites = ['New York', 'Tokyo'];
      saveFavoritesToStorage(mockFavorites);
      const storedItem = localStorage.getItem(FAVORITES_KEY);
      expect(JSON.parse(storedItem)).toEqual(mockFavorites);
    });
  });
});
