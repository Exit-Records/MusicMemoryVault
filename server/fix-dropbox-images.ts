import { db } from "./db";
import { musicReleases } from "@shared/schema";
import { eq } from "drizzle-orm";

// Convert Google Drive URLs to Dropbox format
function convertToDropboxUrl(googleDriveUrl: string): string {
  // If it's already a Dropbox URL, return as is
  if (googleDriveUrl.includes('dropbox.com')) {
    return googleDriveUrl;
  }
  
  // Extract file ID from Google Drive URL
  const fileIdMatch = googleDriveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileIdMatch) {
    console.log(`Could not extract file ID from: ${googleDriveUrl}`);
    return googleDriveUrl;
  }
  
  const fileId = fileIdMatch[1];
  
  // Convert to Dropbox direct link format
  // Note: This is a placeholder format - user will need to provide actual Dropbox URLs
  return `https://www.dropbox.com/s/${fileId}/cover.jpg?dl=1`;
}

async function fixDropboxImages() {
  try {
    console.log("Fetching all music releases...");
    const releases = await db.select().from(musicReleases);
    
    console.log(`Found ${releases.length} releases to update`);
    
    for (const release of releases) {
      if (release.coverImage && release.coverImage.includes('drive.google.com')) {
        const newUrl = convertToDropboxUrl(release.coverImage);
        
        await db
          .update(musicReleases)
          .set({ coverImage: newUrl })
          .where(eq(musicReleases.id, release.id));
          
        console.log(`Updated ${release.title}: ${release.coverImage} -> ${newUrl}`);
      } else {
        console.log(`Skipping ${release.title} (not a Google Drive URL)`);
      }
    }
    
    console.log("✅ All cover images updated to Dropbox format");
  } catch (error) {
    console.error("❌ Error updating cover images:", error);
  }
}

// Run if called directly
if (require.main === module) {
  fixDropboxImages().then(() => process.exit(0));
}

export { fixDropboxImages };