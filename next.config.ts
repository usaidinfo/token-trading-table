/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig