import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWatchlistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all anime with optional filtering
  app.get("/api/anime", async (req, res) => {
    try {
      let anime = await storage.getAllAnime();
      
      const { search, genre, year, status, language, sort } = req.query;
      
      // Apply filters
      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        anime = anime.filter(a => 
          a.title.toLowerCase().includes(searchLower)
        );
      }
      
      if (genre && typeof genre === "string" && genre !== "all") {
        anime = anime.filter(a => a.genres.includes(genre));
      }
      
      if (year && typeof year === "string" && year !== "all") {
        anime = anime.filter(a => a.year.toString() === year);
      }
      
      if (status && typeof status === "string" && status !== "all") {
        anime = anime.filter(a => a.status === status);
      }
      
      if (language && typeof language === "string" && language !== "all") {
        anime = anime.filter(a => a.languages.includes(language));
      }
      
      // Apply sorting
      if (sort && typeof sort === "string") {
        switch (sort) {
          case "rating":
            anime.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "a-z":
            anime.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "popular":
            anime.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "latest":
          default:
            anime.sort((a, b) => b.year - a.year);
            break;
        }
      }
      
      res.json(anime);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anime" });
    }
  });

  // Get single anime by ID
  app.get("/api/anime/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const anime = await storage.getAnimeById(id);
      
      if (!anime) {
        return res.status(404).json({ error: "Anime not found" });
      }
      
      res.json(anime);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anime" });
    }
  });

  // Get episodes for an anime
  app.get("/api/anime/:id/episodes", async (req, res) => {
    try {
      const { id } = req.params;
      const episodes = await storage.getEpisodesByAnimeId(id);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Get watchlist
  app.get("/api/watchlist", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  // Add to watchlist
  app.post("/api/watchlist", async (req, res) => {
    try {
      const schema = z.object({
        animeId: z.string(),
      });
      
      const { animeId } = schema.parse(req.body);
      
      // Check if anime exists
      const anime = await storage.getAnimeById(animeId);
      if (!anime) {
        return res.status(404).json({ error: "Anime not found" });
      }
      
      const watchlistItem = await storage.addToWatchlist({
        animeId,
        addedAt: new Date().toISOString(),
      });
      
      res.status(201).json(watchlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request body", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  // Remove from watchlist
  app.delete("/api/watchlist/:animeId", async (req, res) => {
    try {
      const { animeId } = req.params;
      const removed = await storage.removeFromWatchlist(animeId);
      
      if (!removed) {
        return res.status(404).json({ error: "Item not found in watchlist" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // Check if anime is in watchlist
  app.get("/api/watchlist/:animeId/check", async (req, res) => {
    try {
      const { animeId } = req.params;
      const isInWatchlist = await storage.isInWatchlist(animeId);
      res.json({ isInWatchlist });
    } catch (error) {
      res.status(500).json({ error: "Failed to check watchlist status" });
    }
  });

  return httpServer;
}
