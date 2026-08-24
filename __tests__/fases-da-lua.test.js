import { render, screen } from '@testing-library/react';
import FasesDaLua from '../pages/fases-da-lua';
import { I18nProvider } from '../lib/i18n/i18nContext';

describe('FasesDaLua Page', () => {
  const renderWithI18n = (component) => {
    return render(<I18nProvider>{component}</I18nProvider>);
  };

  it('renders the main title', () => {
    renderWithI18n(<FasesDaLua />);
    expect(screen.getByText('FASES DA LUA 2026')).toBeInTheDocument();
  });

  it('renders the table headers correctly', () => {
    renderWithI18n(<FasesDaLua />);
    expect(screen.getByRole('columnheader', { name: 'LUA NOVA' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'LUA CRESCENTE' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'LUA CHEIA' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'LUA MINGUANTE' })).toBeInTheDocument();
  });

  it('renders the first row of data correctly', () => {
    renderWithI18n(<FasesDaLua />);
    // Testing the first row data from the array
    expect(screen.getAllByText('--')).toHaveLength(2); // nova and crescente are '--' in first row
    expect(screen.getByText('03 Jan 2026 - 07:04')).toBeInTheDocument();
    expect(screen.getByText('10 Jan 2026 - 12:49')).toBeInTheDocument();
  });

  it('renders the footer source text', () => {
    renderWithI18n(<FasesDaLua />);
    expect(screen.getByText(/Fonte: Departamento de Astronomia do Instituto de Astronomia, Geofísica e Ciências Atmosféricas/)).toBeInTheDocument();
  });
});
