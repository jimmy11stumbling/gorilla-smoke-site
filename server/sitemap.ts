import fs from 'fs';
import path from 'path';
import { storage } from './storage';

const SITE_URL = 'https://gorillasmokegrill.com';
const SITEMAP_DIR = path.join(process.cwd(), 'public', 'sitemaps');

export async function generateSitemap() {
  try {
    // Get all menu items to include in sitemap
    const menuItems = await storage.getMenuItems();
    
    // Format current date for lastmod field
    const today = new Date().toISOString();
    const todayDate = today.split('T')[0];
    
    // Create sitemaps directory if it doesn't exist
    if (!fs.existsSync(SITEMAP_DIR)) {
      fs.mkdirSync(SITEMAP_DIR, { recursive: true });
    }
    
    // Generate main pages sitemap
    await generateMainSitemap(todayDate);
    
    // Generate menu items sitemap
    await generateMenuSitemap(menuItems, todayDate);
    
    // Generate image sitemap
    await generateImageSitemap(menuItems, todayDate);
    
    // Generate sitemap index
    await generateSitemapIndex(today);
    
    console.log('Sitemap generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return false;
  }
}

async function generateMainSitemap(todayDate: string) {
  // Build main pages sitemap XML content
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/menu</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/chef</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/location</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/order</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  // Write main sitemap to file
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-main.xml'), sitemap);
}

async function generateMenuSitemap(menuItems: any[], todayDate: string) {
  // Build menu items sitemap XML content
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Add menu item URLs
  menuItems.forEach(item => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/menu/item/${item.id}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  // Add category URLs
  const categories = ['starters', 'burgers', 'grill', 'sides', 'drinks'];
  categories.forEach(category => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/menu/category/${category}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Close sitemap XML
  sitemap += `
</urlset>`;

  // Write menu sitemap to file
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-menu.xml'), sitemap);
}

async function generateImageSitemap(menuItems: any[], todayDate: string) {
  // Build image sitemap XML content
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${todayDate}</lastmod>
    <image:image>
      <image:loc>${SITE_URL}/og-image.svg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill - Authentic BBQ in Laredo, TX</image:caption>
      <image:title>Gorilla Smoke &amp; Grill Restaurant</image:title>
    </image:image>
  </url>`;

  // Add menu item images
  menuItems.forEach(item => {
    const safeDescription = item.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const truncatedDescription = safeDescription.length > 150 ? safeDescription.substring(0, 147) + '...' : safeDescription;
    
    sitemap += `
  <url>
    <loc>${SITE_URL}/menu/item/${item.id}</loc>
    <lastmod>${todayDate}</lastmod>
    <image:image>
      <image:loc>${SITE_URL}${item.image}</image:loc>
      <image:caption>${item.name} - ${truncatedDescription}</image:caption>
      <image:title>${item.name}</image:title>
      <image:geo_location>Laredo, TX, USA</image:geo_location>
    </image:image>
  </url>`;
  });

  // Close sitemap XML
  sitemap += `
</urlset>`;

  // Write image sitemap to file
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-images.xml'), sitemap);
}

async function generateSitemapIndex(lastmod: string) {
  // Build sitemap index XML content
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemaps/sitemap-main.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemaps/sitemap-menu.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemaps/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  // Write sitemap index to public directory
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);

  // Create symbolic links for backward compatibility
  fs.copyFileSync(path.join(SITEMAP_DIR, 'sitemap-main.xml'), path.join(publicDir, 'sitemap-main.xml'));
  fs.copyFileSync(path.join(SITEMAP_DIR, 'sitemap-menu.xml'), path.join(publicDir, 'sitemap-menu.xml'));
  fs.copyFileSync(path.join(SITEMAP_DIR, 'sitemap-images.xml'), path.join(publicDir, 'sitemap-images.xml'));
}