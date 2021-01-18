const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');

router.get('/', gamesCtrl.index)
router.get('/:gameId', gamesCtrl.show)

router.put('/play-card', gamesCtrl.playCard)
router.put('/join-game', gamesCtrl.joinGame)

router.post('/', gamesCtrl.newGame)

module.exports = router;