// Get dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
var config = require('config');


const app = express();

// allow cross origin
app.use(cors());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = config.get('serverPort');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on ${config.get('hostAddress')}:${port}`));