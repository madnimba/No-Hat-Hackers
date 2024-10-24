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
