import type { Metadata } from 'next';

const BASE_URL = 'https://www.nthme.org';

export const metadata: Metadata = {
  title: '格式工厂 - 免费在线图片格式转换工具',
  description:
    '纯前端图片格式处理工具集，无需登录免费使用。支持WebP/HEIC/JPEG转换、PDF与图片互转、视频转GIF、ICO生成。所有处理在浏览器本地完成，保护您的隐私安全。',
  keywords: [
    '图片格式转换',
    '免费图片工具',
    'WebP转换器',
    'HEIC转JPG',
    'JPEG压缩',
    'PDF转图片',
    '图片转PDF',
    '视频转GIF',
    'ICO生成器',
    'Live Photo转换',
    '在线图片处理',
    '纯前端处理',
    '无需上传',
    '隐私安全',
    '格式工厂',
  ],
  openGraph: {
    title: '格式工厂 - 免费在线图片格式转换工具',
    description:
      '7大免费转换工具：WebP、HEIC、JPEG、PDF、GIF、ICO。纯前端处理，无需登录，保护隐私。',
    url: `${BASE_URL}/formats`,
    siteName: '无限图界 Nthme',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '格式工厂 - 免费图片格式转换',
      },
    ],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '格式工厂 - 免费在线图片格式转换',
    description: '7大免费转换工具，纯前端处理，无需登录，保护隐私。',
  },
  alternates: {
    canonical: `${BASE_URL}/formats`,
  },
};

export default function FormatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

