import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Play,
  Home,
  Compass
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Compass },
    { href: "/watchlist", label: "Watchlist", icon: Heart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold text-lg md:text-xl hidden sm:block">
              AnimeStream<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-secondary/50 border-secondary focus:bg-background"
                data-testid="input-search"
              />
            </form>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-testid="button-mobile-search"
            >
              {isSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-mobile-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-foreground fill-current" />
                    </div>
                    <span className="font-bold text-lg">
                      AnimeStream<span className="text-primary">Hub</span>
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 ${
                            location === link.href
                              ? "bg-primary/10 text-primary"
                              : ""
                          }`}
                          data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-secondary/50 border-secondary focus:bg-background"
                autoFocus
                data-testid="input-mobile-search"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
