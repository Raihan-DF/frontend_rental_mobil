
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Opsional, untuk mengaktifkan mode ketat React
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async rewrites() {
    return [
      {
        /**
         * http://localhost:3000/api/auth/register
         * http://localhost:3000/api/auth/login
         * 
         * /auth/register
         * 
         * http://localhost:3003/auth/register
         * http://localhost:3003/auth/login
         */
        source: '/api/:path*', // Route untuk memproksikan ke server backend
        destination: 'http://localhost:3003/:path*', // Proxy ke server backend
      },
    ];
  },
};

export default nextConfig;
