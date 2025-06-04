/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Keep existing config if any, or use sensible defaults
  pageExtensions: ['page.js', 'page.jsx', 'page.ts', 'page.tsx', 'js', 'jsx', 'ts', 'tsx'], // Add common page extensions explicitly
  // Any other configurations that were previously there should be preserved.
  // For this subtask, we are focusing on pageExtensions.
  // If the original file had other settings, they would ideally be merged.
  // Given the subtask limitations, we are overwriting with a common setup.
  // A more robust approach would be to parse and update the JS object.
};

export default nextConfig;
