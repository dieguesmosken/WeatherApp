import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FavoritesList from '../FavoritesList';
import { I18nProvider } from '../../lib/i18n/i18nContext'; // Adjusted path

const renderWithI18n = (ui, { locale = 'pt', ...options } = {}) => {
  return render(<I18nProvider defaultLang={locale}>{ui}</I18nProvider>, options);
};

const mockFavorites = ['Londres', 'Paris', 'Tóquio'];

describe('FavoritesList', () => {
  it('renders "No favorite cities" message when favorites list is empty (Portuguese)', () => {
    renderWithI18n(<FavoritesList favorites={[]} onSelectFavorite={() => {}} onRemoveFavorite={() => {}} />);
    expect(screen.getByText('Nenhuma cidade favorita ainda. Adicione algumas!')).toBeInTheDocument();
  });

  it('renders a list of favorite cities with remove buttons (Portuguese)', () => {
    renderWithI18n(<FavoritesList favorites={mockFavorites} onSelectFavorite={() => {}} onRemoveFavorite={() => {}} />);
    expect(screen.getByRole('heading', { name: /Favoritos/i })).toBeInTheDocument();
    mockFavorites.forEach(city => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
    const removeButtons = screen.getAllByRole('button', { name: /Remover dos Favoritos/i });
    expect(removeButtons).toHaveLength(mockFavorites.length);
  });

  it('calls onSelectFavorite when a city name is clicked', () => {
    const mockSelect = jest.fn();
    renderWithI18n(<FavoritesList favorites={mockFavorites} onSelectFavorite={mockSelect} onRemoveFavorite={() => {}} />);
    fireEvent.click(screen.getByText('Paris'));
    expect(mockSelect).toHaveBeenCalledWith('Paris');
  });

  it('calls onRemoveFavorite when a remove button is clicked', () => {
    const mockRemove = jest.fn();
    renderWithI18n(<FavoritesList favorites={mockFavorites} onSelectFavorite={() => {}} onRemoveFavorite={mockRemove} />);
    // Click remove for the first city (Londres)
    const removeButtons = screen.getAllByRole('button', { name: /Remover dos Favoritos/i });
    fireEvent.click(removeButtons[0]);
    expect(mockRemove).toHaveBeenCalledWith('Londres');
  });
});
