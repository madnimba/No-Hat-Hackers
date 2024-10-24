const express = require('express');
const { searchTrains } = require('../controllers/trainController');

const router = express.Router();

// Add a route for searching trains
router.get('/search', searchTrains);

module.exports = router;
