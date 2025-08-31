/** @type {import('next').NextConfig} */
const nextConfig = {
    // Production optimizations
    output: 'standalone',

    // Performance optimizations
    compress: true,

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                ],
            },
        ];
    },

    // Environment variables are automatically loaded by Next.js from .env files
    // No need to explicitly define them here as Next.js handles NEXT_PUBLIC_ vars automatically
};

export default nextConfig;
