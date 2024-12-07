const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const targetUrl = 'https://eaglercraft-bj5.pages.dev';

const proxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['x-frame-options'] && delete proxyRes.headers['x-frame-options'];
    proxyRes.headers['content-security-policy'] && delete proxyRes.headers['content-security-policy'];
  },
});

app.use('/', proxy);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
