const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Target URL to proxy requests
const targetUrl = 'https://eaglercraft.com/mc/1.8.8/';

// Create the proxy middleware
const proxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyRes: (proxyRes, req, res) => {
    // Remove headers that might block embedding or loading content in an iframe
    proxyRes.headers['x-frame-options'] && delete proxyRes.headers['x-frame-options'];
    proxyRes.headers['content-security-policy'] && delete proxyRes.headers['content-security-policy'];
  },
});

// Serve proxy at the root path
app.use('/', proxy);

// Serve a basic HTML page with the JavaScript to disable right-click and Ctrl commands
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pathetic Proxy</title>
      <script>
        // Disable Right Click
        document.addEventListener('contextmenu', function(event) {
          event.preventDefault();
        });

        // Disable Ctrl+Key Commands (e.g., Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S)
        document.addEventListener('keydown', function(event) {
          if (event.ctrlKey && (event.key === 'c' || event.key === 'v' || event.key === 'x' || event.key === 's')) {
            event.preventDefault();
          }
        });
      </script>
    </head>
    <body>
      <h1>Welcome to Pathetic Proxy</h1>
      <p>Enjoy playing Roblox!</p>
    </body>
    </html>
  `);
});

// Define the port for the server
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
