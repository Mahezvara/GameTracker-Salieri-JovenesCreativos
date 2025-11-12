import React, { useState, useEffect } from 'react';
import '../styles/FormularioJuego.css';
import { defaultGames } from '../data/defaultGames';

const FormularioJuego = ({ onSubmit, onCancel, gameInicial }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    genero: [],
    plataforma: [],
    año: new Date().getFullYear(),
    desarrollador: '',
    imagenPortada: 'https://via.placeholder.com/300x400?text=No+Image',
    descripcion: '',
    estado: 'No jugado',
    horasJugadas: 0,
    calificacion: 0,
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (gameInicial) {
      
      const processedGame = {
        ...gameInicial,
        genero: Array.isArray(gameInicial.genero) ? gameInicial.genero : gameInicial.genero ? [gameInicial.genero] : [],
        plataforma: Array.isArray(gameInicial.plataforma) ? gameInicial.plataforma : gameInicial.plataforma ? [gameInicial.plataforma] : [],
        estado: gameInicial.estado || 'No jugado',
        horasJugadas: gameInicial.horasJugadas || 0,
        calificacion: gameInicial.calificacion || 0,
      };
      setFormData(processedGame);
      
      
      if (gameInicial.id) {
        setSelectedGame(gameInicial.id);
      } else {
        
        const defaultGame = defaultGames.find(
          (game) =>
            game.titulo.toLowerCase() === gameInicial.titulo.toLowerCase() &&
            game.desarrollador.toLowerCase() === gameInicial.desarrollador.toLowerCase()
        );
        if (defaultGame) {
          setSelectedGame(defaultGame.id);
        }
      }
    }
  }, [gameInicial]);

  const handleTituloChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      titulo: value,
    });

    
    if (value.trim()) {
      const filtered = defaultGames.filter((game) =>
        game.titulo.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (errors.titulo) {
      setErrors({ ...errors, titulo: '' });
    }
  };

  const handleSelectGame = (game) => {
    
    setFormData({
      ...formData,
      titulo: game.titulo,
      genero: Array.isArray(game.genero) ? game.genero : [game.genero],
      plataforma: Array.isArray(game.plataforma) ? game.plataforma : [game.plataforma],
      añoLanzamiento: game.año,
      desarrollador: game.desarrollador,
      imagenPortada: game.imagenPortada,
      descripcion: game.descripcion,
    });
    setSelectedGame(game.id);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleGeneroChange = (genero) => {
    const generosArray = Array.isArray(formData.genero) ? formData.genero : [];
    setFormData({
      ...formData,
      genero: generosArray.includes(genero)
        ? generosArray.filter((g) => g !== genero)
        : [...generosArray, genero],
    });
  };

  const handlePlataformaChange = (plataforma) => {
    const plataformasArray = Array.isArray(formData.plataforma) ? formData.plataforma : [];
    setFormData({
      ...formData,
      plataforma: plataformasArray.includes(plataforma)
        ? plataformasArray.filter((p) => p !== plataforma)
        : [...plataformasArray, plataforma],
    });
  };

  const handleTituloFocus = () => {
    if (formData.titulo) {
      const filtered = defaultGames.filter((g) =>
        g.titulo.toLowerCase().includes(formData.titulo.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'horasJugadas' || name === 'año' ? parseFloat(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validar = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.desarrollador.trim()) newErrors.desarrollador = 'El desarrollador es requerido';
    if (formData.año < 1980) newErrors.año = 'Año inválido';
    if (formData.genero.length === 0) newErrors.genero = 'Selecciona al menos un género';
    if (formData.plataforma.length === 0) newErrors.plataforma = 'Selecciona al menos una plataforma';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validar();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        titulo: '',
        genero: [],
        plataforma: [],
        año: new Date().getFullYear(),
        desarrollador: '',
        imagenPortada: 'https://via.placeholder.com/300x400?text=No+Image',
        descripcion: '',
        estado: 'No jugado',
        horasJugadas: 0,
        calificacion: 0,
      });
      setSelectedGame(null);
    } else {
      setErrors(newErrors);
    }
  };

  const handleRatingChange = (e, star) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({ ...formData, calificacion: star });
  };

  const isDefault = selectedGame !== null;

  return (
    <div className="formulario-backdrop">
      <div className="formulario-juego card">
        <h2>
          {isDefault ? '🔒 ' : ''}
          {gameInicial ? 'Editar Juego' : 'Agregar Nuevo Juego'}
        </h2>
        {isDefault && (
          <p className="default-warning">
            ✓ Juego predeterminado seleccionado. Puedes editar horas jugadas y estado de completado.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título del Juego</label>
            <div className="titulo-input-container">
              <input
                id="titulo"
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleTituloChange}
                onFocus={handleTituloFocus}
                placeholder="Ej: Grand Theft Auto V"
                disabled={isDefault}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((game) => (
                    <li key={game.id} onClick={() => handleSelectGame(game)}>
                      <img src={game.imagenPortada} alt={game.titulo} className="suggestion-img" />
                      <span>{game.titulo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.titulo && <span className="error">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label>Géneros (Selecciona múltiples)</label>
            <div className="checkbox-group">
              {['Acción', 'RPG', 'Estrategia', 'Aventura', 'Puzzle', 'Deportes', 'Simulación', 'Otro'].map((genero) => (
                <label key={genero} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={(Array.isArray(formData.genero) ? formData.genero : []).includes(genero)}
                    onChange={() => handleGeneroChange(genero)}
                    disabled={isDefault}
                  />
                  {genero}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Plataformas (Selecciona múltiples)</label>
            <div className="checkbox-group">
              {['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Otro'].map((plataforma) => (
                <label key={plataforma} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={(Array.isArray(formData.plataforma) ? formData.plataforma : []).includes(plataforma)}
                    onChange={() => handlePlataformaChange(plataforma)}
                    disabled={isDefault}
                  />
                  {plataforma}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="año">Año de Lanzamiento</label>
            <input
              id="año"
              type="number"
              name="año"
              value={formData.año}
              onChange={handleChange}
              min="1980"
              max={new Date().getFullYear() + 1}
              disabled={isDefault}
            />
          </div>

          <div className="form-group">
            <label htmlFor="desarrollador">Desarrollador</label>
            <input
              id="desarrollador"
              type="text"
              name="desarrollador"
              value={formData.desarrollador}
              onChange={handleChange}
              placeholder="Ej: Nintendo"
              disabled={isDefault}
            />
            {errors.desarrollador && <span className="error">{errors.desarrollador}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="imagen">URL de la Portada</label>
            <input
              id="imagen"
              type="url"
              name="imagenPortada"
              value={formData.imagenPortada}
              onChange={handleChange}
              placeholder="https://..."
              disabled={isDefault}
            />
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

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del juego..."
              disabled={isDefault}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado del Juego</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="No jugado">No jugado</option>
              <option value="En progreso">En progreso</option>
              <option value="En pausa">En pausa</option>
              <option value="Completado">Completado</option>
              <option value="Abandonado">Abandonado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="calificacion">Calificación (Estrellas)</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${formData.calificacion >= star ? 'filled' : ''}`}
                  onClick={(e) => handleRatingChange(e, star)}
                  onMouseDown={(e) => e.preventDefault()}
                  title={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                >
                  ★
                </button>
              ))}
              <span className="rating-value">
                {formData.calificacion > 0 ? `${formData.calificacion}/5` : 'Sin calificar'}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Enviar
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

export default FormularioJuego;
