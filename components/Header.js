import { useI18n } from '../lib/i18n/i18nContext';
import styles from '../styles/Header.module.css';

const Header = () => {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <h1>{t('weatherForecaster')}</h1>
    </header>
  );
};

export default Header;
