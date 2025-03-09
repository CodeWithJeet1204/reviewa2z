import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig, defaultMetadata } from '@/config/seo';

interface RootLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
}

export default function RootLayout({
  children,
  title,
  description = defaultMetadata.description,
  image = siteConfig.ogImage,
  type = 'website',
  schema,
}: RootLayoutProps) {
  const pageTitle = title 
    ? `${title} | ${siteConfig.name}`
    : defaultMetadata.title.default;

  const fullUrl = typeof window !== 'undefined' ? window.location.href : siteConfig.url;

  // Base organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.organization.logo,
    },
    sameAs: siteConfig.organization.sameAs,
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };

  // Webpage schema
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${fullUrl}#webpage`,
    url: fullUrl,
    name: pageTitle,
    description: description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    inLanguage: "en-US",
    potentialAction: [
      {
        "@type": "ReadAction",
        target: [fullUrl],
      },
    ],
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={defaultMetadata.keywords.join(', ')} />
        <link rel="canonical" href={fullUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteConfig.twitter.site} />
        <meta name="twitter:creator" content={siteConfig.twitter.creator} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Verification */}
        <meta name="google-site-verification" content={siteConfig.verification.google} />
        <meta name="msvalidate.01" content={siteConfig.verification.bing} />

        {/* PWA */}
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content={siteConfig.themeColor} />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webpageSchema)}
        </script>
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}

        {/* Additional Meta Tags */}
        <meta name="author" content={siteConfig.authors[0].name} />
        <meta name="publisher" content={siteConfig.publisher} />
        <meta name="copyright" content={`© ${new Date().getFullYear()} ${siteConfig.name}`} />
      </Helmet>

      {children}
    </>
  );
} 