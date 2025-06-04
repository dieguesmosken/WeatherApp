import '../styles/globals.css'; // Assuming this is present
import { I18nProvider } from '../lib/i18n/i18nContext';

// Original App component might be different, this is a common structure
function MyApp({ Component, pageProps }) {
  return (
    <I18nProvider> {/* Defaulting to 'pt' as per i18nContext.js */}
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default MyApp;
