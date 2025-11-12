const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllReviews,
  getReviewsByGameId,
  createReview,
  updateReview,
  deleteReview,
  getAllPublicReviews,
} = require('../controllers/reviewController');

// Ruta pública 
router.get('/publicas/todas', getAllPublicReviews);

// Rutas protegidas 
router.get('/', protect, getAllReviews);
router.post('/', protect, createReview);
router.get('/juego/:juegoId', protect, getReviewsByGameId);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
