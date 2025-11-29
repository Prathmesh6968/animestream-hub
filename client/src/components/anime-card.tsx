import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Play, Star, X } from "lucide-react";
import type { Anime } from "@shared/schema";

interface AnimeCardProps {
  anime: Anime;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (animeId: string) => void;
  showRemoveButton?: boolean;
}

export function AnimeCard({ 
  anime, 
  isInWatchlist = false, 
  onToggleWatchlist,
  showRemoveButton = false
}: AnimeCardProps) {
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWatchlist?.(anime.id);
  };

  return (
    <Link href={`/anime/${anime.id}`}>
      <div 
        className="group relative overflow-hidden rounded-lg bg-card border border-card-border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
        data-testid={`anime-card-${anime.id}`}
      >
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={anime.coverImage}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 anime-card-overlay opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Status Badge */}
          {anime.status && (
            <Badge 
              variant="secondary"
              className={`absolute top-2 right-2 text-xs font-medium ${
                anime.status === "Ongoing" 
                  ? "bg-green-500/90 text-white border-green-400" 
                  : anime.status === "Completed"
                  ? "bg-blue-500/90 text-white border-blue-400"
                  : "bg-orange-500/90 text-white border-orange-400"
              }`}
              data-testid={`badge-status-${anime.id}`}
            >
              {anime.status}
            </Badge>
          )}

          {/* Watchlist Button - visible on hover or if in watchlist */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 left-2 transition-all duration-300 backdrop-blur-sm ${
              isInWatchlist 
                ? "opacity-100 bg-accent/90 text-accent-foreground" 
                : "opacity-0 group-hover:opacity-100 bg-black/50 text-white hover:bg-black/70"
            }`}
            onClick={handleWatchlistClick}
            data-testid={`button-watchlist-${anime.id}`}
          >
            <Heart className={`w-4 h-4 ${isInWatchlist ? "fill-current" : ""}`} />
          </Button>

          {/* Remove button for watchlist page */}
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
              onClick={handleWatchlistClick}
              data-testid={`button-remove-${anime.id}`}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {/* Watch Now Button - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              className="gap-2 bg-primary/90 hover:bg-primary backdrop-blur-sm"
              data-testid={`button-watch-${anime.id}`}
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </Button>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {/* Title */}
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2" data-testid={`title-${anime.id}`}>
              {anime.title}
            </h3>

            {/* Rating & Year */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-white text-xs font-medium">
                  {anime.rating?.toFixed(1) || "N/A"}
                </span>
              </div>
              <span className="text-white/70 text-xs">{anime.year}</span>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-1 mb-2">
              {anime.languages.slice(0, 3).map((lang, i) => (
                <span 
                  key={i} 
                  className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  {lang}
                </span>
              ))}
              {anime.languages.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-sm">
                  +{anime.languages.length - 3}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 2).map((genre, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-[10px] py-0 h-5 bg-transparent border-white/30 text-white"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-card-border">
      <div className="aspect-[2/3] shimmer" />
    </div>
  );
}
