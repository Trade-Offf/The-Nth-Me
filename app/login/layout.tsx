import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | 登录',
  description:
    'Sign in to The Nth Me to start creating AI-generated portraits. 登录开始创建 AI 肖像。',
  openGraph: {
    title: 'Login | 登录',
    description: 'Sign in to The Nth Me.',
    url: 'https://www.nthme.org/login',
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.nthme.org/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

