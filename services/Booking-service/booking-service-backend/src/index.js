const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Use booking routes
app.use('/api/bookings', bookingRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Booking service is running on port ${PORT}`);
});
