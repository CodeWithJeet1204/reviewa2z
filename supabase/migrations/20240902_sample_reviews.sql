
-- Add sample reviews
INSERT INTO reviews (title, slug, category_id, image_url, rating, brief, content, pros, cons, specs, tags, is_featured)
VALUES
(
  'iPhone 15 Pro',
  'iphone-15-pro',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.unsplash.com/photo-1696258686286-3b6c764baec5?q=80&w=1920&auto=format&fit=crop',
  4.8,
  'The iPhone 15 Pro represents the pinnacle of Apple''s smartphone technology with its exceptional performance, stunning display, and powerful camera system.',
  'The iPhone 15 Pro continues Apple''s tradition of excellence with its sleek titanium design and the powerful A17 Pro chip. The device boasts an impressive 48MP main camera with advanced computational photography capabilities, delivering exceptional shots in virtually any lighting condition. 

The ProMotion display offers vivid colors and smooth scrolling with its 120Hz refresh rate, while the new USB-C port finally brings universal charging compatibility to the iPhone lineup. 

Battery life is impressive, easily lasting a full day of heavy use, and the iOS 17 software experience remains as polished and intuitive as ever. While the price point remains premium, the iPhone 15 Pro delivers a comprehensive flagship experience that justifies its position at the top of the smartphone market.',
  '[
    "Durable titanium construction",
    "Exceptional camera system",
    "Industry-leading performance",
    "Beautiful ProMotion display",
    "All-day battery life"
  ]',
  '[
    "Premium price tag",
    "Charging speed could be faster",
    "No dramatic design changes from predecessor"
  ]',
  '{
    "Processor": "A17 Pro",
    "Display": "6.1-inch Super Retina XDR",
    "Camera": "48MP main, 12MP ultrawide, 12MP telephoto",
    "RAM": "8GB",
    "Storage": "128GB, 256GB, 512GB, 1TB",
    "Battery": "3,274 mAh"
  }',
  ARRAY['apple', 'iphone', 'smartphone', 'flagship'],
  true
),
(
  'Sony WH-1000XM5 Wireless Headphones',
  'sony-wh-1000xm5-wireless-headphones',
  (SELECT id FROM categories WHERE slug = 'audio'),
  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1920&auto=format&fit=crop',
  4.7,
  'The Sony WH-1000XM5 raises the bar for noise-canceling headphones with their superior sound quality, industry-leading ANC, and exceptional comfort for long listening sessions.',
  'The Sony WH-1000XM5 represents a significant evolution in Sony''s flagship headphone lineup. With a completely redesigned body that's lighter and more comfortable than its predecessors, these headphones are perfect for extended listening sessions. The noise-cancellation technology has been improved with eight microphones and two processors working in tandem to block out more ambient noise than ever before.

Sound quality is outstanding with rich, detailed audio reproduction across all frequencies. The new 30mm carbon fiber drivers deliver punchy bass, clear mids, and detailed highs without distortion, even at higher volumes. The LDAC codec support ensures high-resolution audio when paired with compatible devices.

Battery life remains excellent at around 30 hours with ANC enabled, and quick-charging provides 3 hours of playback from just a 3-minute charge. The touch controls are intuitive, and the speak-to-chat feature automatically pauses music when you start talking.

While the $399 price tag is premium, the Sony WH-1000XM5 offers an unmatched combination of audio quality, noise cancellation, and comfort that justifies the investment for discerning listeners.',
  '[
    "Best-in-class noise cancellation",
    "Exceptional sound quality",
    "Comfortable for long sessions",
    "Excellent battery life",
    "Improved call quality"
  ]',
  '[
    "More expensive than previous model",
    "No longer foldable for compact storage",
    "Limited color options"
  ]',
  '{
    "Driver": "30mm carbon fiber",
    "Battery Life": "30 hours (with ANC)",
    "Charging": "USB-C",
    "Bluetooth": "5.2",
    "Weight": "250g",
    "Codecs": "SBC, AAC, LDAC"
  }',
  ARRAY['headphones', 'wireless', 'noise-cancelling', 'premium'],
  true
);
