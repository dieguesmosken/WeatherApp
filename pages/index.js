import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic'; // Import dynamic
import LocationInput from '../components/LocationInput';
import WeatherDisplay from '../components/WeatherDisplay';
// import MapDisplay from '../components/MapDisplay'; // Will be dynamically imported
import FavoritesList from '../components/FavoritesList'; // Import FavoritesList
import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { useI18n } from '../lib/i18n/i18nContext';
import { getFavoritesFromStorage, saveFavoritesToStorage } from '../lib/favorites/localStorage'; // Import LocalStorage utils

const MapDisplay = dynamic(() => import('../components/MapDisplay'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  const { t, language } = useI18n();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [infoMessage, setInfoMessage] = useState(''); // For messages like "City already favorited"
  const locationInputRef = useRef(null);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const handleLocationSubmit = async (location) => {
    setError(null);
    setInfoMessage('');
    // setWeatherData(null); // Keep previous data while new one loads? Or clear? Clearing for now.
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=${language}`;

    if (!apiKey) {
      setError(t('apiKeyMissing'));
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        if (response.status === 401) setError(t('invalidApiKey'));
        else if (response.status === 404) setError(t('cityNotFound', { location }));
        else setError(`${t('errorFetchingData')}: ${responseData.message || response.statusText}`);
        setWeatherData(null); // Clear weather data on error
        return;
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(t('failedToFetch'));
      setWeatherData(null); // Clear weather data on error
    }
  };

  const handleAddFavorite = (city) => {
    if (!city || city === t('unknownCity')) return;
    if (favorites.includes(city)) {
      setInfoMessage(t('cityAlreadyFavorited'));
      setTimeout(() => setInfoMessage(''), 3000); // Clear message after 3s
      return;
    }
    const newFavorites = [...favorites, city];
    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);
    setInfoMessage(''); // Clear any previous message
  };

  const handleRemoveFavorite = (cityToRemove) => {
    const newFavorites = favorites.filter(city => city !== cityToRemove);
    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);
  };

  const handleSelectFavorite = (city) => {
    // Trigger a new weather search for the selected favorite city
    if (locationInputRef.current) {
      locationInputRef.current.setLocation(city);
    }
    handleLocationSubmit(city);
  };

  const isCityFavorited = (cityName) => {
    if (!weatherData || !weatherData.name) return false;
    return favorites.includes(weatherData.name);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{t('weatherForecaster')}</title>
        <meta name="description" content={t('weatherForecaster')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('weatherForecaster')}
        </h1>

        <LocationInput onLocationSubmit={handleLocationSubmit} ref={locationInputRef} />

        {error && <p className={styles.errorMessage}>{error}</p>}
        {infoMessage && <p className={styles.infoMessage}>{infoMessage}</p>}

        <div className={styles.weatherMapContainer}>
          {weatherData && (
            <div className={styles.weatherDisplayWrapper}> {/* Added wrapper for WeatherDisplay */}
              <WeatherDisplay
                data={weatherData}
                onAddToFavorites={handleAddFavorite}
                isFavorited={isCityFavorited(weatherData.name)}
              />
            </div>
          )}

          {weatherData && weatherData.coord && (
            <div className={styles.mapDisplayWrapper}> {/* Added wrapper for MapDisplay */}
              <MapDisplay
                latitude={weatherData.coord.lat}
                longitude={weatherData.coord.lon}
                zoom={10}
              />
            </div>
          )}
        </div>

        <FavoritesList
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={handleRemoveFavorite}
        />
      </main>
    </div>
  );
}
