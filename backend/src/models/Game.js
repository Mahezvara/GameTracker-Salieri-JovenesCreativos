const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título del juego es requerido'],
      trim: true,
    },
    genero: [{
      type: String,
      enum: ['Acción', 'RPG', 'Estrategia', 'Aventura', 'Puzzle', 'Deportes', 'Simulación', 'Otro'],
    }],
    plataforma: [{
      type: String,
      enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Otro'],
    }],
    año: {
      type: Number,
      required: [true, 'El año de lanzamiento es requerido'],
      min: [1980, 'Año inválido'],
      max: [new Date().getFullYear() + 1, 'Año inválido'],
    },
    desarrollador: {
      type: String,
      required: [true, 'El desarrollador es requerido'],
    },
    imagenPortada: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=No+Image',
    },
    descripcion: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: ['No jugado', 'En progreso', 'En pausa', 'Completado', 'Abandonado'],
      default: 'No jugado',
    },
    horasJugadas: {
      type: Number,
      default: 0,
    },
    reseña: {
      type: String,
      trim: true,
      default: '',
    },
    calificacion: {
      type: Number,
      min: [0, 'La calificación mínima es 0'],
      max: [5, 'La calificación máxima es 5'],
      default: 0,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
