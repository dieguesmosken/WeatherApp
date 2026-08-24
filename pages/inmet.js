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
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch(`https://apitempo.inmet.gov.br/condicao/capitais/${dateStr}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();

        // Handle INMET returning an object instead of array sometimes, or an empty response
        if (Array.isArray(json) && json.length > 0) {
            setData(json);
        } else if (json && Object.keys(json).length > 0) {
            // sometimes it returns an object of objects
            setData(Object.values(json));
        } else {
             // Try yesterday if today fails or returns empty
             const yesterday = new Date(today);
             yesterday.setDate(yesterday.getDate() - 1);
             const yYear = yesterday.getFullYear();
             const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
             const yDay = String(yesterday.getDate()).padStart(2, '0');
             const yDateStr = `${yYear}-${yMonth}-${yDay}`;

             const yRes = await fetch(`https://apitempo.inmet.gov.br/condicao/capitais/${yDateStr}`);
             if (yRes.ok) {
                 const yJson = await yRes.json();
                 if (Array.isArray(yJson) && yJson.length > 0) {
                     setData(yJson);
                 } else if (yJson && Object.keys(yJson).length > 0) {
                     setData(Object.values(yJson));
                 }
             } else {
                 throw new Error("No data available for today or yesterday");
             }
        }
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
