const express = require('express');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

// POST endpoint to create a new booking
router.post('/', createBooking);

module.exports = router;
