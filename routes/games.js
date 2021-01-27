const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/games');

router.get('/', gamesCtrl.index)
router.get('/:gameId', gamesCtrl.show)

router.put('/', gamesCtrl.playCard)
router.put('/resign', gamesCtrl.resign)

router.post('/', gamesCtrl.newGame)
router.post('/updateVersion', gamesCtrl.updateVersion)

module.exports = router;