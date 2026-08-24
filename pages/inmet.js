import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useI18n } from '../lib/i18n/i18nContext';
import styles from '../styles/Inmet.module.css';

export default function InmetCapitals() {
  const { t } = useI18n();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const fetchAndNormalize = async (date) => {
          const res = await fetch(`https://apitempo.inmet.gov.br/condicao/capitais/${formatDate(date)}`);
          if (!res.ok) return null;
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) return json;
          if (json && Object.keys(json).length > 0 && !Array.isArray(json)) return Object.values(json);
          return null; // Handle empty array or empty object cases
        };

        const today = new Date();
        let fetchedData = await fetchAndNormalize(today);

        if (!fetchedData) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          fetchedData = await fetchAndNormalize(yesterday);
        }

        if (!fetchedData) {
          throw new Error("No data available for today or yesterday");
        }

        setData(fetchedData);
      } catch (e) {
        console.error("Failed to fetch INMET data", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t('inmetCapitals')} - {t('weatherForecaster')}</title>
      </Head>

      <h1 className={styles.title}>{t('inmetCapitals')}</h1>

      {loading && <p className={styles.loading}>Loading...</p>}

      {error && (
        <div className={styles.error}>
          <p>Error fetching data: {error}</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((cityData, index) => (
            <div key={index} className={styles.card}>
              <h2 className={styles.capitalName}>{cityData.CAPITAL}</h2>
              <div className={styles.dataRow}>
                <span className={styles.label}>T. Min (18h):</span>
                <span>{cityData.TMIN18} °C</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>T. Max (18h):</span>
                <span>{cityData.TMAX18} °C</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Umid. Min (18h):</span>
                <span>{cityData.UMIN18} %</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Prec. Max (12h):</span>
                <span>{cityData.PMAX12} mm</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && data.length === 0 && (
          <p>No data available right now.</p>
      )}
    </div>
  );
}
