import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**', // Cho phép tất cả các đường dẫn dưới domain này
            },
        ],
    },
};

export default nextConfig;
