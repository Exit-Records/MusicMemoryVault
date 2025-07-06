import { db } from "./db";
import { musicReleases, photos } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(musicReleases);
  await db.delete(photos);

  // Music releases data
  const musicData = [
    {
      title: "Neon Dreams",
      year: 2023,
      genre: "Electronic",
      description: "Latest exploration into ambient electronic soundscapes",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-neon-dreams-2023",
      appleUrl: "https://music.apple.com/album/alexandra-chen-neon-dreams-synthetic-records-2023",
      buyUrl: "https://store.alexandrachen.com/album/neon-dreams-2023",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/neon-dreams-2023-synthetic-records",
      ninaProtocolUrl: "https://ninaprotocol.com/alexandrachen/neon-dreams-2023",
      customLinks: JSON.stringify([
        { name: "YouTube", url: "https://youtube.com/playlist?list=alexandra-chen-neon-dreams-2023", color: "bg-red-600" },
        { name: "SoundCloud", url: "https://soundcloud.com/alexandrachen/sets/neon-dreams-2023", color: "bg-orange-400" }
      ]),
      enableLocationBasedBuy: 1,
      enableDiscogsSearch: 0
    },
    {
      title: "Wooden Hearts",
      year: 2021,
      genre: "Folk/Acoustic",
      description: "Intimate acoustic collection recorded in a mountain cabin",
      coverImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-wooden-hearts-2021",
      appleUrl: "https://music.apple.com/album/alexandra-chen-wooden-hearts-mountain-folk-records-2021",
      buyUrl: "https://store.alexandrachen.com/album/wooden-hearts-2021",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/wooden-hearts-2021-mountain-folk-records",
      ninaProtocolUrl: null,
      customLinks: JSON.stringify([
        { name: "YouTube", url: "https://youtube.com/playlist?list=alexandra-chen-wooden-hearts-2021", color: "bg-red-600" }
      ]),
      enableLocationBasedBuy: 1,
      enableDiscogsSearch: 0
    },
    {
      title: "Midnight Sessions",
      year: 2019,
      genre: "Jazz",
      description: "Late-night improvisations captured live",
      coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-midnight-sessions-2019",
      appleUrl: "https://music.apple.com/album/alexandra-chen-midnight-sessions-blue-note-records-2019",
      buyUrl: "https://store.alexandrachen.com/album/midnight-sessions-2019",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/midnight-sessions-2019-blue-note-records",
      ninaProtocolUrl: null,
      customLinks: JSON.stringify([
        { name: "Tidal", url: "https://tidal.com/browse/album/alexandra-chen-midnight-sessions-2019", color: "bg-blue-600" }
      ]),
      enableLocationBasedBuy: 1,
      enableDiscogsSearch: 0
    },
    {
      title: "Electric Dreams",
      year: 2015,
      genre: "Rock",
      description: "High-energy rock anthems from the road",
      coverImage: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-electric-dreams-2015",
      appleUrl: "https://music.apple.com/album/alexandra-chen-electric-dreams-thunder-records-2015",
      buyUrl: "https://store.alexandrachen.com/album/electric-dreams-2015",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/electric-dreams-2015-thunder-records",
      ninaProtocolUrl: "https://ninaprotocol.com/alexandrachen/electric-dreams-2015",
      customLinks: null,
      enableLocationBasedBuy: 0,
      enableDiscogsSearch: 1
    },
    {
      title: "Piano Reflections",
      year: 2010,
      genre: "Classical",
      description: "Solo piano compositions for contemplation",
      coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-piano-reflections-2010",
      appleUrl: "https://music.apple.com/album/alexandra-chen-piano-reflections-classical-chamber-music-2010",
      buyUrl: "https://store.alexandrachen.com/album/piano-reflections-2010",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/piano-reflections-2010-classical-chamber-music",
      ninaProtocolUrl: null,
      customLinks: null,
      enableLocationBasedBuy: 0,
      enableDiscogsSearch: 1
    },
    {
      title: "First Light",
      year: 1995,
      genre: "Folk",
      description: "Debut album that started the journey",
      coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      spotifyUrl: "https://open.spotify.com/album/alexandra-chen-first-light-1995",
      appleUrl: "https://music.apple.com/album/alexandra-chen-first-light-indie-folk-collective-1995",
      buyUrl: "https://store.alexandrachen.com/album/first-light-1995",
      bandcampUrl: "https://alexandrachen.bandcamp.com/album/first-light-1995-indie-folk-collective",
      ninaProtocolUrl: null,
      customLinks: null,
      enableLocationBasedBuy: 0,
      enableDiscogsSearch: 1
    }
  ];

  // Photos data
  const photosData = [
    {
      title: "Sound Check",
      location: "Recording Studio, 2022",
      category: "backstage",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2022
    },
    {
      title: "City Reflections",
      location: "Tokyo, 2023",
      category: "places",
      imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2023
    },
    {
      title: "Before the Show",
      location: "Concert Hall, 2021",
      category: "backstage",
      imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2021
    },
    {
      title: "Portrait Session",
      location: "Studio, 2020",
      category: "people",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2020
    },
    {
      title: "Urban Architecture",
      location: "Barcelona, 2022",
      category: "places",
      imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2022
    },
    {
      title: "Mountain Vista",
      location: "Pacific Northwest, 2021",
      category: "places",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2021
    },
    {
      title: "The Musician",
      location: "Nashville, 2019",
      category: "people",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2019
    },
    {
      title: "Equipment Setup",
      location: "San Francisco, 2020",
      category: "backstage",
      imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      year: 2020
    }
  ];

  // Insert music releases
  await db.insert(musicReleases).values(musicData);
  console.log(`Inserted ${musicData.length} music releases`);

  // Insert photos
  await db.insert(photos).values(photosData);
  console.log(`Inserted ${photosData.length} photos`);

  console.log("Database seeding completed!");
}

export { seedDatabase };

// Run the seeding
seedDatabase().catch(console.error);