import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Play, Heart, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import type { Anime, WatchlistItem } from "@shared/schema";

export default function Home() {
  const { data: animeList, isLoading } = useQuery<Anime[]>({
    queryKey: ["/api/anime"],
  });

  const { data: watchlist } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const watchlistIds = new Set(watchlist?.map((item) => item.animeId) || []);

  const addToWatchlistMutation = useMutation({
    mutationFn: async (animeId: string) => {
      if (watchlistIds.has(animeId)) {
        return apiRequest("DELETE", `/api/watchlist/${animeId}`);
      }
      return apiRequest("POST", "/api/watchlist", { animeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
  });

  const featuredAnime = animeList?.slice(0, 6) || [];
  const trendingAnime = animeList?.filter((a) => a.status === "Ongoing").slice(0, 5) || [];
  const heroAnime = animeList?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden">
        {/* Background Image */}
        {heroAnime ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroAnime.bannerImage || heroAnime.coverImage})` 
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                AnimeStream Hub
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              Discover, watch, and track your favorite anime series all in one place
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/browse">
                <Button size="lg" className="gap-2 text-base px-8" data-testid="button-browse-hero">
                  <Play className="w-5 h-5 fill-current" />
                  Browse Anime
                </Button>
              </Link>
              <Link href="/watchlist">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-base px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  data-testid="button-watchlist-hero"
                >
                  <Heart className="w-5 h-5" />
                  My Watchlist
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Anime Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Featured Anime</h2>
          </div>
          <Link href="/browse">
            <Button variant="ghost" className="gap-1" data-testid="link-view-all-featured">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))
            : featuredAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  isInWatchlist={watchlistIds.has(anime.id)}
                  onToggleWatchlist={(id) => addToWatchlistMutation.mutate(id)}
                />
              ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <Link href="/browse?status=Ongoing">
            <Button variant="ghost" className="gap-1" data-testid="link-view-all-trending">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative -mx-4 px-4">
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-snap-x pb-4">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] scroll-snap-start">
                    <AnimeCardSkeleton />
                  </div>
                ))
              : trendingAnime.map((anime) => (
                  <div key={anime.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] scroll-snap-start">
                    <AnimeCard
                      anime={anime}
                      isInWatchlist={watchlistIds.has(anime.id)}
                      onToggleWatchlist={(id) => addToWatchlistMutation.mutate(id)}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Recently Added</h2>
          <Link href="/browse?sort=latest">
            <Button variant="ghost" className="gap-1" data-testid="link-view-all-recent">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))
            : animeList?.slice(0, 5).map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  isInWatchlist={watchlistIds.has(anime.id)}
                  onToggleWatchlist={(id) => addToWatchlistMutation.mutate(id)}
                />
              ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground fill-current" />
              </div>
              <span className="font-bold">
                AnimeStream<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              Your ultimate destination for anime streaming
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
