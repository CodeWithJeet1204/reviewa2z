export const siteConfig = {
  name: 'ReviewA2Z',
  description: 'AI-Powered Product Reviews and Comparisons - Get unbiased, in-depth analysis of products before making your purchase decision.',
  url: 'https://reviewa2z.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/reviewa2z',
    github: 'https://github.com/reviewa2z',
  },
  keywords: [
    'product reviews',
    'AI reviews',
    'unbiased reviews',
    'product comparisons',
    'smart shopping',
    'product analysis',
    'buying guide',
    'tech reviews',
    'consumer reviews',
    'trusted reviews'
  ],
  authors: [
    {
      name: 'ReviewA2Z Team',
      url: 'https://reviewa2z.com/about',
      email: 'team@reviewa2z.com'
    }
  ],
  creator: 'ReviewA2Z',
  themeColor: '#000000',
  publisher: 'ReviewA2Z Inc.',
  alternates: {
    canonical: 'https://reviewa2z.com',
    languages: {
      'en-US': 'https://reviewa2z.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ReviewA2Z',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@reviewa2z',
    creator: '@reviewa2z',
  },
  verification: {
    google: 'your-google-verification-code',
    bing: 'your-bing-verification-code',
  },
  organization: {
    name: 'ReviewA2Z',
    logo: 'https://reviewa2z.com/logo.png',
    sameAs: [
      'https://twitter.com/reviewa2z',
      'https://facebook.com/reviewa2z',
      'https://linkedin.com/company/reviewa2z',
    ],
  },
};

export const defaultMetadata = {
  metadataBase: new URL('https://reviewa2z.com'),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  themeColor: siteConfig.themeColor,
  alternates: siteConfig.alternates,
  openGraph: {
    ...siteConfig.openGraph,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    ...siteConfig.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}; 