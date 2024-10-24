const express = require('express');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to Train Info Service!');
});

// Start the server
app.listen(port, () => {
    console.log(`Train Info Service is running on http://localhost:${port}`);
});