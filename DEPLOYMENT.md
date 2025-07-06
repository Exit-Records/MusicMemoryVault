# Deployment Guide

This document provides instructions for deploying the Alexandra Chen Artist Portfolio to various platforms.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Environment variables configured

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret
```

## Building the Application

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

This creates:
- `dist/public/` - Frontend build files
- `dist/index.js` - Backend server bundle

## Deployment Options

### 1. Railway

Railway provides easy PostgreSQL and Node.js deployment:

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect and build your Node.js app
4. Database URL will be provided automatically

Deploy command: `npm start`

### 2. Vercel (Frontend) + Railway/Supabase (Backend)

For separate frontend/backend deployment:

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/public`

**Backend (Railway):**
1. Deploy backend separately
2. Update frontend API calls to point to backend URL

### 3. Heroku

1. Create Heroku app
2. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:hobby-dev`
3. Set environment variables: `heroku config:set NODE_ENV=production`
4. Deploy: `git push heroku main`

### 4. DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Add PostgreSQL database
4. Configure environment variables

### 5. Self-Hosted (Ubuntu/CentOS)

1. Install Node.js and PostgreSQL
2. Clone repository and build
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/index.js --name "artist-portfolio"
pm2 startup
pm2 save
```
4. Configure nginx reverse proxy (optional)

## Database Setup

1. Create PostgreSQL database
2. Run migrations:
```bash
npm run db:push
```

## File Uploads

The application stores uploaded files in the `uploads/` directory. For production:

1. Ensure the `uploads/` directory exists and is writable
2. Consider using cloud storage (AWS S3, Cloudinary) for scalability
3. Update file upload logic in `server/routes.ts` if using cloud storage

## Security Considerations

1. Set strong `SESSION_SECRET`
2. Use HTTPS in production
3. Configure CORS appropriately
4. Regularly update dependencies
5. Backup database regularly

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)
- Log aggregation (Logtail)

## Scaling

For high traffic:
1. Use CDN for static assets
2. Implement Redis for session storage
3. Add database read replicas
4. Use load balancer for multiple app instances