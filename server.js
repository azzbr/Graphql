const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Logging utility
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Log to console
    console.log(logMessage);
    
    // Log to file
    fs.appendFileSync(path.join(logsDir, 'server.log'), logMessage);
}

// Log all requests
app.use((req, res, next) => {
    log(`Request: ${req.method} ${req.url}`);
    next();
});

// Serve static files
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')), (req, res, next) => {
    if (req.url !== '/favicon.ico') {
        log(`Serving static file from public: ${req.url}`);
    }
    next();
});

// Serve static files from src directory with proper MIME types
app.use('/src', express.static(path.join(__dirname, 'src'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}), (req, res, next) => {
    log(`Serving static file from src: ${req.url}`);
    next();
});

// Redirect all routes to index.html for client-side routing
app.get('*', (req, res) => {
    log(`Redirecting ${req.url} to index.html`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    log(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

const PORT = 8080;
app.listen(PORT, () => {
    log(`Server running at http://localhost:${PORT}`);
    log(`Server started on port ${PORT}`);
    log('Static file serving enabled for directories:');
    log(` - /public: ${path.join(__dirname, 'public')}`);
    log(` - /src: ${path.join(__dirname, 'src')}`);
});
