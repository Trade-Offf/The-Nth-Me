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
    default: "无限图界 Nthme - 聚合N种黑科技，搞定图片一切需求",
    template: "%s | 无限图界 Nthme",
  },
  description:
    "无限图界(Nthme)是超级图片工具箱，集成AI算力与传统算法。提供AI图片生成、格式转换(WebP/HEIC/JPEG/PDF)、视频转GIF等20+专业工具。纯前端处理，保护隐私，无需登录即可使用格式工厂。",
  keywords: [
    // AI功能关键词
    "AI图片生成",
    "AI工坊",
    "AI图像生成器",
    "文生图",
    "图生图",
    "AI创作",
    "AI写真",
    "AI肖像",
    "Stable Diffusion",
    // 格式转换关键词
    "图片格式转换",
    "WebP转换",
    "HEIC转换",
    "JPEG压缩",
    "PDF转图片",
    "图片转PDF",
    "视频转GIF",
    "ICO生成",
    "Live Photo转换",
    "格式工厂",
    // 工具箱关键词
    "图片工具箱",
    "在线图片处理",
    "免费图片工具",
    "纯前端处理",
    "无需登录",
    "隐私安全",
    // 品牌关键词
    "无限图界",
    "Nthme",
    "Nth Me",
  ],
  authors: [{ name: "无限图界团队" }],
  creator: "无限图界 Nthme",
  publisher: "无限图界 Nthme",
  applicationName: "无限图界",
  category: "Productivity",
  classification: "Image Processing & AI Generation Tools",
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
    siteName: "无限图界 Nthme",
    title: "无限图界 - 聚合N种黑科技，搞定图片一切需求",
    description:
      "超级图片工具箱，集成AI创作、格式转换、视频处理等20+专业工具。AI工坊支持双模型图片生成，格式工厂提供7大免费转换工具，纯前端处理保护隐私。",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        secureUrl: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "无限图界 Nthme - 超级图片工具箱",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TradeOfff_2025",
    creator: "@TradeOfff_2025",
    title: "无限图界 - 聚合N种黑科技，搞定图片一切需求",
    description:
      "超级图片工具箱：AI创作+格式转换+视频处理，20+专业工具，免费使用，纯前端处理保护隐私。",
    images: {
      url: `${BASE_URL}/og-image.png`,
      alt: "无限图界 Nthme - 超级图片工具箱",
    },
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "zh-CN": BASE_URL,
      "en-US": `${BASE_URL}?lang=en-US`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
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

