import type { Metadata } from 'next';

const BASE_URL = 'https://www.nthme.org';

export const metadata: Metadata = {
  title: 'AI工坊 - 双模型AI图片生成器',
  description:
    'AI工坊提供Standard和Pro双模型AI图片生成服务。支持文生图、图生图，12种预设风格一键应用。多种尺寸比例自由选择，2.5秒快速出图。AI创作从未如此简单。',
  keywords: [
    'AI图片生成',
    'AI工坊',
    '文生图',
    '图生图',
    'AI创作',
    'AI写真',
    'AI肖像生成',
    'Stable Diffusion',
    'AI图像生成器',
    '双模型AI',
    'Standard模型',
    'Pro模型',
    '预设风格',
    '图片生成器',
    'AI art generator',
  ],
  openGraph: {
    title: 'AI工坊 - 双模型AI图片生成器',
    description:
      'Standard快速出图，Pro高清细节。12种预设风格，支持文生图与图生图，多种尺寸自由选择。',
    url: `${BASE_URL}/portal`,
    siteName: '无限图界 Nthme',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AI工坊 - 双模型AI图片生成',
      },
    ],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI工坊 - 双模型AI图片生成器',
    description: 'Standard快速出图，Pro高清细节。12种预设风格，2.5秒快速生成。',
  },
  alternates: {
    canonical: `${BASE_URL}/portal`,
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

