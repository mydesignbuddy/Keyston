/**
 * HTTP Proxy Middleware Configuration for Create React App
 *
 * This proxy configuration is ONLY used in development mode
 * to avoid CORS issues when making API calls from the browser.
 *
 * In production (native mobile apps), API calls are made directly
 * without a proxy since CORS doesn't apply to native apps.
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // USDA FoodData Central API Proxy
  app.use(
    '/api/usda',
    createProxyMiddleware({
      target: 'https://api.nal.usda.gov/fdc/v1',
      changeOrigin: true,
      pathRewrite: {
        '^/api/usda': '', // Remove /api/usda prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[USDA Proxy]', req.method, req.path);
      },
      onError: (err, req, res) => {
        console.error('[USDA Proxy Error]', err.message);
      },
    })
  );

  // Open Food Facts API Proxy
  app.use(
    '/api/openfoodfacts',
    createProxyMiddleware({
      target: 'https://world.openfoodfacts.org/api/v2',
      changeOrigin: true,
      pathRewrite: {
        '^/api/openfoodfacts': '', // Remove /api/openfoodfacts prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Open Food Facts Proxy]', req.method, req.path);
      },
      onError: (err, req, res) => {
        console.error('[Open Food Facts Proxy Error]', err.message);
      },
    })
  );
};
