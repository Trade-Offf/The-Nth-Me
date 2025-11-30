import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.nthme.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/user/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

