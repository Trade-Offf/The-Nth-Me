"use client";

import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BinaryRain from "@/components/BinaryRain";
import { useI18n } from "@/lib/i18n";

const Hero3DCanvas = dynamic(() => import("../components/Hero3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-tech-bg">
      <div className="font-mono text-acid text-sm">
        [<span className="animate-pulse">CALIBRATING</span>]
      </div>
    </div>
  ),
});

const heroContent = {
  "zh-CN": {
    sysStatus: "工具库在线",
    sysVersion: "v2.0.4",
    title: "聚合 N 种黑科技",
    subtitle_gradient: "搞定图片一切需求",
    description:
      "从 AI 智能创作到格式批量转换，打造一站式影像处理解决方案。深度集成 AI 算力引擎与高性能传统算法，20+ 专业工具覆盖图片全生命周期。支持双模型 AI 生成、多种格式转换，纯前端处理确保数据隐私安全。",
    btn_generate: "开始使用",
    btn_primary: "浏览工具库",
    btn_secondary: "购买算力 ⚡",
    stats: {
      latency: "响应速度",
      styles: "工具数量",
    },
    featuresTitle: "核心功能",
    featuresSubtitle: "三大工具矩阵，覆盖图片全生命周期",
    features: [
      {
        id: "ai-lab",
        title: "AI 工坊",
        subtitle: "AI-POWERED CREATION",
        description:
          "搭载双模型 AI 图片生成引擎，Standard 模型极速出图满足日常需求，Pro 模型提供高清细节专业品质。内置 12 种精选风格模板，涵盖人像写真、商业摄影、艺术创作等场景。支持文生图与图生图双模式，提供多种宽高比和分辨率选择，满足不同平台发布需求。每次生成消耗对应算力，按需使用经济实惠。",
        highlights: [
          "Standard / Pro 双模型",
          "12 种预设风格",
          "多尺寸输出",
          "文生图 / 图生图",
        ],
        link: "/portal",
        linkText: "进入工坊",
      },
      {
        id: "format-factory",
        title: "格式工厂",
        subtitle: "CLIENT-SIDE PROCESSING",
        description:
          "纯前端图片格式处理工具矩阵，所有操作在浏览器本地完成，零上传保护隐私安全。包含 WebP 双向转换、JPEG 极限压缩、Live Photo 转换（支持 HEIC 静态图与 MOV 视频选帧）、PDF 与图片互转、视频转 GIF 动图、ICO 图标生成、图片去水印等多种实用工具。支持批量处理，实时预览，一键下载。无需登录即可使用全部功能。",
        highlights: ["多种转换工具", "纯前端处理", "批量操作", "无需登录"],
        link: "/formats",
        linkText: "打开工厂",
      },
      {
        id: "credit-shop",
        title: "算力商城",
        subtitle: "FLEXIBLE PRICING",
        description:
          "灵活的算力积分充值系统，支持按需购买避免浪费。提供入门包、进阶包、专业包、旗舰包等多档位选择，满足不同使用需求。积分永久有效随时使用，充值即时到账。可用于 AI 图片生成，Standard 模型 2 算力/次，Pro 模型 8 算力/次，经济实惠按需消费。",
        highlights: ["多档位选择", "永久有效", "即充即用", "按需消费"],
        link: "/pricing",
        linkText: "查看价格",
      },
    ],
  },
  "en-US": {
    sysStatus: "TOOLBOX ONLINE",
    sysVersion: "v2.0.4",
    title: "AGGREGATE N BLACK-TECHS",
    subtitle_gradient: "HANDLE ALL IMAGE NEEDS",
    description:
      "The Ultimate Image Processing Solution. From AI-powered creation to batch format conversion, covering the complete image lifecycle. Deep integration of AI engines and high-performance algorithms. 20+ professional tools with dual-model AI generation, various converters, and client-side processing for maximum privacy.",
    btn_generate: "START NOW",
    btn_primary: "BROWSE TOOLS",
    btn_secondary: "BUY CREDITS ⚡",
    stats: {
      latency: "RESPONSE TIME",
      styles: "TOOLS AVAILABLE",
    },
    featuresTitle: "CORE FEATURES",
    featuresSubtitle: "Three toolsets covering the complete image lifecycle",
    features: [
      {
        id: "ai-lab",
        title: "AI Lab",
        subtitle: "AI-POWERED CREATION",
        description:
          "Powered by dual-model AI image generation engine. Standard model delivers lightning-fast results for everyday needs, while Pro model provides HD quality for professional work. Built-in 12 curated style templates covering portraits, commercial photography, and artistic creation. Supports both text-to-image and image-to-image modes. Offers multiple aspect ratios and resolutions for various platform requirements. Credits consumed per generation, cost-effective pay-as-you-go.",
        highlights: [
          "Standard / Pro Models",
          "12 Preset Styles",
          "Multi-size Output",
          "Text & Image Input",
        ],
        link: "/portal",
        linkText: "Enter Lab",
      },
      {
        id: "format-factory",
        title: "Format Factory",
        subtitle: "CLIENT-SIDE PROCESSING",
        description:
          "Client-side image processing toolkit, all operations performed locally in browser for maximum privacy. Includes WebP bidirectional conversion, JPEG extreme compression, Live Photo converter (supports HEIC static images and MOV video frame extraction), PDF↔Image conversion, Video to GIF, ICO generator, watermark remover and more practical tools. Supports batch processing, real-time preview, one-click download. No login required for full access.",
        highlights: [
          "Multiple Converters",
          "Client-side Processing",
          "Batch Operations",
          "No Login",
        ],
        link: "/formats",
        linkText: "Open Factory",
      },
      {
        id: "credit-shop",
        title: "Credit Shop",
        subtitle: "FLEXIBLE PRICING",
        description:
          "Flexible credit system with pay-as-you-go pricing to avoid waste. Choose from Starter, Advanced, Professional, or Flagship packages to match your needs. Credits never expire and can be used anytime. Instant activation upon purchase. Use credits for AI generation: Standard model 2 credits/image, Pro model 8 credits/image. Cost-effective and economical.",
        highlights: [
          "Multiple Tiers",
          "Never Expire",
          "Instant Use",
          "Pay-as-you-go",
        ],
        link: "/pricing",
        linkText: "View Pricing",
      },
    ],
  },
} as const;

