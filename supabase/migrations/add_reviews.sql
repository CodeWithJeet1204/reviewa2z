
-- Insert additional reviews
INSERT INTO reviews (title, slug, category_id, image_url, rating, brief, content, pros, cons, specs, tags, is_featured)
VALUES (
  'MacBook Pro M3',
  'macbook-pro-m3',
  (SELECT id FROM categories WHERE slug = 'laptops'),
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1920&auto=format&fit=crop',
  4.9,
  'The MacBook Pro M3 delivers exceptional performance and battery life in the same sleek design we''ve come to expect from Apple.',
  'Apple''s MacBook Pro M3 represents a significant leap in performance over its predecessors, thanks to the new M3 chip that brings substantial improvements to both CPU and GPU performance.

The laptop maintains Apple''s premium build quality with a sleek aluminum chassis, excellent keyboard, and vibrant Liquid Retina XDR display with ProMotion technology. Colors are vivid, blacks are deep, and the 120Hz refresh rate ensures smooth scrolling and animations.

Battery life is nothing short of impressive, easily lasting through a full workday of intensive tasks with plenty of power to spare. The fast charging feature is a welcome addition for users who need to quickly top up before heading out.

macOS continues to be a streamlined and intuitive operating system that takes full advantage of the M3 chip''s capabilities. The ecosystem integration with other Apple devices remains a strong selling point.

While the starting price is high, and the base model''s storage feels limited at 512GB, the MacBook Pro M3 justifies its premium position with exceptional performance, build quality, and battery life that few competitors can match.',
  '[
    "Exceptional performance with M3 chip",
    "Outstanding battery life",
    "Beautiful Liquid Retina XDR display",
    "Excellent build quality",
    "Seamless Apple ecosystem integration"
  ]',
  '[
    "Premium pricing",
    "Limited port selection",
    "Base model storage is restrictive",
    "No user-upgradeable components"
  ]',
  '{
    "Processor": "Apple M3",
    "Display": "14.2-inch Liquid Retina XDR, 120Hz",
    "RAM": "16GB unified memory",
    "Storage": "512GB SSD",
    "Battery": "Up to 18 hours",
    "Weight": "1.55 kg"
  }',
  ARRAY['apple', 'macbook', 'laptop', 'premium'],
  true
),
(
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  (SELECT id FROM categories WHERE slug = 'smartphones'),
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1920&auto=format&fit=crop',
  4.7,
  'The Samsung Galaxy S24 Ultra pushes the boundaries of smartphone technology with its AI features, exceptional camera system, and refined design.',
  'The Samsung Galaxy S24 Ultra represents the pinnacle of Android smartphones in 2024, offering cutting-edge hardware paired with innovative AI capabilities that genuinely enhance the user experience.

Design-wise, Samsung has refined the Ultra with slightly less curved edges, making it more comfortable to hold while maintaining the premium titanium and glass construction. The display is nothing short of spectacular—a 6.8-inch QHD+ Dynamic AMOLED with adaptive refresh rate from 1-120Hz that boasts exceptional brightness, even in direct sunlight.

The camera system continues to impress with its versatility and quality. The 200MP main sensor delivers stunning detail in good lighting conditions, while the 50MP 5x telephoto lens is a notable upgrade from previous generations. Samsung''s computational photography continues to improve, offering more natural colors while retaining the vibrant signature look that many users appreciate.

Performance is exceptional thanks to the latest Snapdragon 8 Gen 3 processor (or Exynos 2400 in some regions), handling everything from intensive gaming to multitasking with ease. Battery life is solid, easily lasting a full day of heavy use with the 5,000mAh capacity.

What sets the S24 Ultra apart are the Galaxy AI features, including real-time translation, advanced photo editing tools, and smart text generation that actually prove useful in day-to-day use rather than being mere gimmicks.

While the high price point and incremental design changes might deter some users from upgrading, the Galaxy S24 Ultra''s comprehensive package of premium hardware, versatile cameras, and genuinely useful AI features make it the Android phone to beat in 2024.',
  '[
    "Exceptional display quality",
    "Versatile and powerful camera system",
    "Useful AI features",
    "Premium build quality",
    "S Pen functionality"
  ]',
  '[
    "Very expensive",
    "Large and heavy",
    "45W charging is slower than competitors",
    "Incremental upgrade from S23 Ultra"
  ]',
  '{
    "Processor": "Snapdragon 8 Gen 3",
    "Display": "6.8-inch QHD+ Dynamic AMOLED 2X",
    "RAM": "12GB",
    "Storage": "256GB, 512GB, 1TB",
    "Main Camera": "200MP",
    "Battery": "5,000mAh"
  }',
  ARRAY['samsung', 'galaxy', 'smartphone', 'android', 'flagship'],
  true
),
(
  'Apple AirPods Pro 2',
  'airpods-pro-2',
  (SELECT id FROM categories WHERE slug = 'audio'),
  'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=1920&auto=format&fit=crop',
  4.6,
  'The AirPods Pro 2 improve on the original with better noise cancellation, audio quality, and battery life, cementing their place among the best wireless earbuds available.',
  'Apple''s second-generation AirPods Pro represent a significant improvement over their predecessors, with enhancements across nearly every aspect of the earbuds.

The active noise cancellation is substantially better, capable of reducing low-frequency noise by up to twice as much as the original model. This places them among the best in class for noise cancellation, rivaling much larger over-ear headphones in effectiveness.

Sound quality has also received a noticeable upgrade thanks to the new H2 chip and improved drivers. The audio profile is well-balanced with rich, detailed mids, crisp highs, and tighter bass response. Spatial audio with dynamic head tracking continues to be one of the most convincing implementations of 3D audio in wireless earbuds.

Battery life has improved to around 6 hours per charge with ANC enabled, with the case providing an additional 30 hours. The charging case now includes a speaker for Find My alerts, a lanyard loop, and can be charged with an Apple Watch charger in addition to Lightning and Qi wireless.

Comfort remains excellent, with multiple ear tip sizes and a lightweight design that allows for extended listening sessions without discomfort. The touch controls have been expanded to include volume adjustment by swiping on the stems.

While still premium-priced and primarily optimized for Apple users, the AirPods Pro 2 deliver meaningful improvements that justify an upgrade, even for owners of the original model. They remain one of the best overall packages in wireless earbuds, especially for those already in the Apple ecosystem.',
  '[
    "Excellent noise cancellation",
    "Improved sound quality",
    "Better battery life than predecessor",
    "Seamless Apple ecosystem integration",
    "Comfortable for extended wear"
  ]',
  '[
    "Premium price tag",
    "Limited features on Android",
    "No aptX or LDAC codec support",
    "Lightning port rather than USB-C"
  ]',
  '{
    "Chip": "Apple H2",
    "Battery Life": "6 hours (earbuds), 30 hours (with case)",
    "Connectivity": "Bluetooth 5.3",
    "Features": "ANC, Transparency mode, Spatial Audio",
    "Charging": "Lightning, Qi wireless, Apple Watch charger",
    "Water Resistance": "IPX4"
  }',
  ARRAY['apple', 'airpods', 'wireless earbuds', 'noise-cancelling'],
  true
),
(
  'Amazon Echo Dot (5th Gen)',
  'amazon-echo-dot-5th-gen',
  (SELECT id FROM categories WHERE slug = 'smart-home'),
  'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1920&auto=format&fit=crop',
  4.3,
  'The 5th generation Echo Dot continues to refine Amazon''s popular smart speaker with improved sound quality and temperature sensing capabilities.',
  'The Amazon Echo Dot 5th generation builds upon the successful spherical design introduced with the previous model, while making meaningful improvements to sound quality and feature set.

Sound quality has received a noticeable upgrade, with fuller bass and clearer vocals that outperform its compact size. While it won''t replace a dedicated speaker for serious music listeners, it provides a satisfying audio experience for casual listening in smaller rooms.

The most significant hardware addition is the built-in temperature sensor, which allows the Echo Dot to trigger routines based on your home''s temperature—for example, turning on a connected fan when the room gets too warm. This feature works reliably and adds genuine value to the smart home experience.

Alexa continues to improve as a voice assistant, with faster response times and expanded capabilities. The smart home controls are particularly useful now that Matter support has been added, providing wider compatibility with various smart home ecosystems.

Setup remains straightforward through the Alexa app, and the compact design fits unobtrusively in most spaces. The physical buttons are responsive, and the light ring provides clear visual feedback for Alexa interactions.

At its competitive price point, especially during frequent sales, the Echo Dot 5th Gen offers excellent value as both an entry point into smart home technology and an expansion device for existing Alexa users. While the temperature sensor and sound improvements may not justify an upgrade from the 4th Gen for everyone, they cement the Echo Dot''s position as one of the best compact smart speakers available.',
  '[
    "Improved sound quality",
    "Built-in temperature sensor",
    "Compact, attractive design",
    "Easy setup and use",
    "Frequently on sale"
  ]',
  '[
    "Not a significant upgrade from 4th Gen",
    "Still requires Alexa app for setup",
    "Limited sound compared to larger speakers",
    "Privacy concerns remain for some users"
  ]',
  '{
    "Speakers": "1.73-inch front-firing",
    "Connectivity": "Dual-band Wi-Fi, Bluetooth LE",
    "Smart Home": "Matter, Zigbee, Sidewalk compatible",
    "Sensors": "Temperature",
    "Dimensions": "3.9\" x 3.9\" x 3.5\"",
    "Power": "15W power adapter"
  }',
  ARRAY['amazon', 'echo', 'alexa', 'smart speaker', 'smart home'],
  true
),
(
  'Apple Watch Series 9',
  'apple-watch-series-9',
  (SELECT id FROM categories WHERE slug = 'wearables'),
  'https://images.unsplash.com/photo-1617043786394-ae93e0052050?q=80&w=1920&auto=format&fit=crop',
  4.5,
  'The Apple Watch Series 9 brings a brighter display, faster processor and the innovative Double Tap gesture to Apple''s flagship smartwatch line.',
  'The Apple Watch Series 9 represents a refinement of Apple''s successful smartwatch formula rather than a revolutionary update, but the incremental improvements add up to a more capable and user-friendly device.

The most noticeable enhancement is the new S9 chip, which delivers faster performance and enables the new Double Tap gesture—allowing users to control the watch by tapping their thumb and index finger together twice. This feature proves surprisingly useful for one-handed interactions like answering calls or stopping timers when your other hand is occupied.

The display is noticeably brighter, reaching up to 2000 nits in outdoor settings and dimming to just 1 nit for discreet viewing in dark environments. This improved range makes the watch more usable in varied lighting conditions.

Health and fitness tracking remains comprehensive, with accurate heart rate monitoring, ECG functionality, blood oxygen measurement, and sleep tracking. The updated Workout app provides more detailed metrics for fitness enthusiasts, though no new sensors have been added to this generation.

Battery life remains at around 18 hours of normal use or up to 36 hours in Low Power Mode, which is adequate but falls short of some competitors that offer multiple days of use. The charging speed is good, reaching about 80% in 45 minutes.

WatchOS 10 brings a refreshed interface with widget-like Smart Stack and redesigned apps that make better use of the screen space. Siri is more capable on-device, with faster response times and the ability to access health data.

For existing Apple Watch users with Series 6 or older models, the Series 9 offers enough improvements to justify an upgrade. For new users, it represents the most refined version of Apple''s vision for a smartwatch, albeit at a premium price point.',
  '[
    "Bright, always-on display",
    "Useful Double Tap gesture",
    "Comprehensive health tracking",
    "Refined watchOS 10 experience",
    "Strong Apple ecosystem integration"
  ]',
  '[
    "Battery life still just one day",
    "No new health sensors",
    "Premium pricing",
    "No significant design changes"
  ]',
  '{
    "Processor": "Apple S9 SiP",
    "Display": "Always-On Retina LTPO OLED, 2000 nits",
    "Sizes": "41mm, 45mm",
    "Water Resistance": "50 meters",
    "Health Sensors": "Heart rate, ECG, Blood Oxygen",
    "Battery": "Up to 18 hours (36 in Low Power Mode)"
  }',
  ARRAY['apple', 'smartwatch', 'wearable', 'fitness tracker'],
  true
);
