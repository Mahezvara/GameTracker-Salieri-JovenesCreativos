const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    juegoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'El ID del juego es requerido'],
    },
    puntuacion: {
      type: Number,
      required: [true, 'La puntuación es requerida'],
      min: [1, 'La puntuación mínima es 1'],
      max: [5, 'La puntuación máxima es 5'],
    },
    textoReseña: {
      type: String,
      required: [true, 'El texto de la reseña es requerido'],
      maxlength: [2000, 'La reseña no puede exceder 2000 caracteres'],
    },
    horasJugadas: {
      type: Number,
      required: [true, 'Las horas jugadas son requeridas'],
      min: [0, 'Las horas no pueden ser negativas'],
    },
    dificultad: {
      type: String,
      required: [true, 'La dificultad es requerida'],
      enum: ['Fácil', 'Normal', 'Difícil'],
    },
    recomendaria: {
      type: Boolean,
      default: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaActualizacion: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
