import React from 'react';
import styles from '../styles/Home.module.css'; // Assuming styles can be shared or new ones added
import { useI18n } from '../lib/i18n/i18nContext';

export default function FavoritesList({ favorites, onSelectFavorite, onRemoveFavorite }) {
  const { t } = useI18n();

  if (!favorites || favorites.length === 0) {
    return <p className={styles.noFavoritesMessage}>{t('noFavoritesYet')}</p>;
  }

  return (
    <div className={styles.favoritesContainer}>
      <h3>{t('favorites')}</h3>
      <ul className={styles.favoritesList}>
        {favorites.map((city) => (
          <li key={city} className={styles.favoriteItem}>
            <span onClick={() => onSelectFavorite(city)} className={styles.favoriteCityName}>
              {city}
            </span>
            <button onClick={() => onRemoveFavorite(city)} className={styles.removeFavoriteButton}>
              {t('removeFromFavorites')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
