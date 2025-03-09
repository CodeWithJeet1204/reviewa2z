import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  brand?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  price: {
    amount: number;
    currency: string;
  };
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  rating?: {
    value: number;
    count: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
  category?: string;
  features?: string[];
  color?: string;
  material?: string;
  weight?: {
    value: number;
    unit: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export default function ProductSchema({
  name,
  description,
  images,
  brand,
  sku,
  gtin,
  mpn,
  price,
  availability,
  condition = 'NewCondition',
  rating,
  reviews,
  category,
  features,
  color,
  material,
  weight,
  dimensions,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    ...(brand && {
      brand: {
        "@type": "Brand",
        name: brand
      }
    }),
    ...(sku && { sku }),
    ...(gtin && { gtin13: gtin }),
    ...(mpn && { mpn }),
    offers: {
      "@type": "Offer",
      price: price.amount,
      priceCurrency: price.currency,
      availability: `https://schema.org/${availability}`,
      itemCondition: `https://schema.org/${condition}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.value,
        reviewCount: rating.count,
        bestRating: 5,
        worstRating: 1,
      }
    }),
    ...(reviews && {
      review: reviews.map(review => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.text,
        datePublished: review.date
      }))
    }),
    ...(category && { category }),
    ...(features && { additionalProperty: features.map(feature => ({
      "@type": "PropertyValue",
      name: "Feature",
      value: feature
    }))}),
    ...(color && { color }),
    ...(material && { material }),
    ...(weight && {
      weight: {
        "@type": "QuantitativeValue",
        value: weight.value,
        unitCode: weight.unit
      }
    }),
    ...(dimensions && {
      height: {
        "@type": "QuantitativeValue",
        value: dimensions.height,
        unitCode: dimensions.unit
      },
      width: {
        "@type": "QuantitativeValue",
        value: dimensions.width,
        unitCode: dimensions.unit
      },
      depth: {
        "@type": "QuantitativeValue",
        value: dimensions.length,
        unitCode: dimensions.unit
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
} 