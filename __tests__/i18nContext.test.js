import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nProvider, useI18n } from '../lib/i18n/i18nContext';
import { translations } from '../lib/i18n/translations';

const TestComponent = ({ testKey, params }) => {
  const { t, language } = useI18n();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translated">{t(testKey, params)}</span>
    </div>
  );
};

describe('I18nProvider', () => {
  it('renders with default language pt', () => {
    render(
      <I18nProvider>
        <TestComponent testKey="weatherForecaster" />
      </I18nProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
    expect(screen.getByTestId('translated')).toHaveTextContent(translations.pt.weatherForecaster);
  });

  it('renders with provided default language en', () => {
    render(
      <I18nProvider defaultLang="en">
        <TestComponent testKey="weatherForecaster" />
      </I18nProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('translated')).toHaveTextContent(translations.en.weatherForecaster);
  });

  it('translates strings correctly', () => {
    render(
      <I18nProvider defaultLang="en">
        <TestComponent testKey="getWeather" />
      </I18nProvider>
    );
    expect(screen.getByTestId('translated')).toHaveTextContent(translations.en.getWeather);
  });

  it('translates strings with parameters', () => {
    render(
      <I18nProvider defaultLang="en">
        <TestComponent testKey="weatherIn" params={{ city: 'London' }} />
      </I18nProvider>
    );
    expect(screen.getByTestId('translated')).toHaveTextContent('Weather in London');
  });

  it('translates strings with multiple parameters', () => {
     // We do not have a default string with multiple parameters, but let's mock the translations to test
     const originalTranslations = { ...translations };
     translations.en.testMultiParams = 'Temp is {{temp}} and city is {{city}}';
     render(
       <I18nProvider defaultLang="en">
         <TestComponent testKey="testMultiParams" params={{ city: 'London', temp: '20' }} />
       </I18nProvider>
     );
     expect(screen.getByTestId('translated')).toHaveTextContent('Temp is 20 and city is London');
     translations.en = originalTranslations.en; // Restore
  });

  it('falls back to English if key is missing in selected language', () => {
    const originalTranslations = { ...translations };
    translations.en.testFallback = 'Fallback String';
    // Not adding to pt
    render(
      <I18nProvider defaultLang="pt">
        <TestComponent testKey="testFallback" />
      </I18nProvider>
    );
    expect(screen.getByTestId('translated')).toHaveTextContent('Fallback String');
    translations.en = originalTranslations.en; // Restore
  });

  it('falls back to key if key is missing in all languages', () => {
    render(
      <I18nProvider defaultLang="pt">
        <TestComponent testKey="missingKey" />
      </I18nProvider>
    );
    expect(screen.getByTestId('translated')).toHaveTextContent('missingKey');
  });
});
