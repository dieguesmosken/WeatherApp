const FAVORITES_KEY = 'weatherAppFavorites';

export const getFavoritesFromStorage = () => {
  if (typeof window === 'undefined') return []; // Guard for SSR
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

export const saveFavoritesToStorage = (favorites) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};
