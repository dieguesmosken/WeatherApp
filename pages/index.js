import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LocationInput from '../components/LocationInput';
import WeatherDisplay from '../components/WeatherDisplay';
import { useState } from 'react';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleLocationSubmit = async (location) => {
    setError(null);
    setWeatherData(null);
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    if (!apiKey) {
      setError("API key is missing. Please check your environment configuration.");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid API key. Please check your .env.local file.");
        } else if (response.status === 404) {
          setError(`City not found: ${location}`);
        } else {
          setError(`Error fetching weather data: ${response.statusText}`);
        }
        return;
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to fetch weather data. Check console for details.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather app built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Weather Forecaster
        </h1>

        <LocationInput onLocationSubmit={handleLocationSubmit} />

        {error && <p className={styles.errorMessage}>{error}</p>}

        <WeatherDisplay data={weatherData} />
      </main>
    </div>
  );
}
