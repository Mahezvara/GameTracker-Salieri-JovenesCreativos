import React, { useState, useEffect } from 'react';
import '../styles/FormularioReseña.css';
import { gameService } from '../services/api';

const FormularioReseña = ({ onSubmit, onCancel, reviewInicial, juegoId }) => {
  const [juegos, setJuegos] = useState([]);
  const [formData, setFormData] = useState({
    juegoId: juegoId || '',
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarJuegos();
    if (reviewInicial) {
      setFormData(reviewInicial);
    }
  }, [reviewInicial]);

  const cargarJuegos = async () => {
    try {
      const response = await gameService.getAllGames();
      setJuegos(response.data.data);
    } catch (err) {
      console.error('Error cargando juegos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'puntuacion' || name === 'horasJugadas' ? parseFloat(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validar = () => {
    const newErrors = {};
    if (!formData.juegoId) newErrors.juegoId = 'Debes seleccionar un juego';
    if (!formData.textoReseña.trim()) newErrors.texto = 'La reseña es requerida';
    if (formData.puntuacion < 1 || formData.puntuacion > 5) newErrors.puntuacion = 'Puntuación inválida';
    if (formData.horasJugadas < 0) newErrors.horas = 'Las horas no pueden ser negativas';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validar();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        juegoId: juegoId || '',
        puntuacion: 5,
        textoReseña: '',
        horasJugadas: 0,
        dificultad: 'Normal',
        recomendaria: true,
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="formulario-backdrop">
      <div className="formulario-reseña card">
        <h2>{reviewInicial ? 'Editar Reseña' : 'Nueva Reseña'}</h2>

        <form onSubmit={handleSubmit}>
          {!juegoId && (
            <div className="form-group">
              <label htmlFor="juegoId">Selecciona el Juego</label>
              <select
                id="juegoId"
                name="juegoId"
                value={formData.juegoId}
                onChange={handleChange}
              >
                <option value="">-- Selecciona un juego --</option>
                {juegos.map((juego) => (
                  <option key={juego._id} value={juego._id}>
                    {juego.titulo}
                  </option>
                ))}
              </select>
              {errors.juegoId && <span className="error">{errors.juegoId}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="puntuacion">Puntuación (1-5 estrellas)</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= formData.puntuacion ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, puntuacion: star })}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="rating-value">{formData.puntuacion} / 5</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dificultad">Dificultad</label>
              <select
                id="dificultad"
                name="dificultad"
                value={formData.dificultad}
                onChange={handleChange}
              >
                <option value="Fácil">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="horasJugadas">Horas Jugadas</label>
              <input
                id="horasJugadas"
                type="number"
                name="horasJugadas"
                value={formData.horasJugadas}
                onChange={handleChange}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="textoReseña">Tu Reseña</label>
            <textarea
              id="textoReseña"
              name="textoReseña"
              value={formData.textoReseña}
              onChange={handleChange}
              placeholder="Escribe tu reseña detallada aquí..."
              maxLength="2000"
            />
            <span className="char-count">{formData.textoReseña.length}/2000</span>
            {errors.texto && <span className="error">{errors.texto}</span>}
          </div>

          <div className="form-group checkbox">
            <input
              id="recomendaria"
              type="checkbox"
              name="recomendaria"
              checked={formData.recomendaria}
              onChange={handleChange}
            />
            <label htmlFor="recomendaria">Recomendaría este juego</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {reviewInicial ? 'Actualizar Reseña' : 'Publicar Reseña'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioReseña;
