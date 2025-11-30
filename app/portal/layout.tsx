import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Portrait Generator | AI 肖像生成器',
  description:
    'Create stunning AI-generated portraits from your photos. Upload an image and let AI transform it into unique artistic styles. 上传照片，让 AI 将其转化为独特的艺术风格。',
  keywords: [
    'AI portrait generator',
    'photo to AI art',
    'AI image creator',
    'portrait transformation',
    'AI照片生成',
    'AI肖像生成器',
    '照片转AI艺术',
  ],
  openGraph: {
    title: 'AI Portrait Generator | AI 肖像生成器',
    description:
      'Create stunning AI-generated portraits from your photos.',
    url: 'https://www.nthme.org/portal',
  },
  alternates: {
    canonical: 'https://www.nthme.org/portal',
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

