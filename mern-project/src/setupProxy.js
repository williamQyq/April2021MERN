const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const isProduction = process.env.NODE_ENV === 'production';
  const targetURL = isProduction ? "https://willhopter.com" : 'http://localhost:5000';
  app.use(
    '/api',
    createProxyMiddleware({
      target: targetURL,
      changeOrigin: true,
      // pathRewrite:{
      //   '^/api':""
      // }
    })
  );

  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'ws://localhost:5050',
      ws: true,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/socket.io': "/socket.io"
      // }
    })
  )
};