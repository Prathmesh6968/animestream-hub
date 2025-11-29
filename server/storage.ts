import { 
  type User, 
  type InsertUser, 
  type Anime, 
  type InsertAnime,
  type Episode,
  type InsertEpisode,
  type WatchlistItem,
  type InsertWatchlist
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAnime(): Promise<Anime[]>;
  getAnimeById(id: string): Promise<Anime | undefined>;
  createAnime(anime: InsertAnime): Promise<Anime>;
  
  getEpisodesByAnimeId(animeId: string): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(watchlist: InsertWatchlist): Promise<WatchlistItem>;
  removeFromWatchlist(animeId: string): Promise<boolean>;
  isInWatchlist(animeId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private anime: Map<string, Anime>;
  private episodes: Map<string, Episode>;
  private watchlist: Map<string, WatchlistItem>;

  constructor() {
    this.users = new Map();
    this.anime = new Map();
    this.episodes = new Map();
    this.watchlist = new Map();
    
    this.seedAnimeData();
  }

  private seedAnimeData() {
    const animeData: InsertAnime[] = [
      {
        title: "Eiyuuou, Bu wo Kiwameru Tame Tenseisu: Soshite, Sekai Saikyou no Minarai Kishi",
        synopsis: "In his past life, the king who led humanity to victory against the demons by completely mastering the art of combat came to be known as the God of War. After dying of old age, he is reborn as a humble squire apprentice named Inglis. This is his story of reliving his life to pursue martial arts to the extreme.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1044/129594l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1044/129594l.jpg",
        rating: 7.8,
        year: 2025,
        status: "Ongoing",
        type: "TV",
        episodes: 12,
        genres: ["Action", "Fantasy"],
        languages: ["Hindi", "Japanese"],
        studio: "Studio Blanc",
        duration: "24 min"
      },
      {
        title: "May I Ask for One Final Thing?",
        synopsis: "Scarlet El Vandimion is a duke's daughter engaged to the prince. However, the prince has fallen for another woman and decides to break off their engagement in front of the royal court. Rather than crying about it, Scarlet punches the cheating prince and goes on a rampage!",
        coverImage: "https://cdn.myanimelist.net/images/anime/1190/151754l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1190/151754l.jpg",
        rating: 7.5,
        year: 2025,
        status: "Ongoing",
        type: "TV",
        episodes: 12,
        genres: ["Action", "Comedy"],
        languages: ["Hindi", "English", "Japanese"],
        studio: "GEEKTOYS",
        duration: "24 min"
      },
      {
        title: "Let This Grieving Soul Retire",
        synopsis: "After dying in an accident, a young man is reincarnated into a fantasy world. Now living as Krai Andrey, he becomes the leader of the strongest party of adventurers. The only problem? His party members are all overpowered while he's completely average!",
        coverImage: "https://cdn.myanimelist.net/images/anime/1651/152063l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1651/152063l.jpg",
        rating: 7.2,
        year: 2025,
        status: "Ongoing",
        type: "TV",
        episodes: 12,
        genres: ["Action", "Adventure"],
        languages: ["Hindi", "Japanese"],
        studio: "Zero-G",
        duration: "24 min"
      },
      {
        title: "Koukaku Kidoutai Arise: Ghost in the Shell - Border:1 Ghost Pain",
        synopsis: "Set in the year 2027, one year before the formation of Public Security Section 9. Major Motoko Kusanagi is still part of the military, investigating a series of mysterious attacks.",
        coverImage: "https://cdn.myanimelist.net/images/anime/8/46673l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/8/46673l.jpg",
        rating: 8.1,
        year: 2025,
        status: "Completed",
        type: "Movie",
        episodes: 1,
        genres: ["Action", "Mystery"],
        languages: ["Hindi", "Japanese"],
        studio: "Production I.G",
        duration: "1 hr 58 min"
      },
      {
        title: "Doraemon Movie 43: Nobita no Chikyuu Symphony",
        synopsis: "When Nobita finds a mysterious door in his backyard, he and his friends are transported to a musical wonderland where they must save the Earth through the power of music.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1009/140131l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1009/140131l.jpg",
        rating: 7.9,
        year: 2025,
        status: "Completed",
        type: "Movie",
        episodes: 1,
        genres: ["Action", "Adventure"],
        languages: ["Hindi", "Tamil", "Telugu", "Japanese"],
        studio: "Shin-Ei Animation",
        duration: "1 hr 55 min"
      },
      {
        title: "Jujutsu Kaisen S1",
        synopsis: "Yuji Itadori is an unnaturally fit high school student living in Sendai. When he encounters a cursed object and swallows it, he becomes the host of Sukuna, the King of Curses.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
        rating: 8.7,
        year: 2020,
        status: "Completed",
        type: "TV",
        episodes: 24,
        genres: ["Action", "School"],
        languages: ["Hindi", "Japanese"],
        studio: "MAPPA",
        duration: "24 min"
      },
      {
        title: "Gachiakuta",
        synopsis: "Rudo lives in the slums and has been falsely accused of murder. He is thrown into the Abyss, a garbage dump underneath the floating city where monsters roam. Armed with nothing but his wits and a mysterious power, he must survive.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1682/150432l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1682/150432l.jpg",
        rating: 7.6,
        year: 2025,
        status: "Ongoing",
        type: "TV",
        episodes: 24,
        genres: ["Action", "Fantasy"],
        languages: ["Hindi", "Tamil", "Telugu", "English", "Japanese"],
        studio: "Bones",
        duration: "24 min"
      },
      {
        title: "Toujima Tanzaburou wa Kamen Rider ni Naritai",
        synopsis: "Tanzaburou Toujima is a superhero otaku who dreams of becoming a Kamen Rider. When he suddenly gains superpowers, his dream might finally come true!",
        coverImage: "https://cdn.myanimelist.net/images/anime/1455/152139l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1455/152139l.jpg",
        rating: 7.3,
        year: 2025,
        status: "Ongoing",
        type: "TV",
        episodes: 12,
        genres: ["Action", "Comedy"],
        languages: ["Hindi", "Japanese"],
        studio: "Pierrot",
        duration: "24 min"
      },
      {
        title: "Attack on Titan: The Final Season",
        synopsis: "Eren Yeager and the Survey Corps continue their fight against the Titans and uncover the truth about their world and the enemies that lurk beyond the walls.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1948/120625l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1948/120625l.jpg",
        rating: 9.1,
        year: 2022,
        status: "Completed",
        type: "TV",
        episodes: 16,
        genres: ["Action", "Drama", "Fantasy"],
        languages: ["English", "Japanese", "Hindi"],
        studio: "MAPPA",
        duration: "24 min"
      },
      {
        title: "Demon Slayer: Kimetsu no Yaiba",
        synopsis: "Tanjiro Kamado's family is slaughtered by demons, and his sister Nezuko is turned into one. He joins the Demon Slayer Corps to find a cure for his sister and avenge his family.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
        rating: 8.5,
        year: 2019,
        status: "Completed",
        type: "TV",
        episodes: 26,
        genres: ["Action", "Supernatural", "Fantasy"],
        languages: ["English", "Japanese", "Hindi", "Tamil"],
        studio: "ufotable",
        duration: "24 min"
      },
      {
        title: "One Punch Man",
        synopsis: "Saitama is a hero who can defeat any enemy with a single punch. The downside? He's become so powerful that he's bored with his incredible strength.",
        coverImage: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
        rating: 8.5,
        year: 2015,
        status: "Completed",
        type: "TV",
        episodes: 12,
        genres: ["Action", "Comedy", "Sci-Fi"],
        languages: ["English", "Japanese"],
        studio: "Madhouse",
        duration: "24 min"
      },
      {
        title: "My Hero Academia Season 7",
        synopsis: "The final war between heroes and villains reaches its climax as Deku and his classmates face off against Shigaraki and the Paranormal Liberation Front.",
        coverImage: "https://cdn.myanimelist.net/images/anime/1764/141938l.jpg",
        bannerImage: "https://cdn.myanimelist.net/images/anime/1764/141938l.jpg",
        rating: 8.0,
        year: 2024,
        status: "Completed",
        type: "TV",
        episodes: 21,
        genres: ["Action", "School", "Supernatural"],
        languages: ["English", "Japanese", "Hindi"],
        studio: "Bones",
        duration: "24 min"
      }
    ];

    animeData.forEach((anime) => {
      const id = randomUUID();
      this.anime.set(id, { ...anime, id });
    });

    const animeIds = Array.from(this.anime.keys());
    
    animeIds.forEach((animeId) => {
      const anime = this.anime.get(animeId);
      if (anime && anime.type === "TV" && anime.episodes) {
        const episodeCount = Math.min(anime.episodes, 5);
        for (let i = 1; i <= episodeCount; i++) {
          const episodeId = randomUUID();
          this.episodes.set(episodeId, {
            id: episodeId,
            animeId,
            number: i,
            title: `Episode ${i}`,
            thumbnail: anime.coverImage,
            duration: "24 min",
            videoUrl: null
          });
        }
      }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAnime(): Promise<Anime[]> {
    return Array.from(this.anime.values());
  }

  async getAnimeById(id: string): Promise<Anime | undefined> {
    return this.anime.get(id);
  }

  async createAnime(insertAnime: InsertAnime): Promise<Anime> {
    const id = randomUUID();
    const anime: Anime = { ...insertAnime, id };
    this.anime.set(id, anime);
    return anime;
  }

  async getEpisodesByAnimeId(animeId: string): Promise<Episode[]> {
    return Array.from(this.episodes.values())
      .filter((ep) => ep.animeId === animeId)
      .sort((a, b) => a.number - b.number);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = randomUUID();
    const episode: Episode = { ...insertEpisode, id };
    this.episodes.set(id, episode);
    return episode;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values());
  }

  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<WatchlistItem> {
    const existing = Array.from(this.watchlist.values()).find(
      (item) => item.animeId === insertWatchlist.animeId
    );
    if (existing) {
      return existing;
    }
    
    const id = randomUUID();
    const watchlistItem: WatchlistItem = { ...insertWatchlist, id };
    this.watchlist.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(animeId: string): Promise<boolean> {
    const item = Array.from(this.watchlist.entries()).find(
      ([, value]) => value.animeId === animeId
    );
    if (item) {
      this.watchlist.delete(item[0]);
      return true;
    }
    return false;
  }

  async isInWatchlist(animeId: string): Promise<boolean> {
    return Array.from(this.watchlist.values()).some(
      (item) => item.animeId === animeId
    );
  }
}

export const storage = new MemStorage();
