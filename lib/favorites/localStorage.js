const FAVORITES_KEY = 'weatherAppFavorites';

export const getFavoritesFromStorage = () => {
  if (typeof window === 'undefined') return []; // Guard for SSR
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  if (!favoritesJson) return [];
  try {
    return JSON.parse(favoritesJson);
  } catch (error) {
    console.error('Failed to parse favorites from local storage:', error);
    return [];
  }
};

export const saveFavoritesToStorage = (favorites) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to local storage:', error);
  }
};
