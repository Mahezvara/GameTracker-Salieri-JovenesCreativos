import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">∞</span>
          <span className="logo-text">Salieri</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/biblioteca" className="nav-link">
                📚 BIBLIOTECA
              </Link>
              <Link to="/reseñas" className="nav-link">
                💬 RESEÑAS
              </Link>
              <Link to="/estadisticas" className="nav-link">
                📊 ESTADÍSTICAS
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user?.nombre}</span>
                <button
                  className="btn btn-secondary navbar-btn"
                  onClick={handleLogout}
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary navbar-btn">
                ACCESO
              </Link>
              <Link to="/register" className="btn btn-primary navbar-btn">
                REGISTRO
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
