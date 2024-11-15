/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gdxxyfiodvmrnonepzls.supabase.co', // Add this hostname
        port: '', // Optional if there's a port specified
        pathname: '/storage/v1/object/public/ProductImages/**', // Use the correct path structure
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
