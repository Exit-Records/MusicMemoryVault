# GitHub Repository Setup Guide

This guide helps you set up the Alexandra Chen Artist Portfolio on GitHub and prepare it for deployment.

## Initial Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Create a new repository on GitHub, then:
   git init
   git add .
   git commit -m "Initial commit: Artist portfolio with admin portal and drag-and-drop functionality"
   git branch -M main
   git remote add origin https://github.com/username/artist-portfolio.git
   git push -u origin main
   ```

2. **Configure Repository Settings**
   - Go to repository Settings
   - Enable Issues and Projects if needed
   - Set up branch protection rules for main branch
   - Configure security alerts and updates

## Environment Variables for GitHub Actions

Add these secrets in GitHub repository settings (Settings > Secrets and variables > Actions):

### For Railway Deployment
- `RAILWAY_TOKEN`: Your Railway API token
- `RAILWAY_SERVICE`: Your Railway service ID

### For Heroku Deployment
- `HEROKU_API_KEY`: Your Heroku API key
- `HEROKU_APP_NAME`: Your Heroku app name
- `HEROKU_EMAIL`: Your Heroku account email

### For Vercel Deployment
- `VERCEL_TOKEN`: Your Vercel token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

## Repository Structure

After setup, your repository will include:

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── client/                     # Frontend React app
├── server/                     # Backend Express app
├── shared/                     # Shared TypeScript types
├── uploads/                    # File upload directory
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Container configuration
├── docker-compose.yml         # Local development with Docker
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Deployment instructions
├── CONTRIBUTING.md            # Development guidelines
└── package.json               # Dependencies and scripts
```

## Deployment Options

### 1. Automatic Deployment (Recommended)
- GitHub Actions automatically deploy on push to main
- Configure your preferred platform in `.github/workflows/deploy.yml`
- Uncomment the relevant deployment step

### 2. Manual Deployment
- Use the deployment guides in `DEPLOYMENT.md`
- Follow platform-specific instructions

## Database Setup

### Development
- Use local PostgreSQL or Docker
- Copy `.env.example` to `.env` and configure

### Production
- Set up PostgreSQL database on your chosen platform
- Configure `DATABASE_URL` environment variable
- Run `npm run db:push` to create tables

## Security Checklist

- [ ] Add `.env` to `.gitignore` (already included)
- [ ] Set strong `SESSION_SECRET` in production
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS in production
- [ ] Set up regular database backups
- [ ] Configure error monitoring (Sentry, etc.)

## Post-Deployment Steps

1. **Test the deployment**
   - Verify all pages load correctly
   - Test admin portal functionality
   - Confirm file uploads work
   - Test drag-and-drop reordering

2. **Configure domain (if using custom domain)**
   - Set up DNS records
   - Configure SSL certificate
   - Update CORS settings if needed

3. **Monitor the application**
   - Set up uptime monitoring
   - Configure log aggregation
   - Monitor performance metrics

## Backup Strategy

### Database Backups
- Set up automated daily backups
- Test restore procedures
- Store backups securely off-site

### File Backups
- Backup uploaded files regularly
- Consider cloud storage for uploads
- Implement file versioning if needed

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version and dependencies
2. **Database connection**: Verify DATABASE_URL format
3. **File uploads**: Ensure uploads directory exists and is writable
4. **Environment variables**: Double-check all required variables are set

### Getting Help
- Check GitHub Issues for known problems
- Review deployment logs for error details
- Consult platform-specific documentation