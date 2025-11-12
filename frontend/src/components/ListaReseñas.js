import React, { useState, useEffect, useContext } from 'react';
import '../styles/ListaReseñas.css';
import FormularioReseña from './FormularioReseña';
import { reviewService, gameService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ListaReseñas = ({ juegoId }) => {
  const { user } = useContext(AuthContext);
  const [reseñas, setReseñas] = useState([]);
  const [reseñasFiltradas, setReseñasFiltradas] = useState([]);
  const [juego, setJuego] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarReseñas();
    if (juegoId) {
      cargarJuego();
    }
  }, [juegoId]);

  
  useEffect(() => {
    if (!juegoId && busqueda.trim()) {
      const filtradas = reseñas.filter(reseña => 
        reseña.juegoId && 
        reseña.juegoId.titulo.toLowerCase().includes(busqueda.toLowerCase())
      );
      setReseñasFiltradas(filtradas);
    } else {
      setReseñasFiltradas(reseñas);
    }
  }, [busqueda, reseñas, juegoId]);

  const cargarJuego = async () => {
    try {
      const response = await gameService.getGameById(juegoId);
      setJuego(response.data.data);
    } catch (err) {
      console.error('Error cargando juego:', err);
    }
  };

  const cargarReseñas = async () => {
    setLoading(true);
    try {
      let response;
      if (juegoId) {
        response = await reviewService.getReviewsByGameId(juegoId);
      } else {
        
        response = await reviewService.getAllPublicReviews();
      }
      
      const data = response.data.data || response.data || [];
      setReseñas(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error detallado:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        fullError: err.response?.data || err,
      });
      
      
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error cargando las reseñas');
      }
      setReseñas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview._id, reviewData);
        setEditingReview(null);
      } else {
        await reviewService.createReview(reviewData);
      }
      setShowForm(false);
      cargarReseñas();
    } catch (err) {
      
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'Ya tienes una reseña para este juego');
      } else {
        setError('Error guardando la reseña');
      }
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await reviewService.deleteReview(id);
        cargarReseñas();
      } catch (err) {
        setError('Error eliminando la reseña');
        console.error(err);
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  return (
    <div className="lista-reseñas">
      {juegoId && juego && (
        <div className="juego-header-reseñas">
          <img src={juego.imagenPortada} alt={juego.titulo} className="juego-img-pequeña" />
          <div className="juego-info">
            <h2>{juego.titulo}</h2>
            <p>{juego.desarrollador} - {juego.añoLanzamiento}</p>
          </div>
        </div>
      )}

      <div className="reseñas-header">
        <h3>{juegoId ? `Reseñas (${reseñas.length})` : `Todas las Reseñas (${reseñasFiltradas.length})`}</h3>
        {!juegoId && (
          <input
            type="text"
            placeholder="Buscar juego..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
        )}
        {juegoId && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingReview(null);
              setShowForm(true);
            }}
          >
            + Nueva Reseña
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <FormularioReseña
          onSubmit={handleAddReview}
          onCancel={() => {
            setShowForm(false);
            setEditingReview(null);
          }}
          reviewInicial={editingReview}
          juegoId={juegoId}
        />
      )}

      {loading ? (
        <div className="loading">Cargando reseñas...</div>
      ) : (
        <>
          {reseñasFiltradas && reseñasFiltradas.length > 0 ? (
            <div className="reseñas-container">
              {reseñasFiltradas.map((reseña) => (
                <div key={reseña._id} className="reseña-item card">
                  {!juegoId && reseña.juegoId && (
                    <div className="reseña-juego-header">
                      {reseña.juegoId.imagenPortada && (
                        <img src={reseña.juegoId.imagenPortada} alt={reseña.juegoId.titulo} className="reseña-juego-img" />
                      )}
                      <div className="reseña-juego-info">
                        <h4>{reseña.juegoId.titulo}</h4>
                        <p>{reseña.juegoId.desarrollador} • {reseña.juegoId.añoLanzamiento}</p>
                      </div>
                    </div>
                  )}
                  <div className="reseña-header">
                    <div className="reseña-puntuacion">
                      <span className="estrellas">
                        {'⭐'.repeat(reseña.puntuacion)}
                      </span>
                      <span className="puntos">{reseña.puntuacion}/5</span>
                    </div>
                    <div className="reseña-info-secundaria">
                      <span className="badge badge-dificultad">{reseña.dificultad}</span>
                      <span className="badge badge-horas">⏱️ {reseña.horasJugadas}h</span>
                      {reseña.recomendaria && <span className="badge badge-recomendado">✓ Recomendado</span>}
                    </div>
                  </div>

                  <p className="reseña-texto">{reseña.textoReseña}</p>

                  <div className="reseña-fecha">
                    Escrita el {new Date(reseña.fechaCreacion).toLocaleDateString()}
                    {reseña.usuario && <span> por {reseña.usuario.nombre}</span>}
                  </div>

                  {juegoId && user && reseña.usuario && user._id === reseña.usuario._id && (
                    <div className="reseña-acciones">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditReview(reseña)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(reseña._id)}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              {busqueda && !juegoId ? (
                <p>No se encontraron reseñas para "{busqueda}"</p>
              ) : (
                <p>Aún no hay reseñas. ¡Animate a escribir una!</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaReseñas;
