const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGamesByFilter,
} = require('../controllers/gameController');

router.use(protect);

router.get('/', getAllGames);
router.get('/filter', getGamesByFilter);
router.get('/:id', getGameById);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

module.exports = router;
