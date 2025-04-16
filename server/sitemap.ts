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
    
    // Define menu categories
    const menuCategories = ['starters', 'burgers', 'grill', 'sides', 'drinks'];
    
    // Build sitemap XML content
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:local="http://www.google.com/schemas/sitemap-local/1.0"
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
    <image:image>
      <image:loc>${SITE_URL}/images/restaurant-exterior.jpg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill Restaurant Exterior</image:caption>
      <image:title>Gorilla Smoke &amp; Grill Storefront</image:title>
    </image:image>
    <image:image>
      <image:loc>${SITE_URL}/images/restaurant-interior.jpg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill Restaurant Interior</image:caption>
      <image:title>Inside Gorilla Smoke &amp; Grill</image:title>
    </image:image>
    <local:business>
      <local:name>Gorilla Smoke &amp; Grill</local:name>
      <local:address>123 Main Street, Laredo, TX 78040</local:address>
      <local:phone>+1-555-123-4567</local:phone>
      <local:website>${SITE_URL}</local:website>
      <local:categories>BBQ, American, Mexican, Restaurant, Smoked Meats</local:categories>
      <local:hours>Monday-Thursday 11:00-22:00, Friday-Saturday 11:00-23:00, Sunday 11:00-22:00</local:hours>
    </local:business>
  </url>
  <url>
    <loc>${SITE_URL}/menu</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/bbq-specialties.jpg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill BBQ Specialties</image:caption>
      <image:title>BBQ Menu Specialties</image:title>
    </image:image>
    <mobile:mobile/>
  </url>`;

  // Add category URLs
  menuCategories.forEach(category => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/menu/category/${category}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>`;
  });

  // Continue with other main pages
  sitemap += `
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/chef</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/chef-ramiro.jpg</image:loc>
      <image:caption>Chef Ramiro Garza - Award-winning BBQ Chef</image:caption>
      <image:title>Head Chef Ramiro Garza</image:title>
    </image:image>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/location</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/restaurant-exterior.jpg</image:loc>
      <image:caption>Gorilla Smoke &amp; Grill Location</image:caption>
      <image:title>Restaurant Location</image:title>
    </image:image>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/order</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/events</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${SITE_URL}/images/bbq-masterclass.jpg</image:loc>
      <image:caption>BBQ Masterclass with Chef Ramiro</image:caption>
      <image:title>Learn BBQ Techniques</image:title>
    </image:image>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/catering</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/reviews</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <mobile:mobile/>
  </url>
  <url>
    <loc>${SITE_URL}/staff</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
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