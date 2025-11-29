# AnimeStream Hub

## Overview

AnimeStream Hub is a modern anime streaming platform built as a full-stack web application. The platform allows users to discover, browse, and track anime series with features including a comprehensive watchlist, detailed anime information pages, filtering and search capabilities, and a responsive design optimized for both desktop and mobile devices.

The application follows a premium streaming service aesthetic, drawing inspiration from platforms like Netflix and Crunchyroll, while incorporating modern anime culture design elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, utilizing Wouter for client-side routing instead of React Router.

**Build System**: Vite is used as the development server and build tool, configured to serve the client application from the `client` directory and output production builds to `dist/public`.

**UI Component Library**: The application uses shadcn/ui components built on Radix UI primitives. This provides a comprehensive set of accessible, customizable components following the "New York" style variant. Components include dialogs, dropdowns, cards, badges, buttons, forms, and navigation elements.

**Styling**: Tailwind CSS handles all styling with a custom design system defined in `client/src/index.css`. The design uses CSS custom properties for theming, supporting both light and dark modes. The color palette is centered around purple primary colors (265° hue) with accent colors in pink/red tones.

**State Management**: TanStack Query (React Query) manages all server state, handling data fetching, caching, and synchronization. The query client is configured with disabled refetching on window focus and infinite stale time for aggressive caching.

**Typography**: The design system uses Plus Jakarta Sans and Poppins as primary fonts, loaded from Google Fonts, with specific hierarchies defined in the design guidelines for headers, body text, and UI elements.

**Theme System**: A custom theme provider component manages light/dark mode preferences, stored in localStorage with system preference detection.

### Backend Architecture

**Server Framework**: Express.js serves as the HTTP server, handling both API routes and static file serving in production.

**API Design**: RESTful API endpoints are organized in `server/routes.ts`:
- `GET /api/anime` - Retrieve all anime
- `GET /api/anime/:id` - Get single anime details
- `GET /api/anime/:id/episodes` - Fetch episodes for an anime
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add anime to watchlist
- `DELETE /api/watchlist/:id` - Remove anime from watchlist

**Data Storage**: Currently using an in-memory storage implementation (`MemStorage` class in `server/storage.ts`) that maintains data in JavaScript Maps. This provides a clear interface (`IStorage`) that can be swapped with a database implementation without changing the API layer.

**Development Mode**: In development, Vite middleware is integrated into Express via `server/vite.ts`, enabling hot module replacement (HMR) and instant feedback during development.

**Production Build**: The build process (defined in `script/build.ts`) uses esbuild to bundle the server code and Vite to build the client. Server dependencies are selectively bundled based on an allowlist to optimize cold start times.

### Data Model

**Database Schema**: Defined in `shared/schema.ts` using Drizzle ORM with PostgreSQL dialect. The schema includes:

- **Users Table**: Stores user authentication data (id, username, password)
- **Anime Table**: Contains anime metadata including title, synopsis, cover/banner images, rating, year, status, type, episode count, genres array, languages array, studio, and duration
- **Episodes Table**: Stores individual episode data linked to anime via `animeId`, including episode number, title, thumbnail, duration, and video URL
- **Watchlist Table**: Junction table tracking which anime users have added to their watchlist

**Validation**: Zod schemas generated from Drizzle schemas using `drizzle-zod` provide runtime validation for API inputs and type safety.

### Design System

**Component Patterns**: The application follows a card-based layout pattern with hover effects, gradient overlays, and elevation shadows. Anime cards use aspect ratio 2:3 for consistency.

**Responsive Design**: Mobile-first approach with breakpoints defined in Tailwind config. The navigation collapses to a drawer menu on mobile devices, and grid layouts adjust from 2 columns on mobile to 6 columns on large desktops.

**Spacing System**: Uses Tailwind's spacing scale (4, 6, 8, 12, 16, 20, 24) consistently throughout the application for padding, margins, and gaps.

**Animation**: Smooth transitions on hover states, page transitions, and component animations using CSS transitions and Tailwind's animation utilities.

## External Dependencies

### UI Framework & Components
- **@radix-ui/react-***: Comprehensive collection of unstyled, accessible UI primitives (accordion, dialog, dropdown, select, etc.)
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality
- **lucide-react**: Icon library

### State & Data Management
- **@tanstack/react-query**: Server state management and data synchronization
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation
- **drizzle-zod**: Drizzle-to-Zod schema conversion

### Database & ORM
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-kit**: Database migration toolkit
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver (configured but not actively used with current in-memory storage)

### Styling
- **tailwindcss**: Utility-first CSS framework
- **tailwind-merge**: Utility for merging Tailwind classes
- **clsx**: Conditional class name utility
- **autoprefixer**: PostCSS plugin for vendor prefixes

### Routing & Navigation
- **wouter**: Lightweight client-side routing library

### Build Tools
- **vite**: Frontend build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite
- **esbuild**: JavaScript bundler for server code
- **typescript**: Type system and compiler

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development plugins (error modal, cartographer, dev banner)
- **tsx**: TypeScript execution engine for development

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation

### Session & Authentication (Configured but not fully implemented)
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store
- **memorystore**: In-memory session store alternative

The application is designed to scale from the current in-memory storage to a full PostgreSQL database by implementing the `IStorage` interface with a database-backed class, without requiring changes to the API layer or client code.