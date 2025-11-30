import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | 价格方案',
  description:
    'Affordable AI portrait generation credits. Pay-as-you-go pricing with no subscription required. 实惠的 AI 肖像生成积分，按需付费，无需订阅。',
  keywords: [
    'AI portrait pricing',
    'AI art credits',
    'portrait generator cost',
    'AI image price',
    'AI写真价格',
    'AI肖像积分',
    '按需付费',
  ],
  openGraph: {
    title: 'Pricing | 价格方案',
    description:
      'Affordable AI portrait generation credits. Pay-as-you-go pricing.',
    url: 'https://www.nthme.org/pricing',
  },
  alternates: {
    canonical: 'https://www.nthme.org/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

