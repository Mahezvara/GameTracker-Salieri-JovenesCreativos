const Game = require('../models/Game');
const Review = require('../models/Review');


exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ usuario: req.user.id }).sort({ fechaCreacion: -1 });
    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id, usuario: req.user.id });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createGame = async (req, res) => {
  try {
    const game = await Game.create({
      ...req.body,
      usuario: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Juego agregado correctamente',
      data: game,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Juego actualizado correctamente',
      data: game,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({ _id: req.params.id, usuario: req.user.id });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    
    await Review.deleteMany({ juegoId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Juego eliminado correctamente',
      data: game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getGamesByFilter = async (req, res) => {
  try {
    const { genero, plataforma, completado } = req.query;
    const filter = { usuario: req.user.id };

    if (genero) filter.genero = genero;
    if (plataforma) filter.plataforma = plataforma;
    if (completado !== undefined) filter.completado = completado === 'true';

    const games = await Game.find(filter).sort({ fechaCreacion: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
