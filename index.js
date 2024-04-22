const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/routes'); // Importing your route file
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Express application
const app = express();

// Middleware
// Parse incoming requests as JSON
app.use(express.json());
// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB using the URL from environment variables
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Use the imported router for routes prefixed with `/account`
app.use('/account', route);

// Start the server on the specified port
const PORT = process.env.PORT || 3000; // Use port from environment variables or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
