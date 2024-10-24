const express = require('express');
const { searchTrains, bookSeat } = require('../controllers/trainController');

const router = express.Router();

// Add a route for searching trains
router.get('/search', searchTrains);
router.post('/bookSeat', bookSeat);

module.exports = router;
