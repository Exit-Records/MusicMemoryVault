import { db } from "./db";
import { musicReleases, tracks } from "@shared/schema";
import { lt } from "drizzle-orm";

async function removeSeededReleases() {
  console.log("Removing seeded demo releases...");

  try {
    // First, let's see what releases we have
    const allReleases = await db.select().from(musicReleases);
    console.log("Current releases:");
    allReleases.forEach(release => {
      console.log(`- ID: ${release.id}, Title: "${release.title}", Year: ${release.year}`);
    });

    // Remove releases with IDs 1-6 (the seeded demo data)
    // This will also cascade delete any tracks due to foreign key constraint
    const deletedReleases = await db.delete(musicReleases)
      .where(lt(musicReleases.id, 20)) // Delete releases with ID less than 20 to be safe
      .returning();

    console.log(`\nRemoved ${deletedReleases.length} demo releases:`);
    deletedReleases.forEach(release => {
      console.log(`✓ Deleted: "${release.title}" (${release.year})`);
    });

    console.log("\nRemaining releases:");
    const remainingReleases = await db.select().from(musicReleases);
    remainingReleases.forEach(release => {
      console.log(`- "${release.title}" (${release.year}) - ${release.genre}`);
    });

  } catch (error) {
    console.error("Error removing demo releases:", error);
  }
}

// Run the cleanup
if (import.meta.url === `file://${process.argv[1]}`) {
  removeSeededReleases().catch(console.error);
}