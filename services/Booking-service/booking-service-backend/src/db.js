require('dotenv').config(); // Load environment variables
const { Client } = require('pg');

// Configure the connection
const conn = new Client({
  host: "train-ticket-management-server.postgres.database.azure.com",
  user: "nohathackers20",
  password: process.env.PG_PASSWORD, // Store this in .env too
  database: "booking_details",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.PG_SSL_CERT, // Read certificate from environment variable
  },
});

// Connect to the database
conn.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.stack);
  } else {
    console.log('Connected to the PostgreSQL database.');
  }
});

module.exports = conn;