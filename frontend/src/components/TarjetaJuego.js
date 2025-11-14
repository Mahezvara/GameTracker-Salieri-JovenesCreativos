import React from 'react';
import '../styles/TarjetaJuego.css';

const TarjetaJuego = ({ juego, onEdit, onDelete, onReview, onToggleFavorite, isFavorite }) => {
  const generoEmoji = {
    Acción: '⚔️',
    RPG: '🗡️',
    Estrategia: '♟️',
    Aventura: '🗺️',
    Puzzle: '🧩',
    Deportes: '⚽',
    Simulación: '🎮',
  };

  const plataformaEmoji = {
    PC: '🖥️',
    PlayStation: '🎮',
    Xbox: '🎮',
    'Nintendo Switch': '🎮',
    Mobile: '📱',
  };

  return (
    <div className="tarjeta-juego card">
      <div className="juego-imagen">
        <img src={juego.imagenPortada} alt={juego.titulo} />
        {(juego.completado || juego.estado === 'Completado' || juego.estado === '100%') && (
          <div className="badge-completado">✓ {juego.estado || 'Completado'}</div>
        )}
      </div>

      <div className="juego-contenido">
        <div className="juego-header">
          <h3 className="juego-titulo">{juego.titulo}</h3>
          <div className="juego-badges">
            {/* Géneros */}
            {Array.isArray(juego.genero) ? (
              juego.genero.map((gen) => (
                <span key={gen} className="badge badge-genero">
                  {generoEmoji[gen] || '🎮'} {gen}
                </span>
              ))
            ) : (
              <span className="badge badge-genero">
                {generoEmoji[juego.genero] || '🎮'} {juego.genero}
              </span>
            )}
            {/* Plataformas */}
            {Array.isArray(juego.plataforma) ? (
              juego.plataforma.map((plat) => (
                <span key={plat} className="badge badge-plataforma">
                  {plataformaEmoji[plat] || '📱'} {plat}
                </span>
              ))
            ) : (
              <span className="badge badge-plataforma">
                {plataformaEmoji[juego.plataforma] || '📱'} {juego.plataforma}
              </span>
            )}
          </div>
        </div>

        <p className="juego-desarrollador">{juego.desarrollador}</p>
        <p className="juego-año">{juego.añoLanzamiento}</p>
        {juego.horasJugadas > 0 && <p className="juego-horas">⏱️ {juego.horasJugadas}h jugadas</p>}
        
        {juego.calificacion > 0 && (
          <p className="juego-calificacion">
            {'★'.repeat(juego.calificacion)}{'☆'.repeat(5 - juego.calificacion)} {juego.calificacion}/5
          </p>
        )}

        <p className="juego-descripcion">{juego.descripcion}</p>

        <div className="juego-acciones">
          <button
            className={`btn btn-fav btn-sm ${isFavorite ? 'favorito' : ''}`}
            onClick={() => onToggleFavorite && onToggleFavorite(juego._id)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
          >
            {isFavorite ? '❤️' : '🖤'}
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => onEdit(juego)}>
            Editar
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onReview && onReview(juego._id)}>
            Reseña
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(juego._id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;
