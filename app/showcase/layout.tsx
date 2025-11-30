import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Portrait Showcase | 提示词画廊',
  description:
    'Browse our collection of AI-generated portrait styles. From cyberpunk to vintage, discover endless possibilities for your photos. 浏览我们的 AI 肖像风格集合，从赛博朋克到复古风格，发现无限可能。',
  keywords: [
    'AI portrait examples',
    'AI art gallery',
    'portrait styles',
    'AI photo examples',
    'prompt showcase',
    'AI写真案例',
    '提示词画廊',
    'AI肖像风格',
  ],
  openGraph: {
    title: 'AI Portrait Showcase | 提示词画廊',
    description:
      'Browse our collection of AI-generated portrait styles. Discover endless possibilities.',
    url: 'https://www.nthme.org/showcase',
  },
  alternates: {
    canonical: 'https://www.nthme.org/showcase',
  },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

