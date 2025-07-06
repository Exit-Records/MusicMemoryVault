import { db } from "./db";
import { musicReleases } from "@shared/schema";

// Example function to add a new music release
async function addMusicRelease(releaseData: {
  title: string;
  year: number;
  genre: string;
  description: string;
  coverImage: string;
  spotifyUrl?: string;
  appleUrl?: string;
  buyUrl?: string;
  bandcampUrl?: string;
  ninaProtocolUrl?: string;
  customLinks?: string; // JSON string like: '[{"name":"SoundCloud","url":"https://...","color":"bg-orange-500"}]'
  enableLocationBasedBuy?: boolean;
  enableDiscogsSearch?: boolean;
}) {
  try {
    const [newRelease] = await db
      .insert(musicReleases)
      .values({
        title: releaseData.title,
        year: releaseData.year,
        genre: releaseData.genre,
        description: releaseData.description,
        coverImage: releaseData.coverImage,
        spotifyUrl: releaseData.spotifyUrl || null,
        appleUrl: releaseData.appleUrl || null,
        buyUrl: releaseData.buyUrl || null,
        bandcampUrl: releaseData.bandcampUrl || null,
        ninaProtocolUrl: releaseData.ninaProtocolUrl || null,
        customLinks: releaseData.customLinks || null,
        enableLocationBasedBuy: releaseData.enableLocationBasedBuy ? 1 : 0,
        enableDiscogsSearch: releaseData.enableDiscogsSearch ? 1 : 0,
      })
      .returning();

    console.log("Successfully added release:", newRelease);
    return newRelease;
  } catch (error) {
    console.error("Error adding release:", error);
    throw error;
  }
}

// Example usage - add your releases here:
async function addYourReleases() {
  // Example release - replace with your actual data
  await addMusicRelease({
    title: "Your Album Title",
    year: 2024,
    genre: "Electronic",
    description: "Description of your album and its creative direction.",
    coverImage: "https://your-image-hosting.com/album-cover.jpg",
    spotifyUrl: "https://open.spotify.com/album/your-album-id",
    appleUrl: "https://music.apple.com/album/your-album-id",
    bandcampUrl: "https://yourname.bandcamp.com/album/your-album",
    enableLocationBasedBuy: true,
    enableDiscogsSearch: true,
  });

  console.log("All releases added successfully!");
}

// Run this to add releases
if (import.meta.url === `file://${process.argv[1]}`) {
  addYourReleases().catch(console.error);
}

export { addMusicRelease };