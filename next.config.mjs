/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: [
      'hmvhvhxmpalspxlfwyyw.supabase.co', // Add your Supabase project URL
      'localhost',
      
      'images.unsplash.com'  // Optional: if you're using placeholder images
      
    ],
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    }
};

export default nextConfig;
