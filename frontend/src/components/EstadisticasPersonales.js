import React, { useState, useEffect } from 'react';
import '../styles/EstadisticasPersonales.css';
import { gameService, reviewService } from '../services/api';

const EstadisticasPersonales = () => {
  const [stats, setStats] = useState({
    totalJuegos: 0,
    totalCompletados: 0,
    totalHoras: 0,
    promedioCalificacion: 0,
    totalReseñas: 0,
    generoPorJuegos: {},
    plataformaPorJuegos: {},
    dificultadPromedio: {},
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const gamesResponse = await gameService.getAllGames();
      const reviewsResponse = await reviewService.getAllReviews();

      const games = gamesResponse.data.data;
      const reviews = reviewsResponse.data.data;

      const totalJuegos = games.length;
      // Verificar si el estado es 'Completado'
      const totalCompletados = games.filter((g) => g.estado === 'Completado').length;
      const totalHoras = games.reduce((sum, g) => sum + (g.horasJugadas || 0), 0);
      const totalReseñas = reviews.length;
      const promedioCalificacion =
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.puntuacion, 0) / reviews.length).toFixed(1)
          : 0;

      // Géneros pueden ser arrays, así que necesitamos contar correctamente
      const generoPorJuegos = {};
      const generosOrdenados = ['Acción', 'RPG', 'Estrategia', 'Aventura', 'Puzzle', 'Deportes', 'Simulación', 'Otro'];
      
      games.forEach((game) => {
        // Si genero es un array
        if (Array.isArray(game.genero)) {
          game.genero.forEach((g) => {
            generoPorJuegos[g] = (generoPorJuegos[g] || 0) + 1;
          });
        } else if (game.genero) {
          // Si es un string
          generoPorJuegos[game.genero] = (generoPorJuegos[game.genero] || 0) + 1;
        }
      });

      // Ordenar géneros según el array predefinido
      const generoPorJuegosOrdenados = {};
      generosOrdenados.forEach((genero) => {
        if (generoPorJuegos[genero]) {
          generoPorJuegosOrdenados[genero] = generoPorJuegos[genero];
        }
      });

      // Plataformas pueden ser arrays, así que necesitamos contar correctamente
      const plataformaPorJuegos = {};
      const plataformasOrdenadas = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Otro'];
      
      games.forEach((game) => {
        // Si plataforma es un array
        if (Array.isArray(game.plataforma)) {
          game.plataforma.forEach((p) => {
            plataformaPorJuegos[p] = (plataformaPorJuegos[p] || 0) + 1;
          });
        } else if (game.plataforma) {
          // Si es un string
          plataformaPorJuegos[game.plataforma] = (plataformaPorJuegos[game.plataforma] || 0) + 1;
        }
      });

      // Ordenar plataformas según el array predefinido
      const plataformaPorJuegosOrdenadas = {};
      plataformasOrdenadas.forEach((plataforma) => {
        if (plataformaPorJuegos[plataforma]) {
          plataformaPorJuegosOrdenadas[plataforma] = plataformaPorJuegos[plataforma];
        }
      });

      const dificultadPromedio = {};
      const dificultadesOrdenadas = ['Fácil', 'Normal', 'Difícil'];
      
      reviews.forEach((review) => {
        if (!dificultadPromedio[review.dificultad]) {
          dificultadPromedio[review.dificultad] = { total: 0, count: 0 };
        }
        dificultadPromedio[review.dificultad].total += review.puntuacion;
        dificultadPromedio[review.dificultad].count += 1;
      });

      Object.keys(dificultadPromedio).forEach((key) => {
        dificultadPromedio[key] = (dificultadPromedio[key].total / dificultadPromedio[key].count).toFixed(1);
      });

      // Ordenar dificultades
      const dificultadPromedioOrdenada = {};
      dificultadesOrdenadas.forEach((dificultad) => {
        if (dificultadPromedio[dificultad]) {
          dificultadPromedioOrdenada[dificultad] = dificultadPromedio[dificultad];
        }
      });

      setStats({
        totalJuegos,
        totalCompletados,
        totalHoras,
        promedioCalificacion,
        totalReseñas,
        generoPorJuegos: generoPorJuegosOrdenados,
        plataformaPorJuegos: plataformaPorJuegosOrdenadas,
        dificultadPromedio: dificultadPromedioOrdenada,
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="estadisticas">
      <h1>📊 Tus Estadísticas</h1>

      {loading ? (
        <div className="loading">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-box card">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <h3>{stats.totalJuegos}</h3>
                <p>Juegos en tu biblioteca</p>
              </div>
            </div>

            <div className="stat-box card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.totalCompletados}</h3>
                <p>Juegos completados ({((stats.totalCompletados / stats.totalJuegos) * 100 || 0).toFixed(0)}%)</p>
              </div>
            </div>

            <div className="stat-box card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>{stats.totalHoras}h</h3>
                <p>Total de horas jugadas</p>
              </div>
            </div>

            <div className="stat-box card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{stats.promedioCalificacion}</h3>
                <p>Calificación promedio ({stats.totalReseñas} reseñas)</p>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container card">
              <h3>🎯 Juegos por Género</h3>
              <div className="chart">
                {Object.entries(stats.generoPorJuegos).map(([genero, count]) => (
                  <div key={genero} className="chart-bar">
                    <div className="bar-label">{genero}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          width: `${(count / stats.totalJuegos) * 100}%`,
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-container card">
              <h3>🖥️ Juegos por Plataforma</h3>
              <div className="chart">
                {Object.entries(stats.plataformaPorJuegos).map(([plataforma, count]) => (
                  <div key={plataforma} className="chart-bar">
                    <div className="bar-label">{plataforma}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          width: `${(count / stats.totalJuegos) * 100}%`,
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-container card">
              <h3>🎚️ Calificación por Dificultad</h3>
              <div className="chart">
                {Object.entries(stats.dificultadPromedio).map(([dificultad, promedio]) => (
                  <div key={dificultad} className="chart-bar">
                    <div className="bar-label">{dificultad}</div>
                    <div className="bar-wrapper">
                      <div className="bar bar-score">
                        {promedio}/5 ⭐
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <button className="btn btn-primary refresh-btn" onClick={cargarEstadisticas}>
        🔄 Actualizar Estadísticas
      </button>
    </div>
  );
};

export default EstadisticasPersonales;
