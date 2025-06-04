import '../styles/globals.css'; // Assuming this is present
import { I18nProvider } from '../lib/i18n/i18nContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Original App component might be different, this is a common structure
function MyApp({ Component, pageProps }) {
  return (
    <I18nProvider> {/* Defaulting to 'pt' as per i18nContext.js */}
      <div className="app-container"> {/* Added wrapper div */}
        <Header />
        <main className="main-content"> {/* Added main content wrapper */}
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

export default MyApp;
