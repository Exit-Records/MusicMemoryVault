# Alexandra Chen - Artist Portfolio

## Overview

This is a full-stack artist portfolio application showcasing music releases and photography work. The application features a modern React frontend with a Node.js/Express backend, designed to display an artist's creative work across multiple decades and mediums.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, Vite for bundling, Tailwind CSS for styling
- **Backend**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM (actively using DatabaseStorage)
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Page Structure**: Multi-page application with dedicated pages for each section (Music, Photography, Merchandise, Philosophy, Future)
- **UI Components**: Comprehensive set of reusable components from Shadcn/ui
- **Styling**: Tailwind CSS with custom color scheme and responsive design
- **Data Fetching**: TanStack Query for API calls with proper error handling
- **Navigation**: Route-based navigation with minimizable menu bar and smooth animations

### Backend Architecture
- **API Design**: RESTful endpoints for music releases and photos
- **Data Layer**: Abstract storage interface with PostgreSQL database implementation
- **Route Structure**: Clean separation of concerns with dedicated route handlers
- **Error Handling**: Centralized error handling middleware

### Database Schema
Two main entities defined in Drizzle schema:
- **Music Releases**: Title, year, genre, description, cover image, streaming links
- **Photos**: Title, location, category, image URL, year

## Data Flow

1. **Client Requests**: Frontend components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and query parameters
3. **Storage Layer**: Abstracted storage interface allows for different implementations
4. **Response**: JSON data returned to client with proper error handling
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, TypeScript, Vite
- **UI Library**: Radix UI primitives with Shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: TanStack Query for server state
- **Utilities**: Date-fns, class-variance-authority, clsx

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Driver**: Neon serverless for PostgreSQL connection
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Deployment Strategy

The application is configured for deployment with:
- **Production Build**: Vite builds frontend assets to `dist/public`
- **Server Bundle**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend in production
- **Database**: Expects PostgreSQL connection via `DATABASE_URL` environment variable
- **Session Management**: Configured for PostgreSQL session storage

## Changelog

```
Changelog:
- July 04, 2025: Initial setup with artist portfolio structure
- July 04, 2025: Added comprehensive music linking system (Buy, Bandcamp, Nina Protocol, custom links)
- July 04, 2025: Migrated from in-memory storage to PostgreSQL database with Drizzle ORM
- July 04, 2025: Converted to multi-page application with dedicated pages for each section
- July 04, 2025: Added menu bar minimization functionality with smooth animations
- July 04, 2025: Updated photography categories to Back Stage, People, Places
- July 04, 2025: Fixed Discogs search to use actual artist names and release cover images
- July 04, 2025: Implemented seamless dark/light mode toggle with smooth transitions
- July 04, 2025: Updated dark mode to use pure black background with #F3EFE0 (light mode background) as text color per user specification
- July 04, 2025: Added catalog number and label fields to music releases with display on release cards and Excel template updates
- July 05, 2025: Fixed database connection issues with Neon PostgreSQL WebSocket configuration
- July 05, 2025: Added Core Pages and Note Pages content management system with full CRUD operations
- July 05, 2025: Expanded admin portal with 5 tabs: Music Releases, Tracks, Photos, Core Pages, Note Pages
- July 05, 2025: Added "events" category to Note Pages with event date, location, and ticket link fields
- July 05, 2025: Implemented comprehensive image upload functionality with local file hosting for all content types (Music releases, Photos, Core Pages, Note Pages)
- July 05, 2025: Added Merchandise management system with database schema, API endpoints, and admin portal tab
- July 05, 2025: Combined Music Releases and Tracks tabs into unified "Music & Tracks" tab with inline track addition functionality
- July 05, 2025: Renamed admin portal tabs to match page names: ECHO (Music), VIEW (Photos), FORM (Merchandise), CORE (Core Pages), NOTE (Note Pages)
- July 05, 2025: Added Code page with access code verification system for exclusive downloads, complete with database schema, API endpoints, admin management interface, and CODE navigation tab
- July 05, 2025: Implemented comprehensive edit functionality for releases, core pages, and note pages with full CRUD operations including update API endpoints, form state management, and intuitive UI controls
- July 05, 2025: Fixed Core page display by connecting philosophy sections to database instead of hardcoded content, removed all demo posts from View, Form, and Core sections, and eliminated sub-headings from all main pages for cleaner minimal design
- July 06, 2025: Added comprehensive search functionality across all admin portal sections with real-time filtering by title, content, category, and relevant fields for all content types
- July 06, 2025: Implemented site-wide search function with new "LOOK" navigation tab using magnifying glass icon, enabling search across music releases, photography, merchandise, philosophy, future notes, and access codes with categorized results display
- July 06, 2025: Added comprehensive drag-and-drop reordering functionality to all admin portal sections using @dnd-kit libraries, created reusable SortableList component with visual drag handles and smooth animations, implemented for music releases, photos, merchandise, core pages, note pages, and code entries
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Development Notes

- The application now uses PostgreSQL database with Drizzle ORM for data persistence
- Database schema includes expanded music release fields: Bandcamp, Nina Protocol, custom links, catalog numbers, and record labels
- The frontend includes comprehensive filtering for both music (by decade) and photos (by category)
- Music releases support multiple streaming platforms with customizable link ordering
- Responsive design ensures compatibility across desktop and mobile devices
- The application includes a lightbox component for photo viewing
- Contact form includes toast notifications for user feedback