import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nProvider, useI18n } from '../lib/i18n/i18nContext';

// Mock the translations module so we can test fallbacks reliably
jest.mock('../lib/i18n/translations', () => ({
  translations: {
    en: {
      existing_in_both: 'English Both',
      only_in_en: 'English Only',
      with_param: 'Hello {{name}}',
    },
    pt: {
      existing_in_both: 'Portuguese Both',
      // missing 'only_in_en'
      // missing 'with_param'
    }
  }
}));

const TestComponent = ({ translationKey, params }) => {
  const { t, language } = useI18n();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="translation">{t(translationKey, params)}</span>
    </div>
  );
};

describe('I18nContext', () => {
  it('provides default language "pt" and uses "pt" translation when available', () => {
    render(
      <I18nProvider>
        <TestComponent translationKey="existing_in_both" />
      </I18nProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('pt');
    expect(screen.getByTestId('translation').textContent).toBe('Portuguese Both');
  });

  it('allows overriding default language', () => {
    render(
      <I18nProvider defaultLang="en">
        <TestComponent translationKey="existing_in_both" />
      </I18nProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('translation').textContent).toBe('English Both');
  });

  it('falls back to English when a key is missing in the current language', () => {
    render(
      <I18nProvider defaultLang="pt">
        <TestComponent translationKey="only_in_en" />
      </I18nProvider>
    );
    expect(screen.getByTestId('translation').textContent).toBe('English Only');
  });

  it('falls back to the translation key itself when missing in both languages', () => {
    render(
      <I18nProvider defaultLang="pt">
        <TestComponent translationKey="missing_everywhere" />
      </I18nProvider>
    );
    expect(screen.getByTestId('translation').textContent).toBe('missing_everywhere');
  });

  it('correctly interpolates parameters into the translation string', () => {
    render(
      <I18nProvider defaultLang="en">
        <TestComponent translationKey="with_param" params={{ name: 'World' }} />
      </I18nProvider>
    );
    expect(screen.getByTestId('translation').textContent).toBe('Hello World');
  });

  it('correctly interpolates parameters even when falling back to English', () => {
    render(
      <I18nProvider defaultLang="pt">
        <TestComponent translationKey="with_param" params={{ name: 'Fallback' }} />
      </I18nProvider>
    );
    expect(screen.getByTestId('translation').textContent).toBe('Hello Fallback');
  });

  it('correctly interpolates multiple occurrences of the same parameter', () => {
    // Override the mock temporarily or just test what happens with key fallback
    // The replace regex uses 'g' flag, so it should replace all occurrences
    render(
      <I18nProvider defaultLang="en">
        <TestComponent translationKey="{{x}} and {{x}}" params={{ x: 'Test' }} />
      </I18nProvider>
    );
    expect(screen.getByTestId('translation').textContent).toBe('Test and Test');
  });
});
