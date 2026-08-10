import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} INMET - Instituto Nacional de Meteorologia</p>
    </footer>
  );
};

export default Footer;
