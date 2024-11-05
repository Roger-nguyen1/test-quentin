// next.config.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/Products",
        destination: "https://cloud.qmartinez.com/api/Products",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/Products",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};
