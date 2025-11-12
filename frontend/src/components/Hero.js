import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Hero.css';

const Hero = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <section className="hero">
      <div className="hero-content container">
        <h1 className="hero-title">Salieri</h1>
        <p className="hero-subtitle">Descubre, colecciona y analiza tus juegos</p>
        
        <div className="hero-description">
          <p>Salieri te ayuda a organizar tu biblioteca, registrar lo que has jugado y lo que quieres jugar, compartiendo reseñas con tu comunidad. Encuentra recomendaciones, crea listas y mantén
          tu colección siempre actualizada.</p>
        </div>

        <div className="hero-features">
          <div className="feature">
            <img src="https://i.imgur.com/mzeVupE.png" alt="Gestionar tu colección personal de videojuegos" className="feature-icon" />
            <p>Gestionar tu colección personal de videojuegos</p>
          </div>
          <div className="feature">
            <img src="https://i.imgur.com/azxNpBG.png" alt="Escribir reseñas detalladas con puntuaciones" className="feature-icon" />
            <p>Escribir reseñas detalladas con puntuaciones</p>
          </div>
          <div className="feature">
            <img src="https://i.imgur.com/wlpbl0R.png" alt="Filtrar tu biblioteca por género, plataforma, etc." className="feature-icon" />
            <p>Filtrar tu biblioteca por género, plataforma, etc.</p>
          </div>
          <div className="feature">
            <img src="https://i.imgur.com/RtSow6k.png" alt="Ver estadísticas de tus juegos jugados" className="feature-icon" />
            <p>Ver estadísticas de tus juegos jugados</p>
          </div>
          <div className="feature">
            <img src="https://i.imgur.com/H1DP8rp.png" alt="Marcar juegos como completados" className="feature-icon" />
            <p>Marcar juegos como completados</p>
          </div>
          <div className="feature">
            <img src="https://i.imgur.com/jm4P7V1.png" alt="Registrar horas jugadas" className="feature-icon" />
            <p>Registrar horas jugadas</p>
          </div>
        </div>

        {!user && (
          <Link to="/register" className="btn btn-primary hero-btn">
            CREAR CUENTA
          </Link>
        )}
      </div>

      <div className="hero-background">
        <div className="game-carousel">
          {/* imagenes de juegos */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
