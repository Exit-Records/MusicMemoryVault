import { db } from "./db";
import { musicReleases } from "@shared/schema";
import { eq } from "drizzle-orm";

async function fixCoverImages() {
  console.log("Fixing cover image URLs...");

  try {
    // Update The Sewer Monsters EP
    await db.update(musicReleases)
      .set({
        coverImage: "https://drive.google.com/uc?export=view&id=1dJUeD4d8FuPFLiJZE2srB48FpvRYZTkc"
      })
      .where(eq(musicReleases.title, "The Sewer Monsters EP"));
    
    console.log("✓ Updated The Sewer Monsters EP cover image");

    // Update Oh Gosh
    await db.update(musicReleases)
      .set({
        coverImage: "https://drive.google.com/uc?export=view&id=1MLhK3pygLccj48dpAmYwMYw_Zilo9id_"
      })
      .where(eq(musicReleases.title, "Oh Gosh"));
    
    console.log("✓ Updated Oh Gosh cover image");
    console.log("All cover images fixed!");

  } catch (error) {
    console.error("Error updating cover images:", error);
  }
}

// Run the fix
if (import.meta.url === `file://${process.argv[1]}`) {
  fixCoverImages().catch(console.error);
}