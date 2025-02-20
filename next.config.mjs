/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      formats: ['image/avif', 'image/webp', 'image/png', 'image/jpeg'], // Allow both PNG & JPG
      unoptimized: true, // Bypass Next.js image optimization
    },
  };
  
  export default nextConfig;
  