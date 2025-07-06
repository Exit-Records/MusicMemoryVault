# How to Upload Music Releases and Photos

## Method 1: Using the Upload Scripts (Recommended)

### Adding Music Releases

1. **Prepare your album cover images**
   - Upload images to a hosting service like:
     - Cloudinary
     - AWS S3
     - Google Drive (public links)
     - Imgur
     - Any image hosting service with direct URLs

2. **Edit the add-release script**
   - Open `server/add-release.ts`
   - Replace the example data with your actual releases
   - For each release, you can include:
     - **Required**: title, year, genre, description, coverImage
     - **Optional**: spotifyUrl, appleUrl, buyUrl, bandcampUrl, ninaProtocolUrl
     - **Features**: enableLocationBasedBuy, enableDiscogsSearch
     - **Custom Links**: JSON string for additional platforms

3. **Run the script**
   ```bash
   cd server
   tsx add-release.ts
   ```

### Adding Photos

1. **Prepare your photos**
   - Upload to your preferred image hosting service
   - Get direct image URLs

2. **Edit the add-photo script**
   - Open `server/add-photo.ts`
   - Replace example data with your photos
   - Choose category: "backstage", "people", or "places"

3. **Run the script**
   ```bash
   cd server
   tsx add-photo.ts
   ```

## Method 2: Direct Database Commands

You can also add releases directly using SQL commands:

### Add a Music Release
```sql
INSERT INTO music_releases (
  title, year, genre, description, cover_image,
  spotify_url, apple_url, bandcamp_url,
  enable_location_based_buy, enable_discogs_search
) VALUES (
  'Your Album Title',
  2024,
  'Electronic',
  'Description of your album',
  'https://your-image-url.com/cover.jpg',
  'https://open.spotify.com/album/your-id',
  'https://music.apple.com/album/your-id',
  'https://yourname.bandcamp.com/album/title',
  1,  -- 1 = enable vinyl finder, 0 = disable
  1   -- 1 = enable Discogs search, 0 = disable
);
```

### Add a Photo
```sql
INSERT INTO photos (
  title, location, category, image_url, year
) VALUES (
  'Photo Title',
  'Location, Year',
  'backstage',  -- or 'people' or 'places'
  'https://your-image-url.com/photo.jpg',
  2024
);
```

## Image Hosting Recommendations

### Free Options:
- **Imgur**: Easy upload, reliable
- **Google Drive**: Set sharing to "Anyone with link can view"
- **GitHub**: Upload to repository and use raw URLs

### Professional Options:
- **Cloudinary**: Automatic optimization and transformations
- **AWS S3**: Scalable and reliable
- **Vercel**: If deploying there, includes image optimization

## Custom Links Format

For additional streaming platforms, use this JSON format in the customLinks field:

```json
[
  {
    "name": "SoundCloud",
    "url": "https://soundcloud.com/your-track",
    "color": "bg-orange-500"
  },
  {
    "name": "YouTube",
    "url": "https://youtube.com/watch?v=your-video",
    "color": "bg-red-600"
  }
]
```

## Bulk Upload for Large Collections

For your 100+ releases, I recommend:

1. **Create a CSV file** with your release data
2. **Use a script** to read the CSV and batch insert
3. **Process in chunks** to avoid overwhelming the database

Would you like me to create a bulk upload script for your specific needs?

## Next Steps

1. Choose your image hosting solution
2. Prepare your release data (title, year, genre, description, URLs)
3. Use the upload scripts to add your content
4. Test on the live site to ensure everything displays correctly

The site will automatically display new releases and photos as soon as they're added to the database.