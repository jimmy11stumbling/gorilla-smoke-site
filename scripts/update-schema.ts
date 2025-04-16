import { sql } from "drizzle-orm";
import { db } from "../server/db";
import { users } from "../shared/schema";
import * as bcrypt from "bcrypt";

// This script will update the schema and create an admin user

async function main() {
  try {
    console.log("Pushing schema changes to database...");
    
    // Create admin user with hashed password
    const saltRounds = 10;
    const adminPassword = "admin123"; // Change this in production
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    
    console.log("Creating admin user...");
    
    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin"),
    });
    
    if (!existingAdmin) {
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        name: "Admin User",
        email: "admin@gorillasmokeandgrill.com",
        role: "admin"
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping creation");
    }
    
    console.log("Schema update completed successfully");
  } catch (error) {
    console.error("Error updating schema:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));