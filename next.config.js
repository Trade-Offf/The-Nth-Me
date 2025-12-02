/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // 启用压缩
  compress: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    // 如果有外部图片域名，在这里添加
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 实验性优化
  experimental: {
    // 优化包导入（自动 tree-shake）
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },

  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 客户端打包优化
    if (!isServer) {
      // 确保动态导入的模块完全分离
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        minSize: 20000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Three.js 完全独立打包，不进入共享 chunk
          three: {
            test: /[\\/]node_modules[\\/](three)[\\/]/,
            name: 'three-vendor',
            chunks: 'async', // 关键：只在异步加载时打包
            priority: 50,
            enforce: true,
            reuseExistingChunk: true,
          },
          reactThree: {
            test: /[\\/]node_modules[\\/](@react-three)[\\/]/,
            name: 'react-three-vendor',
            chunks: 'async',
            priority: 50,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Framer Motion 优化
          framer: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'framer-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);

