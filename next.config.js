/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www3.animeflv.net',
        },
        {
          protocol: 'https',
          hostname: 'a.storyblok.com',
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
        },
      ],
    },
};

module.exports = nextConfig;
