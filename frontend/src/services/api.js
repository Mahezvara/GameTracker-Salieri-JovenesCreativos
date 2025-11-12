import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con token
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios de Autenticación
export const authService = {
  register: (nombre, email, contraseña, confirmarContraseña) =>
    axios.post(`${API_BASE_URL}/auth/register`, {
      nombre,
      email,
      contraseña,
      confirmarContraseña,
    }),
  login: (email, contraseña) =>
    axios.post(`${API_BASE_URL}/auth/login`, { email, contraseña }),
  logout: () => axiosInstance.post(`${API_BASE_URL}/auth/logout`),
  getCurrentUser: () => axiosInstance.get(`${API_BASE_URL}/auth/me`),
};

// Servicios para Juegos
export const gameService = {
  getAllGames: () => axiosInstance.get(`${API_BASE_URL}/juegos`),
  getGameById: (id) => axiosInstance.get(`${API_BASE_URL}/juegos/${id}`),
  createGame: (gameData) => axiosInstance.post(`${API_BASE_URL}/juegos`, gameData),
  updateGame: (id, gameData) => axiosInstance.put(`${API_BASE_URL}/juegos/${id}`, gameData),
  deleteGame: (id) => axiosInstance.delete(`${API_BASE_URL}/juegos/${id}`),
  getGamesByFilter: (params) => axiosInstance.get(`${API_BASE_URL}/juegos/filter`, { params }),
};

// Servicios para Reseñas
export const reviewService = {
  getAllReviews: () => axiosInstance.get(`${API_BASE_URL}/resenas`),
  getAllPublicReviews: () => axios.get(`${API_BASE_URL}/resenas/publicas/todas`),
  getReviewsByGameId: (gameId) => axiosInstance.get(`${API_BASE_URL}/resenas/juego/${gameId}`),
  createReview: (reviewData) => axiosInstance.post(`${API_BASE_URL}/resenas`, reviewData),
  updateReview: (id, reviewData) => axiosInstance.put(`${API_BASE_URL}/resenas/${id}`, reviewData),
  deleteReview: (id) => axiosInstance.delete(`${API_BASE_URL}/resenas/${id}`),
};
