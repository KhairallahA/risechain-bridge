/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
    }
};

export default nextConfig;
