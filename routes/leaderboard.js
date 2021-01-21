const express = require('express');
const router = express.Router();
const leaderboardCtrl = require('../controllers/leaderboard');

router.get('/', leaderboardCtrl.index)

module.exports = router;