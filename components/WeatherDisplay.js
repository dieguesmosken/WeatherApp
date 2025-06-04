import React, { useState } from 'react';
import styles from '../styles/Home.module.css'; // Import styles

export default function WeatherDisplay({ data }) {
  if (!data) {
    return <p className={styles.weatherInfo}>Enter a city to see the weather.</p>;
  }

  if (data.cod && data.cod !== 200) {
    return <p className={styles.errorMessage}>Error: {data.message || 'Could not retrieve weather data.'}</p>;
  }

  const cityName = data.name || 'Unknown City';
  const temperature = data.main ? data.main.temp : 'N/A';
  const humidity = data.main ? data.main.humidity : 'N/A';
  const weatherCondition = data.weather && data.weather[0] ? data.weather[0].description : 'N/A';
  const weatherIcon = data.weather && data.weather[0] ? `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` : null;

  return (
    <div className={styles.weatherDisplayContainer}>
      <h2>Weather in {cityName}</h2>
      {weatherIcon && <img src={weatherIcon} alt={weatherCondition} />}
      <p>Temperature: {temperature}°C</p>
      <p>Condition: {weatherCondition}</p>
      <p>Humidity: {humidity}%</p>
    </div>
  );
}
