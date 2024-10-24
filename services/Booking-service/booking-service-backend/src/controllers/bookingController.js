const pool = require('../db');

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new booking
exports.createBooking = async (req, res) => {
    const { user_id, train_id, seat_number } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bookings (user_id, train_id, seat_number, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, train_id, seat_number, 'Pending']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
