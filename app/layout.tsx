import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { I18nProvider } from "@/lib/i18n";
import { OrganizationSchema, SoftwareAppSchema } from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = "https://www.nthme.org";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Nth Me - AI Portrait Generator | 第 N 个我",
    template: "%s | The Nth Me",
  },
  description:
    "Transform your photos into stunning AI-generated portraits. Explore infinite parallel universe versions of yourself with our advanced AI technology. 上传一张照片，AI 带你穿越平行宇宙，解锁无限分身。",
  keywords: [
    "AI portrait",
    "AI photo generator",
    "portrait AI",
    "AI image generator",
    "photo transformation",
    "AI selfie",
    "parallel universe",
    "AI art",
    "AI photo fix",
    "AI image repair",
    "AI enhancement",
    "第N个我",
    "AI换脸",
    "AI写真",
    "AI肖像",
    "AI图片生成",
    "AI照片修复",
    "AI图像修复",
    "AI画质增强",
    "AI人像生成",
  ],
  authors: [{ name: "The Nth Me Team" }],
  creator: "The Nth Me",
  publisher: "The Nth Me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "The Nth Me",
    title: "The Nth Me - AI Portrait Generator | 第 N 个我",
    description:
      "上传一张照片，AI 带你穿越平行宇宙，解锁无限分身。Transform your photos into stunning AI-generated portraits.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        secureUrl: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "The Nth Me - AI Portrait Generator | 第 N 个我",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TradeOfff_2025",
    creator: "@TradeOfff_2025",
    title: "The Nth Me - AI Portrait Generator | 第 N 个我",
    description:
      "上传一张照片，AI 带你穿越平行宇宙，解锁无限分身。",
    images: {
      url: `${BASE_URL}/og-image.png`,
      alt: "The Nth Me - AI Portrait Generator",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-gb-web@latest/style.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
        />
        {/* 微信分享优化 - 确保完整 URL */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* JSON-LD 结构化数据 */}
        <OrganizationSchema />
        <SoftwareAppSchema />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

