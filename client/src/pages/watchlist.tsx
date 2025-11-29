import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Play, Compass } from "lucide-react";
import type { Anime, WatchlistItem } from "@shared/schema";

export default function Watchlist() {
  const { data: watchlist, isLoading: watchlistLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const { data: animeList, isLoading: animeLoading } = useQuery<Anime[]>({
    queryKey: ["/api/anime"],
  });

  const isLoading = watchlistLoading || animeLoading;

  const watchlistIds = new Set(watchlist?.map((item) => item.animeId) || []);
  
  const watchlistAnime = animeList?.filter((anime) => 
    watchlistIds.has(anime.id)
  ) || [];

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (animeId: string) => {
      return apiRequest("DELETE", `/api/watchlist/${animeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
  });

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-accent fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
          </div>
          <p className="text-muted-foreground">
            {isLoading 
              ? "Loading your watchlist..." 
              : `${watchlistAnime.length} anime in your watchlist`}
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : watchlistAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlistAnime.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                isInWatchlist={true}
                onToggleWatchlist={(id) => removeFromWatchlistMutation.mutate(id)}
                showRemoveButton
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding anime to your watchlist by clicking the heart icon on any anime card
            </p>
            <Link href="/browse">
              <Button size="lg" className="gap-2" data-testid="button-browse-empty">
                <Compass className="w-5 h-5" />
                Browse Anime
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        {watchlistAnime.length > 0 && (
          <div className="mt-12 p-6 bg-card rounded-lg border border-card-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Continue watching?</h3>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off with your favorite anime
                </p>
              </div>
              <Link href={`/anime/${watchlistAnime[0]?.id}`}>
                <Button className="gap-2" data-testid="button-continue-watching">
                  <Play className="w-4 h-4 fill-current" />
                  Watch Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
