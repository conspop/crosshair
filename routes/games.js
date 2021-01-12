const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');

router.get('/', gamesCtrl.show)

router.post('/', gamesCtrl.newGame)

module.exports = router;