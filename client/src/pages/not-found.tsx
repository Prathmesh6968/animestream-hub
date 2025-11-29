import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 md:pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for seems to have wandered off to another dimension. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-go-home">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/browse">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-browse">
              <Search className="w-5 h-5" />
              Browse Anime
            </Button>
          </Link>
        </div>

        {/* Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto transition-colors"
          data-testid="button-go-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
