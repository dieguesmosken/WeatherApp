import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('renders the footer text correctly', () => {
    render(<Footer />);

    const footerText = screen.getByText(/desenvolvido com ❤️ por Matheus Mosken Diegues/i);
    expect(footerText).toBeInTheDocument();
  });

  it('renders a footer HTML element', () => {
    const { container } = render(<Footer />);

    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });
});
