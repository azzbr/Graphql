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
    
    // Only log to file
    try {
        fs.appendFileSync(path.join(logsDir, 'server.log'), logMessage);
    } catch (error) {
        // If logging fails, don't throw error to prevent app disruption
        // but write to a fallback error log
        try {
            fs.appendFileSync(path.join(logsDir, 'error.log'), 
                `[${timestamp}] Failed to write log: ${error.message}\n`);
        } catch {
            // Silently fail if even error logging fails
        }
    }
}

// Log all requests
app.use((req, res, next) => {
    log(`Request: ${req.method} ${req.url}`);
    next();
});

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

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

// Handle POST login request
app.post('/login', (req, res) => {
    log(`Login attempt for user: ${req.body.username}`);
    // Let client-side handle the authentication
    res.redirect('/');
});

// Redirect all other routes to index.html for client-side routing
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
