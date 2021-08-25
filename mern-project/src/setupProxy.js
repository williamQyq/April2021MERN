const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(proxy('/api/items', { target: `http://localhost:${process.env.PORT || 5000}/`}));
};