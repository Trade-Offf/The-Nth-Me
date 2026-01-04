import type { Metadata } from 'next';

const BASE_URL = 'https://www.nthme.org';

export const metadata: Metadata = {
  title: '算力商城 - AI图片生成积分充值',
  description:
    '灵活的AI算力积分充值系统。国内爱发电（CNY）+ 海外Paddle（USD）双通道支付。多档位选择，充值即用，按需购买。Standard模型3积分/张，Pro模型10积分/张。',
  keywords: [
    'AI积分充值',
    '算力购买',
    'AI图片生成价格',
    '爱发电充值',
    'Paddle支付',
    'AI算力',
    '按需付费',
    '无订阅',
    'AI credits',
    'AI生成积分',
    '图片生成价格',
  ],
  openGraph: {
    title: '算力商城 - AI图片生成积分充值',
    description:
      '双币种支付，多档位选择。Standard 3积分/张，Pro 10积分/张。充值即用，按需购买。',
    url: `${BASE_URL}/pricing`,
    siteName: '无限图界 Nthme',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '算力商城 - AI积分充值',
      },
    ],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '算力商城 - AI图片生成积分充值',
    description: '双币种支付，多档位选择，充值即用。',
  },
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

