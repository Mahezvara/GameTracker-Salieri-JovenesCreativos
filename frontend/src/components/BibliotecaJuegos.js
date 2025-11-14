import React, { useState, useEffect } from 'react';
import '../styles/BibliotecaJuegos.css';
import TarjetaJuego from './TarjetaJuego';
import FormularioJuego from './FormularioJuego';
import ListaReseñas from './ListaReseñas';
import { gameService, reviewService } from '../services/api';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [filtros, setFiltros] = useState({
    genero: '',
    plataforma: '',
    estado: '',
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGameForReview, setSelectedGameForReview] = useState(null);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async (filtrosAplicar = {}) => {
    setLoading(true);
    try {
      const response = await gameService.getAllGames();
      let games = response.data.data;

      if (filtrosAplicar.genero) {
        games = games.filter((g) => {
          const generos = Array.isArray(g.genero) ? g.genero : [g.genero];
          return generos.includes(filtrosAplicar.genero);
        });
      }
      if (filtrosAplicar.plataforma) {
        games = games.filter((g) => {
          const plataformas = Array.isArray(g.plataforma) ? g.plataforma : [g.plataforma];
          return plataformas.includes(filtrosAplicar.plataforma);
        });
      }
      if (filtrosAplicar.estado) {
        games = games.filter((g) => g.estado === filtrosAplicar.estado);
      }

      setJuegos(games);
      setError('');
    } catch (err) {
      setError('Error cargando los juegos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem('favorites', JSON.stringify(next));
      } catch (e) {
        console.error('No se pudo guardar favoritos en localStorage', e);
      }
      return next;
    });
  };

  const handleAddGame = async (gameData) => {
    try {
      let gameId;
      
      if (editingGame) {
        await gameService.updateGame(editingGame._id, gameData);
        gameId = editingGame._id;
        setEditingGame(null);
      } else {
        const response = await gameService.createGame(gameData);
        gameId = response.data.data._id;
      }

      setShowForm(false);
      cargarJuegos(filtros);
    } catch (err) {
      setError('Error guardando el juego');
      console.error(err);
    }
  };

  const handleDeleteGame = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await gameService.deleteGame(id);
        cargarJuegos(filtros);
      } catch (err) {
        setError('Error eliminando el juego');
        console.error(err);
      }
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleReview = (juegoId) => {
    setSelectedGameForReview(juegoId);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
    cargarJuegos(nuevosFiltros);
  };

  const resetFiltros = () => {
    setFiltros({ genero: '', plataforma: '', estado: '' });
    cargarJuegos({});
  };

  const gameCompletados = juegos.filter(
    (g) => g.estado === 'Completado'
  ).length;
  const totalHoras = juegos.reduce((total, g) => total + (g.horasJugadas || 0), 0);

  return (
    <div className="biblioteca">
      <div className="biblioteca-header">
        <h1>Mi Biblioteca de Juegos</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingGame(null);
            setShowForm(true);
          }}
        >
          + Agregar Juego
        </button>
        <button
          className={`btn btn-outline" ${showOnlyFavorites ? 'active' : ''}`}
          style={{ marginLeft: '10px' }}
          onClick={() => setShowOnlyFavorites((s) => !s)}
        >
          {showOnlyFavorites ? 'Mostrar todo' : 'Mostrar favoritos'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="estadisticas-rapidas">
        <div className="stat-card">
          <span className="stat-value">{juegos.length}</span>
          <span className="stat-label">Juegos Totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{gameCompletados}</span>
          <span className="stat-label">Completados</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalHoras}h</span>
          <span className="stat-label">Horas Jugadas</span>
        </div>
      </div>

      {showForm && (
        <FormularioJuego
          onSubmit={handleAddGame}
          onCancel={() => {
            setShowForm(false);
            setEditingGame(null);
          }}
          gameInicial={editingGame}
        />
      )}

      <div className="filtros">
        <select
          name="genero"
          value={filtros.genero}
          onChange={handleFiltroChange}
          className="filtro-select"
        >
          <option value="">Todos los géneros</option>
          <option value="Acción">Acción</option>
          <option value="RPG">RPG</option>
          <option value="Estrategia">Estrategia</option>
          <option value="Aventura">Aventura</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Deportes">Deportes</option>
          <option value="Simulación">Simulación</option>
        </select>

        <select
          name="plataforma"
          value={filtros.plataforma}
          onChange={handleFiltroChange}
          className="filtro-select"
        >
          <option value="">Todas las plataformas</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="Mobile">Mobile</option>
        </select>

        <select
          name="estado"
          value={filtros.estado}
          onChange={handleFiltroChange}
          className="filtro-select"
        >
          <option value="">Estado: Todos</option>
          <option value="No jugado">No jugado</option>
          <option value="En progreso">En progreso</option>
          <option value="En pausa">En pausa</option>
          <option value="Completado">Completado</option>
          <option value="Abandonado">Abandonado</option>
        </select>

        <button className="btn btn-secondary" onClick={resetFiltros}>
          Limpiar filtros
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando juegos...</div>
      ) : (
        <>
          {selectedGameForReview && (
            <div className="reseñas-overlay">
              <div className="reseñas-modal">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedGameForReview(null)}
                  style={{ marginBottom: '15px' }}
                >
                  ← Volver
                </button>
                <ListaReseñas juegoId={selectedGameForReview} />
              </div>
            </div>
          )}
          <div className="juegos-grid">
            {(showOnlyFavorites ? juegos.filter((g) => favorites.includes(g._id)) : juegos).map((juego) => (
              <TarjetaJuego
                key={juego._id}
                juego={juego}
                onEdit={handleEditGame}
                onDelete={handleDeleteGame}
                onReview={handleReview}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(juego._id)}
              />
            ))}
          </div>
          {juegos.length === 0 && (
            <div className="no-games">
              <p>No hay juegos en tu biblioteca. ¡Agrega uno para empezar!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BibliotecaJuegos;
