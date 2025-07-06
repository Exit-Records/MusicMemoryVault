import { musicReleases, photos, tracks, corePages, notePages, merchandise, codeEntries, type MusicRelease, type InsertMusicRelease, type Photo, type InsertPhoto, type Track, type InsertTrack, type CorePage, type InsertCorePage, type NotePage, type InsertNotePage, type Merchandise, type InsertMerchandise, type CodeEntry, type InsertCodeEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, asc } from "drizzle-orm";

export interface IStorage {
  getMusicReleases(): Promise<MusicRelease[]>;
  getMusicReleasesByDecade(decade: string): Promise<MusicRelease[]>;
  getTracksByRelease(releaseId: number): Promise<Track[]>;
  getPhotos(): Promise<Photo[]>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  getCorePages(): Promise<CorePage[]>;
  getCorePagesByCategory(category: string): Promise<CorePage[]>;
  getNotePages(): Promise<NotePage[]>;
  getNotePagesByCategory(category: string): Promise<NotePage[]>;
  getMerchandise(): Promise<Merchandise[]>;
  getMerchandiseByCategory(category: string): Promise<Merchandise[]>;
  getCodeEntries(): Promise<CodeEntry[]>;
  getCodeEntryByCode(code: string): Promise<CodeEntry | null>;
  createMusicRelease(data: InsertMusicRelease): Promise<MusicRelease>;
  createTrack(data: InsertTrack): Promise<Track>;
  createPhoto(data: InsertPhoto): Promise<Photo>;
  createCorePage(data: InsertCorePage): Promise<CorePage>;
  createNotePage(data: InsertNotePage): Promise<NotePage>;
  createMerchandise(data: InsertMerchandise): Promise<Merchandise>;
  createCodeEntry(data: InsertCodeEntry): Promise<CodeEntry>;
  updateMusicRelease(id: number, data: InsertMusicRelease): Promise<MusicRelease>;
  updateTrack(id: number, data: InsertTrack): Promise<Track>;
  updatePhoto(id: number, data: InsertPhoto): Promise<Photo>;
  updateCorePage(id: number, data: InsertCorePage): Promise<CorePage>;
  updateNotePage(id: number, data: InsertNotePage): Promise<NotePage>;
  updateMerchandise(id: number, data: InsertMerchandise): Promise<Merchandise>;
  updateCodeEntry(id: number, data: InsertCodeEntry): Promise<CodeEntry>;
  deleteTrack(id: number): Promise<void>;
  deletePhoto(id: number): Promise<void>;
  deleteNotePage(id: number): Promise<void>;
  deleteCorePage(id: number): Promise<void>;
  deleteMerchandise(id: number): Promise<void>;
  deleteCodeEntry(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMusicReleases(): Promise<MusicRelease[]> {
    const releases = await db.select().from(musicReleases).orderBy(musicReleases.year);
    return releases.reverse(); // Most recent first
  }

  async getMusicReleasesByDecade(decade: string): Promise<MusicRelease[]> {
    if (decade === "all") {
      return this.getMusicReleases();
    }
    
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    
    const releases = await db
      .select()
      .from(musicReleases)
      .where(and(gte(musicReleases.year, startYear), lte(musicReleases.year, endYear)))
      .orderBy(musicReleases.year);
    
    return releases.reverse(); // Most recent first
  }

  async getPhotos(): Promise<Photo[]> {
    const photoList = await db.select().from(photos).orderBy(photos.year);
    return photoList.reverse(); // Most recent first
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    if (category === "all") {
      return this.getPhotos();
    }
    
    const photoList = await db
      .select()
      .from(photos)
      .where(eq(photos.category, category))
      .orderBy(photos.year);
    
    return photoList.reverse(); // Most recent first
  }

  async getTracksByRelease(releaseId: number): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.releaseId, releaseId)).orderBy(asc(tracks.trackNumber));
  }

  async createMusicRelease(data: InsertMusicRelease): Promise<MusicRelease> {
    const [release] = await db.insert(musicReleases).values(data).returning();
    return release;
  }

  async createTrack(data: InsertTrack): Promise<Track> {
    const [track] = await db.insert(tracks).values(data).returning();
    return track;
  }

  async createPhoto(data: InsertPhoto): Promise<Photo> {
    const [photo] = await db.insert(photos).values(data).returning();
    return photo;
  }

  async getCorePages(): Promise<CorePage[]> {
    const pages = await db.select().from(corePages).orderBy(corePages.updatedAt);
    return pages.reverse(); // Most recent first
  }

  async getCorePagesByCategory(category: string): Promise<CorePage[]> {
    if (category === "all") {
      return this.getCorePages();
    }
    
    const pages = await db
      .select()
      .from(corePages)
      .where(eq(corePages.category, category))
      .orderBy(corePages.updatedAt);
    
    return pages.reverse(); // Most recent first
  }

  async getNotePages(): Promise<NotePage[]> {
    const pages = await db.select().from(notePages).orderBy(notePages.updatedAt);
    return pages.reverse(); // Most recent first
  }

  async getNotePagesByCategory(category: string): Promise<NotePage[]> {
    if (category === "all") {
      return this.getNotePages();
    }
    
    const pages = await db
      .select()
      .from(notePages)
      .where(eq(notePages.category, category))
      .orderBy(notePages.updatedAt);
    
    return pages.reverse(); // Most recent first
  }

  async createCorePage(data: InsertCorePage): Promise<CorePage> {
    const now = Math.floor(Date.now() / 1000);
    const pageData = { ...data, createdAt: now, updatedAt: now };
    const [page] = await db.insert(corePages).values(pageData).returning();
    return page;
  }

  async createNotePage(data: InsertNotePage): Promise<NotePage> {
    const now = Math.floor(Date.now() / 1000);
    const pageData = { ...data, createdAt: now, updatedAt: now };
    const [page] = await db.insert(notePages).values(pageData).returning();
    return page;
  }

  async updateMusicRelease(id: number, data: InsertMusicRelease): Promise<MusicRelease> {
    const [release] = await db.update(musicReleases).set(data).where(eq(musicReleases.id, id)).returning();
    return release;
  }

  async updateTrack(id: number, data: InsertTrack): Promise<Track> {
    const [track] = await db.update(tracks).set(data).where(eq(tracks.id, id)).returning();
    return track;
  }

  async updatePhoto(id: number, data: InsertPhoto): Promise<Photo> {
    const [photo] = await db.update(photos).set(data).where(eq(photos.id, id)).returning();
    return photo;
  }

  async deleteTrack(id: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  async deleteNotePage(id: number): Promise<void> {
    await db.delete(notePages).where(eq(notePages.id, id));
  }

  async deleteCorePage(id: number): Promise<void> {
    await db.delete(corePages).where(eq(corePages.id, id));
  }

  async updateCorePage(id: number, data: InsertCorePage): Promise<CorePage> {
    const now = Math.floor(Date.now() / 1000);
    const pageData = { ...data, updatedAt: now };
    const [page] = await db.update(corePages).set(pageData).where(eq(corePages.id, id)).returning();
    return page;
  }

  async updateNotePage(id: number, data: InsertNotePage): Promise<NotePage> {
    const now = Math.floor(Date.now() / 1000);
    const pageData = { ...data, updatedAt: now };
    const [page] = await db.update(notePages).set(pageData).where(eq(notePages.id, id)).returning();
    return page;
  }

  async getMerchandise(): Promise<Merchandise[]> {
    const items = await db.select().from(merchandise).orderBy(merchandise.updatedAt);
    return items.reverse(); // Most recent first
  }

  async getMerchandiseByCategory(category: string): Promise<Merchandise[]> {
    if (category === "all") {
      return this.getMerchandise();
    }
    
    const items = await db
      .select()
      .from(merchandise)
      .where(eq(merchandise.category, category))
      .orderBy(merchandise.updatedAt);
    
    return items.reverse(); // Most recent first
  }

  async createMerchandise(data: InsertMerchandise): Promise<Merchandise> {
    const now = Math.floor(Date.now() / 1000);
    const itemData = { ...data, createdAt: now, updatedAt: now };
    const [item] = await db.insert(merchandise).values(itemData).returning();
    return item;
  }

  async updateMerchandise(id: number, data: InsertMerchandise): Promise<Merchandise> {
    const now = Math.floor(Date.now() / 1000);
    const itemData = { ...data, updatedAt: now };
    const [item] = await db.update(merchandise).set(itemData).where(eq(merchandise.id, id)).returning();
    return item;
  }

  async deleteMerchandise(id: number): Promise<void> {
    await db.delete(merchandise).where(eq(merchandise.id, id));
  }

  async getCodeEntries(): Promise<CodeEntry[]> {
    const entries = await db.select().from(codeEntries).orderBy(codeEntries.createdAt);
    return entries.reverse(); // Most recent first
  }

  async getCodeEntryByCode(code: string): Promise<CodeEntry | null> {
    const [entry] = await db
      .select()
      .from(codeEntries)
      .where(eq(codeEntries.code, code))
      .limit(1);
    
    return entry || null;
  }

  async createCodeEntry(data: InsertCodeEntry): Promise<CodeEntry> {
    const now = Math.floor(Date.now() / 1000);
    const entryData = { ...data, createdAt: now, updatedAt: now };
    const [entry] = await db.insert(codeEntries).values(entryData).returning();
    return entry;
  }

  async updateCodeEntry(id: number, data: InsertCodeEntry): Promise<CodeEntry> {
    const now = Math.floor(Date.now() / 1000);
    const entryData = { ...data, updatedAt: now };
    const [entry] = await db.update(codeEntries).set(entryData).where(eq(codeEntries.id, id)).returning();
    return entry;
  }

  async deleteCodeEntry(id: number): Promise<void> {
    await db.delete(codeEntries).where(eq(codeEntries.id, id));
  }
}

