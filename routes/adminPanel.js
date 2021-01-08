const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminPanel');

router.post('/event', adminController.event);
router.post('/city' ,adminController.city);

module.exports = router;