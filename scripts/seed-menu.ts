import { db } from "../server/db";
import { menuItems } from "../shared/schema";
import { menuItems as staticMenuItems } from "../client/src/lib/data";

async function seedMenu() {
  console.log("🌱 Seeding menu items...");

  try {
    // First check if we already have menu items in the database
    const existingItems = await db.select().from(menuItems);
    
    if (existingItems.length > 0) {
      console.log(`Found ${existingItems.length} existing menu items. Skipping seed.`);
      return;
    }

    // No existing items, proceed with seeding
    console.log(`Inserting ${staticMenuItems.length} menu items`);
    
    // Insert all menu items from the static data
    await db.insert(menuItems).values(
      staticMenuItems.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: item.category,
        featured: item.category === "burgers" ? 1 : 0, // Mark burgers as featured
      }))
    );

    console.log("✅ Menu items seeded successfully!");
  } catch (error) {
    console.error("Error seeding menu items:", error);
    process.exit(1);
  }
}

seedMenu().then(() => process.exit(0));