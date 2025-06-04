import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useI18n } from '../lib/i18n/i18nContext'; // Import useI18n

export default function LocationInput({ onLocationSubmit }) {
  const { t } = useI18n(); // Get t function
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSubmit(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.locationForm}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder={t('enterCityName')} // Use t function
        className={styles.locationInput}
      />
      <button type="submit" className={styles.locationButton}>
        {t('getWeather')} {/* Use t function */}
      </button>
    </form>
  );
}
