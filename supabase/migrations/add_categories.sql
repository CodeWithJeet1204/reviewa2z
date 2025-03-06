
-- Insert categories if they don't exist already
INSERT INTO categories (name, slug, icon, description)
VALUES 
('Smartphones', 'smartphones', '📱', 'Reviews of the latest mobile phones and smartphones')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon, description)
VALUES 
('Laptops', 'laptops', '💻', 'Reviews of laptops, notebooks and portable computers')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon, description)
VALUES 
('Audio', 'audio', '🎧', 'Reviews of headphones, earbuds, speakers and audio equipment')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon, description)
VALUES 
('Smart Home', 'smart-home', '🏠', 'Reviews of smart home devices and automation systems')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, icon, description)
VALUES 
('Wearables', 'wearables', '⌚', 'Reviews of smartwatches, fitness trackers and wearable technology')
ON CONFLICT (slug) DO NOTHING;
