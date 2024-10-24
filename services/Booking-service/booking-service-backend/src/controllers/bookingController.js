const pool = require('../db');
const otpService = require('../services/otpService');



exports.createBooking = async (req, res) => {
    const { user_id, train_id, coach_id, seat_id, date, fare } = req.body;

    console.log(user_id, train_id, coach_id, seat_id, date, fare);

    try {
        // Insert booking into the database
        
        const result = await pool.query(
            'INSERT INTO bookings (user_id, train_id, coach_id, seat_id, booking_date, fare, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, train_id, coach_id, seat_id, date, fare, 'Pending']
        );
        console.log(result.rows[0]);

        // Generate and send OTP through the OTP service
        //const otpResponse = await otpService.sendOTP(user_id);
        //const otpCode = otpResponse.data.otp_code;

        // Update the booking with the OTP
        //await pool.query('UPDATE bookings SET otp_code = $1 WHERE id = $2', [otpCode, booking.id]);

        // Return the booking with OTP to the client
        res.status(201).json({  status: 'Pending' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};


// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings');
        res.status(200).json(result.rows);
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
