const Review = require('../models/Review');
const Game = require('../models/Game');


exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ usuario: req.user.id })
      .populate('juegoId')
      .sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getReviewsByGameId = async (req, res) => {
  try {
    const reviews = await Review.find({ juegoId: req.params.juegoId })
      .populate('juegoId')
      .populate('usuario', 'nombre email')
      .sort({ fechaCreacion: -1 });

    
    const validReviews = reviews.filter(review => review.juegoId !== null);

    res.status(200).json({
      success: true,
      count: validReviews.length,
      data: validReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createReview = async (req, res) => {
  try {
    
    const game = await Game.findOne({ _id: req.body.juegoId, usuario: req.user.id });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    
    const existingReview = await Review.findOne({
      usuario: req.user.id,
      juegoId: req.body.juegoId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'Ya tienes una reseña para este juego. Edita la existente o elimínala para crear una nueva.',
      });
    }

    const review = await Review.create({ ...req.body, usuario: req.user.id });
    const populatedReview = await review.populate('juegoId');

    res.status(201).json({
      success: true,
      message: 'Reseña creada correctamente',
      data: populatedReview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate({ _id: req.params.id, usuario: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    }).populate('juegoId');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña actualizada correctamente',
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, usuario: req.user.id });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña eliminada correctamente',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('juegoId')
      .populate('usuario', 'nombre email')
      .sort({ fechaCreacion: -1 });

    
    const validReviews = reviews.filter(review => review.juegoId !== null);

    res.status(200).json({
      success: true,
      count: validReviews.length,
      data: validReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
