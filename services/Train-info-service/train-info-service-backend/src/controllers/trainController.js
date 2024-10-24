const pool = require('../db'); // Import the PostgreSQL connection pool

// Get all trains
exports.getTrains = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trains');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get train by ID
exports.getTrainById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trains WHERE id = $1', [req.params.id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Train not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.bookSeat = async (req, res) => {
    const { train_id, coach_id, seat_id, date } = req.body;
    try {
        const result = await pool.query(`
            UPDATE seat_details
            SET available = false
            WHERE train_id = $1
            AND coach_id = $2
            AND seat_id = $3
            AND date = $4;
            `, [train_id, coach_id, seat_id, date]);
        res.status(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Search for trains matching From, To, Date, and Coach_Type
exports.searchTrains = async (req, res) => {
    const { from_station, to_station, booking_date, coach_type } = req.query;

    console.log(from_station, to_station, booking_date, coach_type);

    try {
        const result = await pool.query(`
            SELECT 
    t.train_id AS train_id, 
    t.train_name AS train_name, 
    c.coach_id AS coach_id, 
    c.type, 
    c.fare, 
    s.seat_id, 
    s.available,
    TO_CHAR(s.date, 'YYYY-MM-DD') AS date
FROM 
    (SELECT train_id, train_name
     FROM trains
     WHERE from_station = $1 AND to_station = $2) t
JOIN 
    (SELECT coach_id, train_id, type, fare 
     FROM coaches 
     WHERE type = $4) c 
ON 
    t.train_id = c.train_id
JOIN 
    (SELECT seat_id, train_id, coach_id, available, date 
     FROM seats 
     WHERE date = $3) s 
ON 
    c.coach_id = s.coach_id AND s.train_id = t.train_id;


        `, [from_station, to_station, booking_date, coach_type]);
        

        if (result.rows.length === 0) {
            console.log("no trains found!")
            return res.status(404).json({ message: 'No trains found' });
        }
        
        console.log(result.rows[0]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
