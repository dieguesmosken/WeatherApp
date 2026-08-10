import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Previsao.module.css';

export default function Previsao() {
  const [query, setQuery] = useState('São Paulo');
  const [searchInput, setSearchInput] = useState('');
  const [forecast, setForecast] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Geocode the location using Open-Meteo Geocoding API
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=pt&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Local não encontrado. Tente outra cidade.');
      }

      const location = geoData.results[0];
      setLocationName(`${location.name}, ${location.admin1 || ''} - ${location.country}`);

      // 2. Fetch forecast using Open-Meteo Weather API
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=auto`);
      const weatherData = await weatherRes.json();

      setForecast(weatherData.daily);
    } catch (err) {
      setError(err.message);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(query);
  }, []); // Initial load

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput);
      fetchForecast(searchInput);
    }
  };

  // Very basic mapping of Open-Meteo WMO weather codes to emoji
  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'; // Clear sky
    if (code === 1 || code === 2 || code === 3) return '⛅'; // Mainly clear, partly cloudy, and overcast
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 67) return '🌧️'; // Drizzle / Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
    if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
    return '☁️';
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Previsão 7 Dias - Open-Meteo</title>
      </Head>

      <h1 className={styles.title}>Previsão de 7 Dias (Open-Meteo)</h1>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Digite o nome de uma cidade..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Buscar
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {loading && <p>Carregando dados da previsão...</p>}

      {!loading && forecast && (
        <>
          <h2 style={{ marginBottom: '15px' }}>{locationName}</h2>
          <div className={styles.forecastGrid}>
            {forecast.time.map((time, index) => (
              <div key={time} className={styles.dayCard}>
                <div className={styles.date}>{formatDate(time)}</div>
                <div style={{ fontSize: '2rem', margin: '10px 0' }}>
                  {getWeatherEmoji(forecast.weathercode[index])}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Chuva: {forecast.precipitation_probability_max[index]}%
                </div>
                <div className={styles.temps}>
                  <span className={styles.minTemp}>{Math.round(forecast.temperature_2m_min[index])}°</span>
                  <span className={styles.maxTemp}>{Math.round(forecast.temperature_2m_max[index])}°</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
