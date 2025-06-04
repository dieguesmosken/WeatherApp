import React, { useState } from 'react';
import styles from '../styles/Home.module.css'; // Import styles

export default function LocationInput({ onLocationSubmit }) {
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
        placeholder="Enter city name"
        className={styles.locationInput}
      />
      <button type="submit" className={styles.locationButton}>
        Get Weather
      </button>
    </form>
  );
}
