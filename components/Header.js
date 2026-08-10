import { useI18n } from '../lib/i18n/i18nContext';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

const Header = () => {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1>{t('weatherForecaster')}</h1>
      </div>
      <nav className={styles.nav}>
        <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <Link href="/">
              {t('home')}
            </Link>
          </li>
          <li>
            <Link href="/inmet">
              {t('inmetCapitals')}
            </Link>
          </li>
          <li>
            <Link href="/mapa">
              Mapa
            </Link>
          </li>
          <li>
            <Link href="/previsao">
              Previsão Aberta
            </Link>
          </li>
          <li>
            <Link href="/fases-da-lua">
              {t('moonPhases')}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
