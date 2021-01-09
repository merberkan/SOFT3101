const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerPanel');

router.post('/event', ownerController.event);

module.exports = router;