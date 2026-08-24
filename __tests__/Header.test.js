import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';
import { I18nProvider } from '../lib/i18n/i18nContext';

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

describe('Header', () => {
  it('renders the header title correctly (Portuguese)', () => {
    renderWithI18n(<Header />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Previsão do Tempo');
  });

  it('renders navigation links correctly with translations', () => {
    renderWithI18n(<Header />);

    const homeLink = screen.getByRole('link', { name: /Início/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const inmetLink = screen.getByRole('link', { name: /INMET Capitais/i });
    expect(inmetLink).toBeInTheDocument();
    expect(inmetLink).toHaveAttribute('href', '/inmet');

    const mapLink = screen.getByRole('link', { name: /Mapa/i });
    expect(mapLink).toBeInTheDocument();
    expect(mapLink).toHaveAttribute('href', '/mapa');

    const previsaoLink = screen.getByRole('link', { name: /Previsão Aberta/i });
    expect(previsaoLink).toBeInTheDocument();
    expect(previsaoLink).toHaveAttribute('href', '/previsao');

    const moonPhasesLink = screen.getByRole('link', { name: /Fases da Lua/i });
    expect(moonPhasesLink).toBeInTheDocument();
    expect(moonPhasesLink).toHaveAttribute('href', '/fases-da-lua');
  });
});
