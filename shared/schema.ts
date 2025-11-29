import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const animeTable = pgTable("anime", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull(),
  coverImage: text("cover_image").notNull(),
  bannerImage: text("banner_image"),
  rating: real("rating").default(0),
  year: integer("year").notNull(),
  status: text("status").notNull(), // "Ongoing", "Completed", "Upcoming"
  type: text("type").notNull(), // "TV", "Movie", "OVA", "Special"
  episodes: integer("episodes"),
  genres: text("genres").array().notNull(),
  languages: text("languages").array().notNull(),
  studio: text("studio"),
  duration: text("duration"),
});

export const insertAnimeSchema = createInsertSchema(animeTable).omit({ id: true });
export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Anime = typeof animeTable.$inferSelect;

export const episodesTable = pgTable("episodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animeId: varchar("anime_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  videoUrl: text("video_url"),
});

export const insertEpisodeSchema = createInsertSchema(episodesTable).omit({ id: true });
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodesTable.$inferSelect;

export const watchlistTable = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animeId: varchar("anime_id").notNull(),
  addedAt: text("added_at").notNull(),
});

export const insertWatchlistSchema = createInsertSchema(watchlistTable).omit({ id: true });
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type WatchlistItem = typeof watchlistTable.$inferSelect;

export interface AnimeWithWatchlist extends Anime {
  isInWatchlist?: boolean;
}

export interface AnimeFilters {
  status?: string;
  genre?: string;
  year?: string;
  language?: string;
  search?: string;
  sort?: "latest" | "popular" | "rating" | "a-z";
}
