import { db } from "./db";
import { musicReleases, photos, tracks } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';

interface MusicReleaseRow {
  title: string;
  artist: string;
  year: number;
  genre: string;
  description: string;
  coverImage: string;
  catalogNumber?: string;
  label?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  buyUrl?: string;
  bandcampUrl?: string;
  ninaProtocolUrl?: string;
  youtubeUrl?: string;
  primaryAudioSource?: string;
  customLinksJson?: string;
  enableLocationBasedBuy: boolean;
  enableDiscogsSearch: boolean;
}

interface TrackRow {
  releaseTitle: string;
  trackNumber: number;
  trackTitle: string;
  duration?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  youtubeUrl?: string;
  bandcampUrl?: string;
  customLinksJson?: string;
}

interface PhotoRow {
  title: string;
  location: string;
  category: 'backstage' | 'people' | 'places';
  imageUrl: string;
  year: number;
}

// Function to process CSV data (you'll paste your Excel data here)
async function bulkUploadReleases() {
  // Your release data:
  const releases: MusicReleaseRow[] = [
    {
      title: "The Sewer Monsters EP",
      artist: "The Sewer Monsters",
      year: 1993,
      genre: "Jungle",
      description: "First Release from dBridge alongside his brother Steve Spacek, GMC Blood and Frank",
      coverImage: "https://www.dropbox.com/scl/fi/papzyidyydzevzfrxla0a/The-Sewage-Monsters-2.jpg?rlkey=6z9zuczp8wn9zgaraxi5lrhv8&dl=1",
      catalogNumber: "SWG1",
      label: "The Sewage Monsters",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
    {
      title: "Umbrella Crew",
      artist: "Dubb Hustlers",
      year: 1994,
      genre: "Jungle",
      description: "First release under the name Dubb Hustlers alongside GMC Blood. This was made at Lennie De Ice Armshouse Studios",
      coverImage: "https://www.dropbox.com/scl/fi/0tx4y6b95y4tf8vt6tlxo/DoorDie3.jpg?rlkey=j0ie0l4x4b64br4r8tqeesmij&dl=1",
      catalogNumber: "DRD 003",
      label: "Do Or Die Records",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
    {
      title: "Oh Gosh",
      artist: "Dubb Hustlers",
      year: 1994,
      genre: "Jungle",
      description: "Vague recollection of making this",
      coverImage: "https://www.dropbox.com/scl/fi/zitk8jjvnshqsmdj59yic/Dubb-Hustlers-Oh-Gosh.jpg?rlkey=7xhzx30r68c31mq5gm83a19dy&dl=1",
      catalogNumber: "DRD 005",
      label: "Screw Face Recordings",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
    {
      title: "Posion EP",
      artist: "Dubb Hustlers",
      year: 1994,
      genre: "Jungle",
      description: "Released on a joint project with Armshouse Records",
      coverImage: "https://www.dropbox.com/scl/fi/rsfukrviivfkf0lz3k5iu/Poison-EP.jpg?rlkey=kk6kkg94vobtphjukdfdiqgac&dl=1",
      catalogNumber: "DAHC-001",
      label: "Armshouse Crew Records",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
    {
      title: "Untitled EP",
      artist: "Dubb Hustlers",
      year: 1994,
      genre: "Jungle",
      description: "Can't remember anything about this release, This was another tune in conjunction with Armshouse CrewI know I'm involved and I can hear Lennie on the mic in second track",
      coverImage: "https://www.dropbox.com/scl/fi/x7oy6a2a49wm0moydd7uz/Untitled-EP.jpg?rlkey=chto5tyadkbasoj612ew6h342&dl=1",
      catalogNumber: "CIS 003",
      label: "CIS Productions",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
    {
      title: "Crash Test No 2",
      artist: "dBridge",
      year: 1994,
      genre: "Jungle",
      description: "First time the name dBridge appeared on vinyl, fond memory of hearing Nut-E-1 play this at Lazerdrome in Peckham",
      coverImage: "https://www.dropbox.com/scl/fi/crw856faptmuodjhh23vy/Screwface-records-2.jpg?rlkey=67mtkqw5n7lqpw7taft7vw6kz&dl=1",
      catalogNumber: "DRD 007",
      label: "Screw Face Recordings",
      primaryAudioSource: "youtube",
      enableLocationBasedBuy: true,
      enableDiscogsSearch: true,
    },
  ];

  console.log(`Starting bulk upload of ${releases.length} releases...`);

  for (const release of releases) {
    try {
      await db.insert(musicReleases).values({
        title: release.title,
        artist: release.artist,
        year: release.year,
        genre: release.genre,
        description: release.description,
        coverImage: release.coverImage,
        catalogNumber: release.catalogNumber || null,
        label: release.label || null,
        spotifyUrl: release.spotifyUrl || null,
        appleUrl: release.appleUrl || null,
        buyUrl: release.buyUrl || null,
        bandcampUrl: release.bandcampUrl || null,
        ninaProtocolUrl: release.ninaProtocolUrl || null,
        youtubeUrl: release.youtubeUrl || null,
        primaryAudioSource: release.primaryAudioSource || null,
        customLinks: release.customLinksJson || null,
        enableLocationBasedBuy: release.enableLocationBasedBuy ? 1 : 0,
        enableDiscogsSearch: release.enableDiscogsSearch ? 1 : 0,
      });
      
      console.log(`✓ Added: ${release.title} (${release.year})`);
    } catch (error) {
      console.error(`✗ Failed to add ${release.title}:`, error);
    }
  }

  console.log("Bulk upload completed!");
}

async function bulkUploadTracks() {
  // Your track data:
  const tracks_data: TrackRow[] = [
    {
      releaseTitle: "The Sewer Monsters EP",
      trackNumber: 1,
      trackTitle: "Catch A Fire",
      youtubeUrl: "https://youtu.be/j3ZNM8qreIc?si=Jyj8_BwtSEjN8L07",
    },
    {
      releaseTitle: "The Sewer Monsters EP",
      trackNumber: 2,
      trackTitle: "English",
      youtubeUrl: "https://youtu.be/9yAwg8kpeJ4?si=KA0lbuPsxJev1X9a",
    },
    {
      releaseTitle: "The Sewer Monsters EP",
      trackNumber: 3,
      trackTitle: "R2D2",
      youtubeUrl: "https://youtu.be/3hN1A8Lz9j8?si=Jf2LTIS8XwR35fX1",
    },
    {
      releaseTitle: "The Sewer Monsters EP",
      trackNumber: 4,
      trackTitle: "Just Dance For Me",
      youtubeUrl: "https://youtu.be/k6qfGptNa1o?si=54nEl60tJ1xXPJ1Z",
    },
    {
      releaseTitle: "Oh Gosh",
      trackNumber: 1,
      trackTitle: "Oh Gosh (Analogue Mix)",
      youtubeUrl: "https://youtu.be/LnyKBEo4f4E?si=8ua0CHfWJL9o9Meq",
    },
    {
      releaseTitle: "Oh Gosh",
      trackNumber: 2,
      trackTitle: "Can't Quite Understand",
      youtubeUrl: "https://youtu.be/VgM1mZQ_9co?si=u9hySZqHqS-FD_xR",
    },
    {
      releaseTitle: "Oh Gosh",
      trackNumber: 3,
      trackTitle: "Lickwood (Southside Mix)",
      youtubeUrl: "https://youtu.be/jd-44sOQw7E?si=bxKFk16baB0tbmsv",
    },
    {
      releaseTitle: "Posion EP",
      trackNumber: 1,
      trackTitle: "Burial Ground",
      youtubeUrl: "https://youtu.be/kVhbrICDXco?si=a6oxMtIc0nBxdHIJ",
    },
    {
      releaseTitle: "Posion EP",
      trackNumber: 2,
      trackTitle: "You Wanna Break",
      youtubeUrl: "https://youtu.be/DAzPtAGZQ60?si=MxFcbQ6439soQqIK",
    },
    {
      releaseTitle: "Posion EP",
      trackNumber: 3,
      trackTitle: "Feel So Good",
      youtubeUrl: "https://youtu.be/hL2RwwbNW40?si=W4ZgZ4M85scRTImE",
    },
    {
      releaseTitle: "Untitled EP",
      trackNumber: 1,
      trackTitle: "Crash Test 1",
      youtubeUrl: "https://youtu.be/P1aAEDjbv50?si=Ke2OjZrb3jiWL4HT",
    },
    {
      releaseTitle: "Untitled EP",
      trackNumber: 2,
      trackTitle: "Get Off The Mic",
      youtubeUrl: "https://youtu.be/orPSakPal10?si=ClsRB8LKH9J0bfqC",
    },
    {
      releaseTitle: "Untitled EP",
      trackNumber: 3,
      trackTitle: "Run Riddim",
      youtubeUrl: "https://youtu.be/SvPOiVI8H_M?si=vx_Xm7u9PxjgV_rs",
    },
    {
      releaseTitle: "Umbrella Crew",
      trackNumber: 1,
      trackTitle: "Jungle Tremble",
      youtubeUrl: "https://youtu.be/SAqyjjVXkjU?si=cczWtcHhXB8lfsZ-",
    },
    {
      releaseTitle: "Crash Test No 2",
      trackNumber: 1,
      trackTitle: "Crash Test No 2 (Drone Edit Mix)",
      youtubeUrl: "https://youtu.be/DFvzjby23Dg?si=LHgiIXP2YcvM1eR3",
    },
  ];

  console.log(`Starting bulk upload of ${tracks_data.length} tracks...`);

  for (const track of tracks_data) {
    try {
      // Find the release ID by title
      const releaseResult = await db.select().from(musicReleases).where(
        eq(musicReleases.title, track.releaseTitle)
      );
      const release = releaseResult[0];

      if (!release) {
        console.error(`✗ Release "${track.releaseTitle}" not found. Please upload the release first.`);
        continue;
      }

      await db.insert(tracks).values({
        releaseId: release.id,
        trackNumber: track.trackNumber,
        title: track.trackTitle,
        duration: track.duration || null,
        spotifyUrl: track.spotifyUrl || null,
        appleUrl: track.appleUrl || null,
        youtubeUrl: track.youtubeUrl || null,
        bandcampUrl: track.bandcampUrl || null,
        customLinks: track.customLinksJson || null,
      });
      
      console.log(`✓ Added track: ${track.trackTitle} (Track ${track.trackNumber} from ${track.releaseTitle})`);
    } catch (error) {
      console.error(`✗ Failed to add track ${track.trackTitle}:`, error);
    }
  }

  console.log("Track bulk upload completed!");
}

async function bulkUploadPhotos() {
  // Paste your photo data here in this format:
  const photos_data: PhotoRow[] = [
    // Example - replace with your data:
    // {
    //   title: "Photo Title",
    //   location: "Location, Year",
    //   category: "backstage", // or "people" or "places"
    //   imageUrl: "https://your-image-url.com/photo.jpg",
    //   year: 2023,
    // },
  ];

  console.log(`Starting bulk upload of ${photos_data.length} photos...`);

  for (const photo of photos_data) {
    try {
      await db.insert(photos).values({
        title: photo.title,
        location: photo.location,
        category: photo.category,
        imageUrl: photo.imageUrl,
        year: photo.year,
      });
      
      console.log(`✓ Added photo: ${photo.title}`);
    } catch (error) {
      console.error(`✗ Failed to add photo ${photo.title}:`, error);
    }
  }

  console.log("Photo bulk upload completed!");
}

// Run the uploads
if (import.meta.url === `file://${process.argv[1]}`) {
  bulkUploadReleases()
    .then(() => bulkUploadTracks())
    .then(() => bulkUploadPhotos())
    .catch(console.error);
}