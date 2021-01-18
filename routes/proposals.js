const express = require('express');
const router = express.Router();
const proposalsCtrl = require('../controllers/proposals');

router.get('/', proposalsCtrl.index)

router.post('/', proposalsCtrl.create)

module.exports = router;