export class MemStorage implements IStorage {
  private musicReleases: Map<number, MusicRelease>;
  private photos: Map<number, Photo>;
  private currentMusicId: number;
  private currentPhotoId: number;

  constructor() {
    this.musicReleases = new Map();
    this.photos = new Map();
    this.currentMusicId = 1;
    this.currentPhotoId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Music releases data
    const musicData: Omit<MusicRelease, 'id'>[] = [
      {
        title: "Neon Dreams",
        artist: "Alexandra Chen",
        year: 2023,
        genre: "Electronic",
        description: "Latest exploration into ambient electronic soundscapes",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "NEO001",
        label: "Synthetic Records",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-neon-dreams-2023",
        appleUrl: "https://music.apple.com/album/alexandra-chen-neon-dreams-synthetic-records-2023",
        buyUrl: "https://store.alexandrachen.com/album/neon-dreams-2023",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/neon-dreams-2023-synthetic-records",
        ninaProtocolUrl: "https://ninaprotocol.com/alexandrachen/neon-dreams-2023",
        youtubeUrl: null,
        primaryAudioSource: "bandcamp",
        customLinks: JSON.stringify([
          { name: "YouTube", url: "https://youtube.com/playlist?list=alexandra-chen-neon-dreams-2023", color: "bg-red-600" },
          { name: "SoundCloud", url: "https://soundcloud.com/alexandrachen/sets/neon-dreams-2023", color: "bg-orange-400" }
        ]),
        enableLocationBasedBuy: 1,
        enableDiscogsSearch: 1
      },
      {
        title: "Wooden Hearts",
        artist: "Alexandra Chen",
        year: 2021,
        genre: "Folk/Acoustic",
        description: "Intimate acoustic collection recorded in a mountain cabin",
        coverImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "WH021",
        label: "Mountain Folk Records",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-wooden-hearts-2021",
        appleUrl: "https://music.apple.com/album/alexandra-chen-wooden-hearts-mountain-folk-records-2021",
        buyUrl: "https://store.alexandrachen.com/album/wooden-hearts-2021",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/wooden-hearts-2021-mountain-folk-records",
        ninaProtocolUrl: null,
        youtubeUrl: null,
        primaryAudioSource: "spotify",
        customLinks: JSON.stringify([
          { name: "YouTube", url: "https://youtube.com/playlist?list=alexandra-chen-wooden-hearts-2021", color: "bg-red-600" }
        ]),
        enableLocationBasedBuy: 1,
        enableDiscogsSearch: 1
      },
      {
        title: "Midnight Sessions",
        artist: "Alexandra Chen",
        year: 2019,
        genre: "Jazz",
        description: "Late-night improvisations captured live",
        coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "MS019",
        label: "Blue Note Records",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-midnight-sessions-2019",
        appleUrl: "https://music.apple.com/album/alexandra-chen-midnight-sessions-blue-note-records-2019",
        buyUrl: "https://store.alexandrachen.com/album/midnight-sessions-2019",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/midnight-sessions-2019-blue-note-records",
        ninaProtocolUrl: null,
        youtubeUrl: null,
        primaryAudioSource: "spotify",
        customLinks: JSON.stringify([
          { name: "Tidal", url: "https://tidal.com/browse/album/alexandra-chen-midnight-sessions-2019", color: "bg-blue-600" }
        ]),
        enableLocationBasedBuy: 1,
        enableDiscogsSearch: 1
      },
      {
        title: "Electric Dreams",
        artist: "Alexandra Chen",
        year: 2015,
        genre: "Rock",
        description: "High-energy rock anthems from the road",
        coverImage: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "ED015",
        label: "Thunder Records",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-electric-dreams-2015",
        appleUrl: "https://music.apple.com/album/alexandra-chen-electric-dreams-thunder-records-2015",
        buyUrl: "https://store.alexandrachen.com/album/electric-dreams-2015",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/electric-dreams-2015-thunder-records",
        ninaProtocolUrl: "https://ninaprotocol.com/alexandrachen/electric-dreams-2015",
        youtubeUrl: null,
        primaryAudioSource: "nina",
        customLinks: null,
        enableLocationBasedBuy: 0,
        enableDiscogsSearch: 1
      },
      {
        title: "Piano Reflections",
        artist: "Alexandra Chen",
        year: 2010,
        genre: "Classical",
        description: "Solo piano compositions for contemplation",
        coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "PR010",
        label: "Classical Chamber Music",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-piano-reflections-2010",
        appleUrl: "https://music.apple.com/album/alexandra-chen-piano-reflections-classical-chamber-music-2010",
        buyUrl: "https://store.alexandrachen.com/album/piano-reflections-2010",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/piano-reflections-2010-classical-chamber-music",
        ninaProtocolUrl: null,
        youtubeUrl: null,
        primaryAudioSource: "apple",
        customLinks: null,
        enableLocationBasedBuy: 0,
        enableDiscogsSearch: 1
      },
      {
        title: "First Light",
        artist: "Alexandra Chen",
        year: 1995,
        genre: "Folk",
        description: "Debut album that started the journey",
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        catalogNumber: "FL001",
        label: "Indie Folk Collective",
        spotifyUrl: "https://open.spotify.com/album/alexandra-chen-first-light-1995",
        appleUrl: "https://music.apple.com/album/alexandra-chen-first-light-indie-folk-collective-1995",
        buyUrl: "https://store.alexandrachen.com/album/first-light-1995",
        bandcampUrl: "https://alexandrachen.bandcamp.com/album/first-light-1995-indie-folk-collective",
        ninaProtocolUrl: null,
        youtubeUrl: null,
        primaryAudioSource: "bandcamp",
        customLinks: null,
        enableLocationBasedBuy: 0,
        enableDiscogsSearch: 1
      }
    ];

    musicData.forEach(release => {
      const id = this.currentMusicId++;
      this.musicReleases.set(id, { ...release, id });
    });

    // Photos data
    const photosData: Omit<Photo, 'id'>[] = [
      {
        title: "Mountain Dreams",
        location: "Swiss Alps, 2022",
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2022
      },
      {
        title: "Neon Nights",
        location: "Tokyo, 2023",
        category: "urban",
        imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2023
      },
      {
        title: "Ocean Power",
        location: "Big Sur, 2021",
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2021
      },
      {
        title: "Jazz Legend",
        location: "New Orleans, 2020",
        category: "portrait",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2020
      },
      {
        title: "Geometric Dreams",
        location: "Barcelona, 2022",
        category: "urban",
        imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2022
      },
      {
        title: "Forest Light",
        location: "Pacific Northwest, 2021",
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2021
      },
      {
        title: "Street Serenade",
        location: "Nashville, 2019",
        category: "portrait",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2019
      },
      {
        title: "Golden Hour",
        location: "San Francisco, 2020",
        category: "urban",
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        year: 2020
      }
    ];

    photosData.forEach(photo => {
      const id = this.currentPhotoId++;
      this.photos.set(id, { ...photo, id });
    });
  }

