# dBridge- Artist Portfolio

A comprehensive artist portfolio website showcasing vintage jungle and electronic music releases, photography, merchandise, and philosophy content with a full-featured admin management system.

## Features

- **Music Showcase**: Displays music releases with streaming links, cover art, and track listings
- **Photography Portfolio**: Organized photo galleries with categories (Back Stage, People, Places)
- **Merchandise Store**: Product catalog with availability status and pricing
- **Philosophy Content**: Core pages for artistic philosophy and thoughts
- **Future Notes**: Event listings and upcoming announcements
- **Access Codes**: Exclusive content delivery system
- **Admin Portal**: Comprehensive content management with drag-and-drop reordering
- **Search Functionality**: Site-wide search across all content types
- **Dark/Light Mode**: Seamless theme switching with user preference persistence

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state
- **Drag & Drop**: @dnd-kit for admin reordering functionality

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd artist-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your PostgreSQL database URL in `.env`:
```
DATABASE_URL=your_postgresql_connection_string
```

5. Run database migrations:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Application entry point
├── server/                # Express backend application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database abstraction layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
├── uploads/               # File upload directory
└── package.json           # Dependencies and scripts
```

## Navigation

The site uses a minimalist navigation system with the following sections:

- **ECHO**: Music releases and tracks
- **VIEW**: Photography portfolio
- **FORM**: Merchandise catalog
- **CORE**: Philosophy and core content
- **NOTE**: Future events and announcements
- **CODE**: Access code verification
- **LOOK**: Site-wide search functionality

## Admin Portal

Access the admin portal at `/admin` to manage all content:

- Create, edit, and delete content across all sections
- Drag-and-drop reordering for all content types
- Search functionality within admin sections
- Image upload and file management
- Real-time content updates

## Deployment

The application is designed for deployment on platforms that support Node.js applications:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to 'production' for production deployment

## Contributing

This is a personal artist portfolio. For questions or collaboration inquiries, please contact through the website's contact form.

## License

All rights reserved. This portfolio and its contents are the intellectual property of Alexandra Chen.
