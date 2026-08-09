import React from 'react';
import styles from '../styles/Home.module.css';
import { useI18n } from '../lib/i18n/i18nContext';

const formatTime = (unixTimestamp, timezoneOffsetSeconds, language) => {
  if (!unixTimestamp) return null;
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return new Intl.DateTimeFormat(language, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }).format(date);
};

const formatWindDirection = (degrees, t) => {
  if (degrees === undefined || degrees === null) return t('na');
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
};

export default function WeatherDisplay({ data, onAddToFavorites, isFavorited }) { // Added onAddToFavorites and isFavorited props
  const { t, language } = useI18n();

  if (!data) {
    return <p className={styles.weatherInfo}>{t('enterCityToSeeWeather')}</p>;
  }

  if (data.cod && data.cod !== 200) {
    return <p className={styles.errorMessage}>{data.message || t('couldNotRetrieveWeather')}</p>;
  }

  const cityName = data.name || t('unknownCity');
  const temperature = data.main ? data.main.temp : t('na');
  const humidity = data.main ? data.main.humidity : t('na');
  const weatherCondition = data.weather && data.weather[0] ? data.weather[0].description : t('na');

  let weatherIcon = null;
  if (data.weather && data.weather[0] && data.weather[0].icon) {
    const iconCode = data.weather[0].icon;
    if (/^[a-zA-Z0-9]+$/.test(iconCode)) {
      weatherIcon = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
  }

  const feelsLike = data.main ? data.main.feels_like : t('na');
  const windSpeed = data.wind ? data.wind.speed : t('na');
  const windDirection = data.wind ? formatWindDirection(data.wind.deg, t) : t('na');
  const pressure = data.main?.pressure ?? t('na');
  const visibility = data.visibility ?? t('na');
  const sunriseTime = data.sys?.sunrise ? formatTime(data.sys.sunrise, data.timezone, language) : t('na');
  const sunsetTime = data.sys?.sunset ? formatTime(data.sys.sunset, data.timezone, language) : t('na');

  return (
    <div className={styles.weatherDisplayContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{t('weatherIn', { city: cityName })}</h2>
        {cityName !== t('unknownCity') && ( // Only show button if there's valid city data
          <button
            onClick={() => onAddToFavorites(cityName)}
            disabled={isFavorited}
            className={styles.addToFavoritesButton}
            title={isFavorited ? t('cityAlreadyFavorited') : t('addToFavorites')}
          >
            {isFavorited ? '❤️' : '🤍'} {/* Simple heart icon for favorited state */}
          </button>
        )}
      </div>

      {weatherIcon && <img src={weatherIcon} alt={weatherCondition} />}

      <p>{t('condition')}: {weatherCondition}</p>
      <p>{t('temperature')}: {temperature}°C</p>
      <p>{t('feelsLike')}: {feelsLike}°C</p>
      <p>{t('humidity')}: {humidity}%</p>
      <p>{t('wind')}: {windSpeed} {t('windSpeedUnit')} {windDirection}</p>
      <p>{t('pressure')}: {pressure} {t('pressureUnit')}</p>
      <p>{t('visibility')}: {visibility} {t('visibilityUnit')}</p>
      <p>{t('sunrise')}: {sunriseTime}</p>
      <p>{t('sunset')}: {sunsetTime}</p>
    </div>
  );
}
