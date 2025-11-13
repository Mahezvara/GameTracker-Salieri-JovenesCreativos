import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Salieri. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="https://www.facebook.com/miguelangel.hernandez.3998263" target="_blank" rel="noopener noreferrer">Facebook</a>
          <span className="separator">|</span>
          <a href="https://github.com/Mahezvara" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="separator">|</span>
          <a href="https://www.instagram.com/miyelho/?igsh=aHhidzg1bTd1aTVu#" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