export default function HomePage() {
  const { lang } = useI18n();
  const hero = heroContent[lang];

  return (
    <main className="min-h-screen bg-tech-bg text-white relative flex flex-col">
      {/* 二进制雨背景 */}
      <BinaryRain />

      {/* 网格背景 */}
      <div className="fixed inset-0 tech-grid-bg opacity-50" />

      {/* 导航栏 */}
      <Navbar />

      {/* Hero 区域 */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            {/* 左侧文案 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 p-8 lg:p-10 border border-tech-border/30 rounded-sm bg-gradient-to-br from-tech-card/10 to-transparent backdrop-blur-sm"
            >
              {/* 系统状态栏 */}
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-acid/30 rounded-sm bg-acid/5">
                  <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                  <span className="font-mono text-xs text-acid uppercase tracking-[0.15em]">
                    {hero.sysStatus}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                  SYS_{hero.sysVersion}
                </span>
              </div>

              <div className="space-y-4">
                {/* 主标题 - 英文时缩小 */}
                <h1
                  className={`font-bold text-white uppercase tracking-wide leading-tight ${
                    lang === "en-US"
                      ? "text-2xl sm:text-3xl lg:text-4xl"
                      : "text-3xl sm:text-4xl lg:text-5xl"
                  }`}
                >
                  {hero.title}
                </h1>

                {/* 副标题 - 酸性绿下划线效果 - 英文时缩小 */}
                <div className="relative inline-block">
                  <p
                    className={`font-bold text-acid uppercase tracking-wide leading-tight ${
                      lang === "en-US"
                        ? "text-lg sm:text-xl lg:text-2xl"
                        : "text-xl sm:text-2xl lg:text-3xl"
                    }`}
                  >
                    {hero.subtitle_gradient}
                  </p>
                  <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-acid via-acid/50 to-transparent" />
                </div>
              </div>

              {/* 分隔线 */}
              <div className="w-full h-px bg-gradient-to-r from-tech-border via-acid/20 to-transparent" />

              {/* 描述文字 - 增强视觉层次 */}
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
                  {hero.description}
                </p>

                {/* 特性标签 */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-acid/5 border border-acid/20 rounded-sm">
                    <span className="w-1 h-1 rounded-full bg-acid" />
                    <span className="font-mono text-[10px] text-acid uppercase tracking-wider">
                      AI_POWERED
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-tech-panel border border-tech-border rounded-sm">
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      CLIENT_SIDE
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-tech-panel border border-tech-border rounded-sm">
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      PRIVACY_FIRST
                    </span>
                  </span>
                </div>
              </div>

              {/* 按钮组 */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                {/* AI工坊按钮 - 主要 CTA */}
                <Link
                  href="/portal"
                  className="group inline-flex items-center justify-center px-6 py-3 rounded-sm bg-acid text-black font-mono text-xs uppercase tracking-[0.15em] font-medium hover:bg-transparent hover:text-acid border border-acid transition-all duration-200"
                >
                  {hero.features[0].title}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                {/* 格式工厂按钮 - 描边 */}
                <Link
                  href="/formats"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-sm border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-[0.15em] hover:border-acid hover:text-acid transition-colors duration-200"
                >
                  {hero.features[1].title}
                </Link>

                {/* 算力商城按钮 - 描边 */}
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-sm border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-[0.15em] hover:border-acid hover:text-acid transition-colors duration-200"
                >
                  {hero.features[2].title}
                </Link>
              </div>

              {/* 技术指标 */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-tech-border">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                    {hero.stats.latency}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl text-acid">
                    ~2.5s
                  </p>
                  <div className="w-12 h-px bg-acid/50" />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                    {hero.stats.styles}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl text-acid">20+</p>
                  <div className="w-12 h-px bg-acid/50" />
                </div>
              </div>
            </motion.div>

            {/* 右侧 3D 机器人 - 移动端隐藏或缩小 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] hidden sm:block"
            >
              {/* 边框容器 */}
              <div className="relative h-full border border-tech-border rounded-sm overflow-hidden bg-tech-card/50">
                {/* 顶部角标 */}
                <span className="absolute top-2 left-3 font-mono text-[10px] text-zinc-600 uppercase tracking-wider z-10">
                  [TOOLBOX_PREVIEW]
                </span>
                <span className="absolute top-2 right-3 font-mono text-[10px] text-acid/50 uppercase tracking-wider z-10">
                  LAT: 40.22
                </span>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="font-mono text-acid text-sm">
                        [<span className="animate-pulse">CALIBRATING</span>]
                      </div>
                    </div>
                  }
                >
                  <Hero3DCanvas />
                </Suspense>
                {/* 底部状态栏 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-tech-bg/80 border-t border-tech-border flex items-center px-3 justify-between z-10">
                  <span className="font-mono text-[10px] text-zinc-600 tracking-wider">
                    RENDER_ENGINE: ACTIVE
                  </span>
                  <span className="font-mono text-[10px] text-acid animate-pulse">
                    ● SIGNAL_STABLE
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 功能介绍区域 */}
      <section className="relative w-full py-20 lg:py-32 border-t border-tech-border">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* 区域标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-[0.2em] mb-3">
              {`// FUNCTIONAL_MODULES`}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase mb-3">
              {hero.featuresTitle}
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-acid to-transparent mx-auto mb-4" />
            <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
              {hero.featuresSubtitle}
            </p>
          </motion.div>

          {/* 功能卡片网格 */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {hero.features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={feature.link} className="group block h-full">
                  <div className="h-full p-6 lg:p-8 border border-tech-border rounded-sm bg-tech-card hover:border-acid/50 hover:bg-tech-card/80 transition-all duration-300">
                    {/* 编号标签 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-acid group-hover:animate-pulse" />
                        <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                          MODULE_{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="px-2 py-1 border border-tech-border rounded-sm text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:border-acid/50 transition-colors">
                        ACTIVE
                      </span>
                    </div>

                    {/* 标题 */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-acid transition-colors">
                        {feature.title}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
                        {feature.subtitle}
                      </p>
                    </div>

                    {/* 分隔线 */}
                    <div className="w-full h-px bg-gradient-to-r from-tech-border to-transparent mb-4" />

                    {/* 描述 */}
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* 亮点标签 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {feature.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-2 py-1 bg-acid/5 border border-acid/20 rounded-sm text-[10px] font-mono text-acid uppercase tracking-wider"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* 按钮 */}
                    <div className="flex items-center justify-between pt-4 border-t border-tech-border">
                      <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider group-hover:text-acid transition-colors">
                        {feature.linkText}
                      </span>
                      <span className="text-acid group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* 底部分隔线 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-tech-border to-transparent mt-16 lg:mt-20"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
