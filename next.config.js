/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      }
    ]
  },
  experimental: {
    // Enable more aggressive prefetching
    optimisticClientCache: true
  }
}

module.exports = nextConfig
