const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerPanel');

router.post('/event', ownerController.event);
router.post('/update/:eventno', ownerController.update);

module.exports = router;