const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login' ,authController.login);
router.post('/contactus',authController.contactus);
router.post('/adminPanel' ,authController.adminPanel);

module.exports = router;