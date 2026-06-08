/**
 * Express Server untuk Weather Dashboard
 * Backend REST API
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
/**
 * Get API configuration
 */
app.get('/api/config', (req, res) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({
            success: false,
            message: 'API Key not configured'
        });
    }
    
    res.json({
        success: true,
        apiKey: apiKey
    });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Serve main HTML file
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Weather Dashboard Server Running    ║
╚════════════════════════════════════════╝

🌡️  Server:   http://localhost:${PORT}
📊 API:      http://localhost:${PORT}/api
🌍 Weather:  http://localhost:${PORT}
⚙️  Mode:     ${process.env.NODE_ENV || 'development'}

Press Ctrl+C to stop server
    `);
});

module.exports = app;
