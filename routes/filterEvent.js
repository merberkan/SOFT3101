const express = require('express');
const router = express.Router();
const search = require('../controllers/filterEvent');

router.post('/event', search.event);
router.post('/searchbar', search.searchbar)

module.exports = router;