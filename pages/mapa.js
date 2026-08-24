import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useI18n } from '../lib/i18n/i18nContext';
import { fetchInmetData } from '../lib/api/inmet';

// Dynamically import the map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Mapa() {
  const { t } = useI18n();
  const [inmetData, setInmetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchInmetData();
        setInmetData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Head>
        <title>Mapa INMET - Weather Dashboard</title>
      </Head>

      <h1 style={{ marginBottom: '20px', fontSize: '2rem' }}>Mapa Meteorológico - INMET Capitais</h1>

      {loading && <p>Carregando dados do INMET...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {!loading && !error && (
        <div style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
          <MapWithNoSSR data={inmetData} />
        </div>
      )}
    </div>
  );
}
