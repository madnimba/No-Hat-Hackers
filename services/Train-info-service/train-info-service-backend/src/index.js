const express = require('express');
const cors = require('cors');
const { conn } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



// Define routes
const trainRoutes = require('./routes/trainRoutes');
app.use('/api/trains', trainRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
