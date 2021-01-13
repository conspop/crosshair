const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');

router.put('/play-card', gamesCtrl.playCard)
router.put('/join-game', gamesCtrl.joinGame)

router.post('/', gamesCtrl.newGame)

module.exports = router;