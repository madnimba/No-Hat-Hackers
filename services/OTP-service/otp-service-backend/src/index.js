const express = require('express');
const cors = require('cors');
const otpRoutes = require('./controllers/otpController');

const app = express();

// Middleware
app.use(cors()); // Enable CORS
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/otp', otpRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});