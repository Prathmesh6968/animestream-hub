import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Play, 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  Film, 
  Building2,
  ChevronLeft,
  Share2,
  Languages
} from "lucide-react";
import type { Anime, Episode, WatchlistItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AnimeDetail() {
  const [match, params] = useRoute("/anime/:id");
  const { toast } = useToast();

  const { data: anime, isLoading } = useQuery<Anime>({
    queryKey: ["/api/anime", params?.id],
    enabled: !!params?.id,
  });

  const { data: episodes } = useQuery<Episode[]>({
    queryKey: ["/api/anime", params?.id, "episodes"],
    enabled: !!params?.id,
  });

  const { data: watchlist } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const isInWatchlist = watchlist?.some((item) => item.animeId === params?.id);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWatchlist) {
        return apiRequest("DELETE", `/api/watchlist/${params?.id}`);
      }
      return apiRequest("POST", "/api/watchlist", { animeId: params?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: isInWatchlist 
          ? "This anime has been removed from your watchlist"
          : "This anime has been added to your watchlist",
      });
    },
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: anime?.title,
          text: `Check out ${anime?.title} on AnimeStream Hub!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The anime link has been copied to your clipboard",
      });
    }
  };

  if (isLoading) {
    return <AnimeDetailSkeleton />;
  }

  if (!anime) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <Link href="/browse">
            <Button>Browse Anime</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${anime.bannerImage || anime.coverImage})` 
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link href="/browse">
            <Button variant="outline" size="sm" className="gap-1 bg-black/30 border-white/20 text-white hover:bg-black/50 backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-64 mx-auto lg:mx-0">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full aspect-[2/3] object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title & Actions */}
            <div className="mb-6">
              {anime.status && (
                <Badge 
                  className={`mb-3 ${
                    anime.status === "Ongoing" 
                      ? "bg-green-500/90 text-white" 
                      : anime.status === "Completed"
                      ? "bg-blue-500/90 text-white"
                      : "bg-orange-500/90 text-white"
                  }`}
                  data-testid="badge-detail-status"
                >
                  {anime.status}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white lg:text-foreground" data-testid="text-anime-title">
                {anime.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{anime.rating?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{anime.year}</span>
                </div>
                {anime.episodes && (
                  <div className="flex items-center gap-1">
                    <Film className="w-4 h-4" />
                    <span>{anime.episodes} Episodes</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{anime.duration}</span>
                  </div>
                )}
                {anime.studio && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{anime.studio}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Button size="lg" className="gap-2" data-testid="button-watch-now">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Button>
                <Button 
                  size="lg" 
                  variant={isInWatchlist ? "secondary" : "outline"}
                  className="gap-2"
                  onClick={() => toggleWatchlistMutation.mutate()}
                  disabled={toggleWatchlistMutation.isPending}
                  data-testid="button-toggle-watchlist"
                >
                  <Heart className={`w-5 h-5 ${isInWatchlist ? "fill-current text-accent" : ""}`} />
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button size="icon" variant="outline" onClick={handleShare} data-testid="button-share">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <Languages className="w-4 h-4" />
                <span>Available in: {anime.languages.join(", ")}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-synopsis">
                {anime.synopsis}
              </p>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {episodes && episodes.length > 0 && (
          <section className="mt-12 mb-16">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="grid gap-4">
              {episodes.map((episode) => (
                <Card 
                  key={episode.id} 
                  className="p-4 hover-elevate cursor-pointer"
                  data-testid={`episode-card-${episode.number}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-32 md:w-40 flex-shrink-0">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted">
                        {episode.thumbnail ? (
                          <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          EP {episode.number}
                        </Badge>
                        {episode.duration && (
                          <span className="text-xs text-muted-foreground">
                            {episode.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium truncate">{episode.title}</h3>
                    </div>

                    {/* Play Button */}
                    <Button size="icon" variant="ghost">
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* No Episodes Message */}
        {(!episodes || episodes.length === 0) && (
          <section className="mt-12 mb-16">
            <Card className="p-8 text-center">
              <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Episodes coming soon</h3>
              <p className="text-sm text-muted-foreground">
                Add this anime to your watchlist to get notified when episodes are available
              </p>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}

function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="h-[50vh] md:h-[60vh] bg-muted shimmer" />

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-48 md:w-64 aspect-[2/3] mx-auto lg:mx-0 rounded-lg" />
          </div>

          {/* Details Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex gap-3 mb-8">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-44" />
              <Skeleton className="h-12 w-12" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
