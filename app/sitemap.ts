import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.nthme.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 静态页面 - 按优先级排序
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}?lang=zh-CN`,
          'en-US': `${BASE_URL}?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/portal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/portal?lang=zh-CN`,
          'en-US': `${BASE_URL}/portal?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/formats`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/formats?lang=zh-CN`,
          'en-US': `${BASE_URL}/formats?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/pricing?lang=zh-CN`,
          'en-US': `${BASE_URL}/pricing?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/user`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/generate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/result`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/terms?lang=zh-CN`,
          'en-US': `${BASE_URL}/terms?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/privacy?lang=zh-CN`,
          'en-US': `${BASE_URL}/privacy?lang=en-US`,
        },
      },
    },
    {
      url: `${BASE_URL}/refund`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          'zh-CN': `${BASE_URL}/refund?lang=zh-CN`,
          'en-US': `${BASE_URL}/refund?lang=en-US`,
        },
      },
    },
  ];

  return staticPages;
}

