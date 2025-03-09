import express from 'express';
import { generateSitemap, generateRobotsTxt } from '@/utils/generateSitemap';

const router = express.Router();

// Serve sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Serve robots.txt
router.get('/robots.txt', (req, res) => {
  try {
    const sitemapUrl = `${req.protocol}://${req.get('host')}/sitemap.xml`;
    const robotsTxt = generateRobotsTxt(sitemapUrl);
    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('Error generating robots.txt');
  }
});

export default router; 