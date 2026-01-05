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
  // Disable SWC minifier to avoid download issues
  swcMinify: false,
  compiler: {
    // Use Babel instead of SWC
  },
  // 优化热更新配置
  reactStrictMode: true,
  onDemandEntries: {
    // 页面在内存中保持的时间（毫秒）
    maxInactiveAge: 60 * 1000,
    // 同时保持在内存中的页面数量
    pagesBufferLength: 5,
  },
  // Allow Spline resources
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
    ];
  },
  // Webpack config for Spline
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;

