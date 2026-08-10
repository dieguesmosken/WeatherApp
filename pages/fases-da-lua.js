import React from 'react';
import Head from 'next/head';
import { useI18n } from '../lib/i18n/i18nContext';
import styles from '../styles/FasesDaLua.module.css';

export default function FasesDaLua() {
  const { t } = useI18n();

  // Data transcribed from the image for 2026
  const data = [
    { nova: '--', crescente: '--', cheia: '03 Jan 2026 - 07:04', minguante: '10 Jan 2026 - 12:49' },
    { nova: '18 Jan 2026 - 16:53', crescente: '26 Jan 2026 - 01:48', cheia: '01 Fev 2026 - 19:10', minguante: '09 Fev 2026 - 09:44' },
    { nova: '17 Fev 2026 - 09:03', crescente: '24 Fev 2026 - 09:28', cheia: '03 Mar 2026 - 08:39', minguante: '11 Mar 2026 - 06:41' },
    { nova: '18 Mar 2026 - 22:26', crescente: '25 Mar 2026 - 16:19', cheia: '01 Abr 2026 - 23:13', minguante: '10 Abr 2026 - 01:55' },
    { nova: '17 Abr 2026 - 08:54', crescente: '23 Abr 2026 - 23:33', cheia: '01 Mai 2026 - 14:24', minguante: '09 Mai 2026 - 18:13' },
    { nova: '16 Mai 2026 - 17:03', crescente: '23 Mai 2026 - 08:12', cheia: '31 Mai 2026 - 05:46', minguante: '08 Jun 2026 - 07:03' },
    { nova: '14 Jun 2026 - 23:56', crescente: '21 Jun 2026 - 18:55', cheia: '29 Jun 2026 - 20:58', minguante: '07 Jul 2026 - 16:30' },
    { nova: '14 Jul 2026 - 06:45', crescente: '21 Jul 2026 - 08:05', cheia: '29 Jul 2026 - 11:37', minguante: '05 Ago 2026 - 23:22' },
    { nova: '12 Ago 2026 - 14:37', crescente: '19 Ago 2026 - 23:46', cheia: '28 Ago 2026 - 01:19', minguante: '04 Set 2026 - 04:52' },
    { nova: '11 Set 2026 - 00:27', crescente: '18 Set 2026 - 17:44', cheia: '26 Set 2026 - 13:50', minguante: '03 Out 2026 - 10:26' },
    { nova: '10 Out 2026 - 12:50', crescente: '18 Out 2026 - 13:13', cheia: '26 Out 2026 - 01:13', minguante: '01 Nov 2026 - 17:30' },
    { nova: '09 Nov 2026 - 04:02', crescente: '17 Nov 2026 - 08:48', cheia: '24 Nov 2026 - 11:55', minguante: '01 Dez 2026 - 03:10' },
    { nova: '08 Dez 2026 - 21:52', crescente: '17 Dez 2026 - 02:43', cheia: '23 Dez 2026 - 22:29', minguante: '30 Dez 2026 - 16:00' },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>{t('moonPhases')} - {t('weatherForecaster')}</title>
      </Head>

      <h1 className={styles.title}>FASES DA LUA 2026</h1>

      <table className={styles.table}>
        <tbody>
          <tr className={styles.imageRow}>
            <td><div className={`${styles.moon} ${styles.luaNova}`}></div></td>
            <td><div className={`${styles.moon} ${styles.luaCrescente}`}></div></td>
            <td><div className={`${styles.moon} ${styles.luaCheia}`}></div></td>
            <td><div className={`${styles.moon} ${styles.luaMinguante}`}></div></td>
          </tr>
          <tr className={styles.headerRow}>
            <th>LUA NOVA</th>
            <th>LUA CRESCENTE</th>
            <th>LUA CHEIA</th>
            <th>LUA MINGUANTE</th>
          </tr>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? styles.defaultRow : styles.alternateRow}>
              <td>{row.nova}</td>
              <td>{row.crescente}</td>
              <td>{row.cheia}</td>
              <td>{row.minguante}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" className={styles.footerRow}>
              Fonte: Departamento de Astronomia do Instituto de Astronomia, Geofísica e Ciências Atmosféricas
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
