import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';
import { I18nProvider } from '../lib/i18n/i18nContext';

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('Header Component', () => {
  it('renders the header with translated text in Portuguese (default)', () => {
    renderWithI18n(<Header />, { locale: 'pt' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Previsão do Tempo');
  });

  it('renders the header with translated text in English', () => {
    renderWithI18n(<Header />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Weather Forecaster');
  });
});
