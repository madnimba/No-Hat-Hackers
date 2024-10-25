const pool = require('../db');
const Redis = require('redis');
const { Client } = require('ioredis');
const { Redlock } = require('redlock');

// Create a Redis client
// const redisClient = Redis.createClient({
//   url: 'redis://localhost:6378'  // or your Redis server URL
// });
const redisClient = new Client({
    host: 'redis://localhost:6378'
});

redisClient.on('error', (err) => console.error('Redis error:', err));

// Create Redlock instance with retry options
const redlock = new Redlock(
  [redisClient],  // Redis clients array for distributed locking
  {
    driftFactor: 0.01,  // Time drift factor
    retryCount: 0,      // No retry
    retryDelay: 200,    // Time in ms between retries
    retryJitter: 200    // Random jitter to avoid collision
  }
);


exports.createBooking = async (req, res) => {
    const { user_id, train_id, coach_id, seat_id, date, fare } = req.body;

    console.log(user_id, train_id, coach_id, seat_id, date, fare);

    const lockKey = `seat_${train_id}_${coach_id}_${seat_id}_${date}`

    console.log(lockKey);

    try {
        // Locking
        const lock = await redlock.lock(lockKey, 30000);

        // Insert booking into the database
        const result = await pool.query(
            'INSERT INTO bookings (user_id, train_id, coach_id, seat_id, booking_date, fare, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [user_id, train_id, coach_id, seat_id, date, fare, 'Pending']
        );
        console.log(result.rows[0]);

        const bookReqBody = { train_id, coach_id, seat_id, date };
        const bookURL = 'http://localhost:4000/api/trains/bookSeat';
        const response = await fetch(bookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookReqBody)
        });

        if(!response.ok)
        {
            throw new Error('Error booking seat');
        }
        const data = await response.json();

        await lock.unlock();
        console.log(`Lock released: ${lockKey}`);
        res.status(200).json({
            userid: user_id, 
            redirectUrl: `https://localhost:3002`
        });
    } catch (error) {
        if(error instanceof redlock.LockError)
        {
            console.error(`Failed to acquire lock for seat ${seatId}:`, error.message);
        }
        else
        {
            console.error('Error creating booking:', error);
            res.status(500).json({ message: 'Error creating booking' });
        }
    }
};


// // Get all bookings
// exports.getBookings = async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM bookings');
//         res.status(200).json(result.rows);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// // Update booking status
// exports.updateBookingStatus = async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     try {
//         const result = await pool.query(
//             'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
//             [status, id]
//         );
//         if (result.rows.length > 0) {
//             res.status(200).json(result.rows[0]);
//         } else {
//             res.status(404).json({ message: 'Booking not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
