import fs from 'fs';
import path from 'path';
import { storage } from './storage';

const SITE_URL = 'https://gorillasmokegrill.com';

export async function generateSitemap() {
  try {
    // Get all menu items to include in sitemap
    const menuItems = await storage.getMenuItems();
    
    // Format current date for lastmod field
    const today = new Date().toISOString().split('T')[0];
    
    // Build sitemap XML content
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/og-image.svg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill - Authentic BBQ in Laredo, TX</image:caption>
      <image:title>Gorilla Smoke &amp; Grill Restaurant</image:title>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/menu</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/chef</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/location</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/order</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Add menu item URLs
  menuItems.forEach(item => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/menu/item/${item.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <image:image>
      <image:loc>${SITE_URL}${item.image}</image:loc>
      <image:caption>${item.name} - ${item.description.substring(0, 150)}</image:caption>
      <image:title>${item.name}</image:title>
    </image:image>
  </url>`;
  });

  // Close sitemap XML
  sitemap += `
</urlset>`;

    // Write sitemap.xml to public directory
    const staticDir = path.join(process.cwd(), 'public');
    
    // Make sure directory exists
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(staticDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully');
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}