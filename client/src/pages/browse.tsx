import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import type { Anime, WatchlistItem } from "@shared/schema";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mystery", "Romance", "Sci-Fi", "School",
  "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const YEARS = Array.from({ length: 10 }, (_, i) => (2025 - i).toString());

const STATUSES = ["Ongoing", "Completed", "Upcoming"];

const LANGUAGES = ["Japanese", "English", "Hindi", "Tamil", "Telugu"];

export default function Browse() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  
  const params = new URLSearchParams(searchParams);
  
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(params.get("genre") || "");
  const [selectedYear, setSelectedYear] = useState(params.get("year") || "");
  const [selectedStatus, setSelectedStatus] = useState(params.get("status") || "");
  const [selectedLanguage, setSelectedLanguage] = useState(params.get("language") || "");
  const [sortBy, setSortBy] = useState(params.get("sort") || "latest");

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedStatus) params.set("status", selectedStatus);
    if (selectedLanguage) params.set("language", selectedLanguage);
    if (sortBy !== "latest") params.set("sort", sortBy);
    return params.toString();
  };

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedGenre && selectedGenre !== "all") params.set("genre", selectedGenre);
    if (selectedYear && selectedYear !== "all") params.set("year", selectedYear);
    if (selectedStatus && selectedStatus !== "all") params.set("status", selectedStatus);
    if (selectedLanguage && selectedLanguage !== "all") params.set("language", selectedLanguage);
    if (sortBy) params.set("sort", sortBy);
    const queryStr = params.toString();
    return queryStr ? `/api/anime?${queryStr}` : "/api/anime";
  };

  const { data: animeList, isLoading } = useQuery<Anime[]>({
    queryKey: [buildApiUrl()],
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

  useEffect(() => {
    const queryString = buildQueryString();
    setLocation(queryString ? `/browse?${queryString}` : "/browse", { replace: true });
  }, [searchQuery, selectedGenre, selectedYear, selectedStatus, selectedLanguage, sortBy]);

  // Data is already filtered and sorted by the backend
  const filteredAnime = animeList || [];

  const activeFiltersCount = [selectedGenre, selectedYear, selectedStatus, selectedLanguage].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedStatus("");
    setSelectedLanguage("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Genre Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Genre</label>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger data-testid="select-genre">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {GENRES.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Year</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger data-testid="select-year">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger data-testid="select-status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Language</label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger data-testid="select-language">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Anime</h1>
          <p className="text-muted-foreground">
            Discover from our collection of anime titles
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-card rounded-lg border border-card-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-browse-search"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedGenre && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedGenre}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedGenre("")}
                    />
                  </Badge>
                )}
                {selectedYear && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedYear}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedYear("")}
                    />
                  </Badge>
                )}
                {selectedStatus && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedStatus}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedStatus("")}
                    />
                  </Badge>
                )}
                {selectedLanguage && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLanguage}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedLanguage("")}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              {isLoading ? "Loading..." : `${filteredAnime.length} anime found`}
            </p>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredAnime.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    isInWatchlist={watchlistIds.has(anime.id)}
                    onToggleWatchlist={(id) => addToWatchlistMutation.mutate(id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No anime found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} data-testid="button-clear-filters-empty">
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
