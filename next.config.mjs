/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 启用压缩和优化
  compress: true,
  swcMinify: true, // 启用SWC压缩以减小包体积
  
  // 优化热更新配置
  reactStrictMode: true,
  onDemandEntries: {
    // 页面在内存中保持的时间（毫秒）
    maxInactiveAge: 60 * 1000,
    // 同时保持在内存中的页面数量
    pagesBufferLength: 5,
  },
  
  // 性能优化
  poweredByHeader: false,
  generateEtags: true,
  // 优化缓存和跨域配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // 静态资源缓存（1年）
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|gif|svg|ico|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JS/CSS缓存（1年，immutable）
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Webpack config for Spline
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;

