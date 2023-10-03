const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path'); // Import the path module

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Set up a path to the public directory
// Serve static files// Get the absolute path to the parent directory of 'src' (assuming server.js is in 'src')
const parentDir = path.dirname(__dirname);
// Set up a path to the 'public' directory
const publicPath = path.join(parentDir, 'public');
//from the 'public/' directory
console.log(parentDir, publicPath)
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
  console.log('Connections established', message)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const buffedMessage = message.toString('utf8')
        const json = JSON.parse(buffedMessage)
        const html = `<div hx-swap-oob='beforeend:#messages'><p>user: ${json.message}</p></div>`
        console.log(buffedMessage, html)
        client.send(html);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
