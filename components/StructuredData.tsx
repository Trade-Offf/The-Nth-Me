/**
 * JSON-LD 结构化数据组件
 * 用于 GEO (Generative Engine Optimization) - 帮助 AI 搜索引擎理解内容
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({
  name = '无限图界 Nthme',
  url = 'https://www.nthme.org',
  logo = 'https://www.nthme.org/logo.svg',
  description = '超级图片工具箱，集成AI算力与传统算法。提供AI图片生成、格式转换、视频处理等20+专业工具。',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/TradeOfff_2025',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Chinese', 'English'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SoftwareAppSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}

export function SoftwareAppSchema({
  name = '无限图界 Nthme',
  description = '超级图片工具箱：AI创作+格式转换+视频处理，20+专业工具。AI工坊提供双模型图片生成，格式工厂提供7大免费转换工具，纯前端处理保护隐私。',
  url = 'https://www.nthme.org',
  applicationCategory = 'MultimediaApplication',
  operatingSystem = 'Web',
}: SoftwareAppSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    browserRequirements: 'Requires JavaScript. Modern browser recommended.',
    softwareVersion: '2.0.4',
    releaseNotes: 'AI工坊支持双模型，格式工厂新增7大转换工具',
    featureList: [
      'AI图片生成（文生图、图生图）',
      '12种预设风格',
      'WebP/HEIC/JPEG格式转换',
      'PDF与图片互转',
      '视频转GIF',
      'ICO图标生成',
      '纯前端处理',
    ],
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
        name: '格式工厂',
        description: '免费使用，无需登录',
      },
      {
        '@type': 'Offer',
        price: '19.9',
        priceCurrency: 'CNY',
        name: 'AI工坊积分',
        description: 'Standard 3积分/张，Pro 10积分/张，按需付费',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function WebPageSchema({ name, description, url }: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: ['zh-CN', 'en-US'],
    isPartOf: {
      '@type': 'WebSite',
      name: '无限图界 Nthme',
      url: 'https://www.nthme.org',
      description: '超级图片工具箱',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.nthme.org/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

