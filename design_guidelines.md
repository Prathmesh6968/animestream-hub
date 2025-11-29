# AnimeStream Hub - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium streaming platforms (Netflix, Crunchyroll, Hulu) combined with modern anime culture aesthetics. Focus on immersive visual experience with rich imagery and effortless content discovery.

## Typography

**Font Families**:
- Primary: 'Inter' or 'Plus Jakarta Sans' for UI elements and body text
- Display: 'Poppins' or 'Outfit' for headings and hero text (bold, modern)

**Hierarchy**:
- Hero Headline: 3xl to 5xl (mobile to desktop), font-weight 700-800
- Section Headers: 2xl to 3xl, font-weight 700
- Card Titles: base to lg, font-weight 600
- Metadata (year, genre, language): sm to base, font-weight 400-500
- Body Text: base, font-weight 400
- Badges/Labels: xs to sm, font-weight 500-600, uppercase tracking-wide

## Spacing System

**Tailwind Units**: Use 4, 6, 8, 12, 16, 20, 24 as primary spacing values
- Component padding: p-4 to p-6
- Section vertical spacing: py-12 (mobile), py-20 to py-24 (desktop)
- Card gaps: gap-4 to gap-6
- Content containers: max-w-7xl with px-4 to px-8

## Layout Structure

### Homepage
1. **Navigation Bar**: Fixed/sticky header with logo left, search center, profile/watchlist icons right. Height h-16 to h-20
2. **Hero Section**: 70vh to 85vh full-width with featured anime background, gradient overlay, centered CTA buttons with blur-background effect
3. **Featured Anime Grid**: 6 cards in responsive grid (grid-cols-2 md:grid-cols-3 lg:grid-cols-6), horizontal scroll on mobile
4. **Trending Section**: Horizontal scrollable row with 5 visible cards, smooth scroll-snap behavior
5. **Additional Sections**: "Recently Added", "Popular This Season", each with 4-6 cards in grid layout

### Browse Page
- Filter sidebar (fixed left on desktop, drawer on mobile): w-64 with genre, year, status, language filters
- Main grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 with infinite scroll
- Sort dropdown top-right (Latest, Popular, Rating, A-Z)

### Anime Detail Page
- Full-width hero banner (40vh to 50vh) with anime backdrop image, gradient overlay
- Content split: 2-column layout (poster + metadata left, synopsis + details right) on desktop
- Episode list: Vertical list with thumbnails, episode numbers, titles, duration
- Related anime carousel at bottom

## Component Library

### Anime Card
- Aspect ratio 2:3 (portrait poster)
- Hover: subtle scale (scale-105), brightness increase
- Elements: poster image, overlay gradient on hover, "Watch Now" button (appears on hover with blur-background), status badge (top-right corner), title overlay (bottom), rating stars, year, language pills (xs badges), genre tags (max 2 visible)

### Buttons
- Primary CTA: Large (px-8 py-4), rounded-full or rounded-lg, font-weight 600
- Secondary: Outlined variant
- Icon buttons: Circular (h-10 w-10 to h-12 w-12) for watchlist/favorites
- Blur-background buttons on images: backdrop-blur-md with semi-transparent background

### Badges & Pills
- Status badges: rounded-full, px-3 py-1, text-xs, positioned absolute top-2 right-2
- Genre tags: rounded-md, px-2 py-1, text-xs
- Language pills: rounded-full, px-2 py-0.5, text-2xs

### Navigation
- Sticky header with subtle shadow on scroll
- Search bar: Expandable on click (mobile), persistent (desktop), rounded-full with icon
- Mobile: Hamburger menu with slide-out drawer

### Watchlist
- Grid layout matching browse page
- Empty state: Centered illustration with CTA to browse
- Remove button: Appears on card hover

## Images

**Hero Section**: Yes - Large full-width hero image
- Featured anime backdrop (landscape orientation, high quality)
- Darkened gradient overlay (top-to-bottom or radial from center)
- Minimum height: 70vh on desktop, 60vh on mobile

**Anime Posters**: Placeholder images from MyAnimeList CDN or similar
- Aspect ratio: 2:3 portrait
- Use lazy loading for performance
- Fallback: Gradient placeholder with anime title text

**Background Patterns**: Subtle dotted grid or anime-inspired patterns in header/footer areas for depth

## Special Features

**Horizontal Scroll Sections**: 
- Use scroll-snap-x for smooth card-to-card scrolling
- Show partial next card to indicate more content
- Hide scrollbar but maintain functionality

**Loading States**:
- Skeleton screens matching card layouts
- Shimmer animation effect

**Responsive Behavior**:
- Mobile: Single column hero, 2-column grids, bottom navigation
- Tablet: 3-column grids, persistent top navigation
- Desktop: 4-6 column grids, sidebar filters, sticky navigation

**Micro-interactions**:
- Smooth transitions (duration-300)
- Card hover effects
- Button press states (active:scale-95)
- Watchlist heart animation on add/remove