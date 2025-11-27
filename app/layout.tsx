import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "第 N 个我 - 遇见你的第 N 种人生",
  description: "上传一张照片，AI 带你穿越平行宇宙，解锁无限分身。",
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