  async getMusicReleases(): Promise<MusicRelease[]> {
    return Array.from(this.musicReleases.values()).sort((a, b) => b.year - a.year);
  }

  async getMusicReleasesByDecade(decade: string): Promise<MusicRelease[]> {
    if (decade === "all") {
      return this.getMusicReleases();
    }
    
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    
    return Array.from(this.musicReleases.values())
      .filter(release => release.year >= startYear && release.year <= endYear)
      .sort((a, b) => b.year - a.year);
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => b.year - a.year);
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    if (category === "all") {
      return this.getPhotos();
    }
    
    return Array.from(this.photos.values())
      .filter(photo => photo.category === category)
      .sort((a, b) => b.year - a.year);
  }

  async getTracksByRelease(releaseId: number): Promise<Track[]> {
    // MemStorage doesn't implement tracks, return empty array
    return [];
  }

  async createMusicRelease(data: InsertMusicRelease): Promise<MusicRelease> {
    const release: MusicRelease = {
      id: this.currentMusicId++,
      title: data.title,
      artist: data.artist,
      year: data.year,
      genre: data.genre,
      description: data.description,
      coverImage: data.coverImage,
      catalogNumber: data.catalogNumber || null,
      label: data.label || null,
      spotifyUrl: data.spotifyUrl || null,
      appleUrl: data.appleUrl || null,
      buyUrl: data.buyUrl || null,
      bandcampUrl: data.bandcampUrl || null,
      ninaProtocolUrl: data.ninaProtocolUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      primaryAudioSource: data.primaryAudioSource || null,
      customLinks: data.customLinks || null,
      enableLocationBasedBuy: data.enableLocationBasedBuy || null,
      enableDiscogsSearch: data.enableDiscogsSearch || null,
    };
    this.musicReleases.set(release.id, release);
    return release;
  }

  async createTrack(data: InsertTrack): Promise<Track> {
    // MemStorage doesn't implement tracks
    throw new Error("Track creation not supported in MemStorage");
  }

  async createPhoto(data: InsertPhoto): Promise<Photo> {
    const photo: Photo = {
      id: this.currentPhotoId++,
      ...data,
    };
    this.photos.set(photo.id, photo);
    return photo;
  }

  async getCorePages(): Promise<CorePage[]> {
    // MemStorage doesn't implement core pages
    return [];
  }

  async getCorePagesByCategory(category: string): Promise<CorePage[]> {
    // MemStorage doesn't implement core pages
    return [];
  }

  async getNotePages(): Promise<NotePage[]> {
    // MemStorage doesn't implement note pages
    return [];
  }

  async getNotePagesByCategory(category: string): Promise<NotePage[]> {
    // MemStorage doesn't implement note pages
    return [];
  }

  async createCorePage(data: InsertCorePage): Promise<CorePage> {
    // MemStorage doesn't implement core pages
    throw new Error("Core page creation not supported in MemStorage");
  }

  async createNotePage(data: InsertNotePage): Promise<NotePage> {
    // MemStorage doesn't implement note pages
    throw new Error("Note page creation not supported in MemStorage");
  }

  async getMerchandise(): Promise<Merchandise[]> {
    // MemStorage doesn't implement merchandise
    return [];
  }

  async getMerchandiseByCategory(category: string): Promise<Merchandise[]> {
    // MemStorage doesn't implement merchandise
    return [];
  }

  async createMerchandise(data: InsertMerchandise): Promise<Merchandise> {
    // MemStorage doesn't implement merchandise
    throw new Error("Merchandise creation not supported in MemStorage");
  }

  async getCodeEntries(): Promise<CodeEntry[]> {
    // MemStorage doesn't implement code entries
    return [];
  }

  async getCodeEntryByCode(code: string): Promise<CodeEntry | null> {
    // MemStorage doesn't implement code entries
    return null;
  }

  async createCodeEntry(data: InsertCodeEntry): Promise<CodeEntry> {
    // MemStorage doesn't implement code entries
    throw new Error("Code entry creation not supported in MemStorage");
  }

  async updateMusicRelease(id: number, data: InsertMusicRelease): Promise<MusicRelease> {
    const existing = this.musicReleases.get(id);
    if (!existing) {
      throw new Error("Release not found");
    }
    
    const updated: MusicRelease = {
      ...existing,
      ...data,
    };
    this.musicReleases.set(id, updated);
    return updated;
  }

  async updateTrack(id: number, data: InsertTrack): Promise<Track> {
    // MemStorage doesn't implement tracks
    throw new Error("Track update not supported in MemStorage");
  }

  async updatePhoto(id: number, data: InsertPhoto): Promise<Photo> {
    const existing = this.photos.get(id);
    if (!existing) {
      throw new Error("Photo not found");
    }
    
    const updated: Photo = {
      ...existing,
      ...data,
    };
    this.photos.set(id, updated);
    return updated;
  }

  async deleteTrack(id: number): Promise<void> {
    // MemStorage doesn't implement tracks
    throw new Error("Track deletion not supported in MemStorage");
  }

  async deletePhoto(id: number): Promise<void> {
    this.photos.delete(id);
  }

  async deleteNotePage(id: number): Promise<void> {
    // MemStorage doesn't implement note pages
    throw new Error("Note page deletion not supported in MemStorage");
  }

  async deleteCorePage(id: number): Promise<void> {
    // MemStorage doesn't implement core pages
    throw new Error("Core page deletion not supported in MemStorage");
  }

  async updateCorePage(id: number, data: InsertCorePage): Promise<CorePage> {
    // MemStorage doesn't implement core pages
    throw new Error("Core page update not supported in MemStorage");
  }

  async updateNotePage(id: number, data: InsertNotePage): Promise<NotePage> {
    // MemStorage doesn't implement note pages
    throw new Error("Note page update not supported in MemStorage");
  }

  async updateMerchandise(id: number, data: InsertMerchandise): Promise<Merchandise> {
    // MemStorage doesn't implement merchandise
    throw new Error("Merchandise update not supported in MemStorage");
  }

  async updateCodeEntry(id: number, data: InsertCodeEntry): Promise<CodeEntry> {
    // MemStorage doesn't implement code entries
    throw new Error("Code entry update not supported in MemStorage");
  }

  async deleteMerchandise(id: number): Promise<void> {
    // MemStorage doesn't implement merchandise
    throw new Error("Merchandise deletion not supported in MemStorage");
  }

  async deleteCodeEntry(id: number): Promise<void> {
    // MemStorage doesn't implement code entries
    throw new Error("Code entry deletion not supported in MemStorage");
  }
}

export const storage = new DatabaseStorage();
