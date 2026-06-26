/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Add your external image sources here. Example:
      // { protocol: "https", hostname: "**.convex.cloud" },
    ],
  },
};

// To enable internationalization (next-intl):
// const createNextIntlPlugin = require('next-intl/plugin');
// const withNextIntl = createNextIntlPlugin();
// module.exports = withNextIntl(nextConfig);

module.exports = nextConfig;
