const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');

router.get('/', gamesCtrl.show)

router.put('/:gameId', gamesCtrl.update)

router.post('/', gamesCtrl.newGame)

module.exports = router;