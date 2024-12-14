/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Enable static exports for improved performance
  output: 'standalone',
};

module.exports = nextConfig;
