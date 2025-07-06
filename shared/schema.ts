import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const musicReleases = pgTable("music_releases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: integer("year").notNull(),
  genre: text("genre").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  catalogNumber: text("catalog_number"),
  label: text("label"),
  spotifyUrl: text("spotify_url"),
  appleUrl: text("apple_url"),
  buyUrl: text("buy_url"),
  bandcampUrl: text("bandcamp_url"),
  ninaProtocolUrl: text("nina_protocol_url"),
  youtubeUrl: text("youtube_url"),
  primaryAudioSource: text("primary_audio_source"), // "youtube", "bandcamp", "spotify", "apple", "nina", "custom"
  customLinks: text("custom_links"), // JSON string for additional links
  enableLocationBasedBuy: integer("enable_location_based_buy").default(0), // 0=false, 1=true
  enableDiscogsSearch: integer("enable_discogs_search").default(0) // 0=false, 1=true
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id").references(() => musicReleases.id, { onDelete: 'cascade' }),
  trackNumber: integer("track_number").notNull(),
  title: text("title").notNull(),
  duration: text("duration"), // e.g., "3:45"
  spotifyUrl: text("spotify_url"),
  appleUrl: text("apple_url"),
  youtubeUrl: text("youtube_url"),
  bandcampUrl: text("bandcamp_url"),
  customLinks: text("custom_links"), // JSON string for additional links
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  year: integer("year").notNull()
});

export const corePages = pgTable("core_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(), // e.g., "about", "bio", "statement"
  featuredImage: text("featured_image"), // Optional featured image for core pages
  isPublished: integer("is_published").default(1), // 0=draft, 1=published
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const notePages = pgTable("note_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags"), // JSON string for tag array
  category: text("category").notNull(), // e.g., "reflection", "idea", "observation", "events"
  eventLocation: text("event_location"), // For events category
  ticketLink: text("ticket_link"), // For events category
  eventDate: text("event_date"), // For events category
  featuredImage: text("featured_image"), // Optional featured image for note pages
  isPublished: integer("is_published").default(1), // 0=draft, 1=published
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const merchandise = pgTable("merchandise", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // e.g., "music", "apparel", "accessories"
  price: text("price").notNull(), // Store as text to handle different currencies
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  available: integer("available").default(1), // 0=out of stock, 1=available
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const codeEntries = pgTable("code_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code").notNull().unique(),
  downloadUrl: text("download_url").notNull(),
  downloadName: text("download_name").notNull(),
  isActive: integer("is_active").default(1), // 0=inactive, 1=active
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const insertMusicReleaseSchema = createInsertSchema(musicReleases).omit({
  id: true,
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
});

export const insertCorePageSchema = createInsertSchema(corePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotePageSchema = createInsertSchema(notePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMerchandiseSchema = createInsertSchema(merchandise).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCodeEntrySchema = createInsertSchema(codeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMusicRelease = z.infer<typeof insertMusicReleaseSchema>;
export type MusicRelease = typeof musicReleases.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertCorePage = z.infer<typeof insertCorePageSchema>;
export type CorePage = typeof corePages.$inferSelect;

export type InsertNotePage = z.infer<typeof insertNotePageSchema>;
export type NotePage = typeof notePages.$inferSelect;

export type InsertMerchandise = z.infer<typeof insertMerchandiseSchema>;
export type Merchandise = typeof merchandise.$inferSelect;

export type InsertCodeEntry = z.infer<typeof insertCodeEntrySchema>;
export type CodeEntry = typeof codeEntries.$inferSelect;
