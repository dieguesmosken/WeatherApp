import React from 'react';
import styles from '../styles/Home.module.css';
import { useI18n } from '../lib/i18n/i18nContext'; // Import useI18n

export default function LocationInput({ value, onChange, onLocationSubmit }) {
  const { t } = useI18n(); // Get t function

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value && value.trim()) {
      onLocationSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.locationForm}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('enterCityName')} // Use t function
        className={styles.locationInput}
      />
      <button type="submit" className={styles.locationButton}>
        {t('getWeather')} {/* Use t function */}
      </button>
    </form>
  );
}
