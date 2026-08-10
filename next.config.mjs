/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  turbopack: {}, // Suppress Turbopack warning as suggested since we don't necessarily need custom turbopack loaders for the ignore-loader behavior in most recent next.js
  // Exclude test files from build
  webpack(config) {
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
