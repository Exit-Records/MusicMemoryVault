# Excel Template for Music Releases and Photos

## Music Releases Template

Create an Excel file with these column headers (copy this exact format):

| title | year | genre | description | coverImage | catalogNumber | label | spotifyUrl | appleUrl | buyUrl | bandcampUrl | ninaProtocolUrl | youtubeUrl | primaryAudioSource | customLinksJson | enableLocationBasedBuy | enableDiscogsSearch |
|-------|------|-------|-------------|------------|---------------|-------|------------|----------|--------|-------------|-----------------|------------|-------------------|-----------------|----------------------|-------------------|

### Column Explanations:

- **title**: Album/EP/Single name
- **year**: Release year (number, e.g., 2023)
- **genre**: Genre (e.g., "Electronic", "Ambient", "Jazz")
- **description**: Brief description of the release
- **coverImage**: Direct URL to album cover image (use Dropbox format: `https://www.dropbox.com/s/FILE_ID/filename.jpg?dl=1`)
- **catalogNumber**: Catalog number (e.g., "CAT001", "LABEL-123") - optional
- **label**: Record label name (e.g., "Independent", "Universal Records") - optional
- **spotifyUrl**: Spotify album URL (optional)
- **appleUrl**: Apple Music URL (optional)
- **buyUrl**: Direct purchase URL (optional)
- **bandcampUrl**: Bandcamp URL (optional)
- **ninaProtocolUrl**: Nina Protocol URL (optional)
- **youtubeUrl**: YouTube video URL (optional, will play in-app)
- **primaryAudioSource**: Preferred playback source for tracks - use: "youtube", "bandcamp", "spotify", "apple", "nina", or "custom"
- **customLinksJson**: JSON for custom platforms (optional, see format below)
- **enableLocationBasedBuy**: TRUE or FALSE (enables vinyl finder)
- **enableDiscogsSearch**: TRUE or FALSE (enables Discogs marketplace)

### Example Row:
```
Neon Dreams | 2023 | Electronic | A journey through digital landscapes and analog emotions | https://example.com/cover.jpg | NEO001 | Synth Records | https://open.spotify.com/album/123 | https://music.apple.com/album/123 | | https://artist.bandcamp.com/album/neon-dreams | | https://youtu.be/abc123 | | TRUE | TRUE
```

## Multi-Track Releases

For albums/EPs with multiple tracks, create a **separate tracks sheet/file** with these columns:

| releaseTitle | trackNumber | trackTitle | duration | spotifyUrl | appleUrl | youtubeUrl | bandcampUrl | customLinksJson |
|--------------|-------------|------------|----------|------------|----------|------------|-------------|-----------------|

### Track Columns Explained:

- **releaseTitle**: Must match exactly the title from your releases sheet
- **trackNumber**: Track position (1, 2, 3, etc.)
- **trackTitle**: Individual track name
- **duration**: Track length (e.g., "3:45", "4:12") - optional
- **spotifyUrl**: Individual track Spotify URL (optional)
- **appleUrl**: Individual track Apple Music URL (optional)
- **youtubeUrl**: Individual track YouTube URL (optional)
- **bandcampUrl**: Individual track Bandcamp URL (optional)
- **customLinksJson**: JSON for custom track links (optional)

### Example Multi-Track Album:

**Releases Sheet:**
```
Midnight Echoes | 2023 | Ambient | Four ethereal compositions exploring nocturnal soundscapes | https://example.com/cover.jpg | AMB002 | Ethereal Sounds | https://open.spotify.com/album/456 | | | https://artist.bandcamp.com/album/midnight-echoes | | | | TRUE | TRUE
```

**Tracks Sheet:**
```
Midnight Echoes | 1 | Lunar Drift | 5:23 | https://open.spotify.com/track/abc | | https://youtu.be/track1 | |
Midnight Echoes | 2 | Shadow Dance | 4:45 | https://open.spotify.com/track/def | | https://youtu.be/track2 | |
Midnight Echoes | 3 | Dawn Whispers | 6:12 | https://open.spotify.com/track/ghi | | https://youtu.be/track3 | |
Midnight Echoes | 4 | City Sleep | 7:34 | https://open.spotify.com/track/jkl | | https://youtu.be/track4 | |
```

## Photos Template

Create a separate Excel sheet or file with these columns:

| title | location | category | imageUrl | year |
|-------|----------|----------|----------|------|

### Column Explanations:

- **title**: Photo title
- **location**: Where/when taken (e.g., "Studio, Los Angeles")
- **category**: Must be exactly one of: `backstage`, `people`, or `places`
- **imageUrl**: Direct URL to the image
- **year**: Year photo was taken (number)

### Example Row:
```
Recording Session | Abbey Road Studios, London | backstage | https://example.com/photo.jpg | 2023
```

## Custom Links Format (Advanced)

If you want custom streaming platform buttons, use this JSON format in the customLinksJson column:

```json
[{"name":"SoundCloud","url":"https://soundcloud.com/track","color":"bg-orange-500"},{"name":"YouTube","url":"https://youtube.com/watch","color":"bg-red-600"}]
```

## Available Colors for Custom Links:
- `bg-orange-500` (orange)
- `bg-red-600` (red) 
- `bg-blue-600` (blue)
- `bg-green-600` (green)
- `bg-purple-600` (purple)
- `bg-pink-600` (pink)
- `bg-yellow-500` (yellow)
- `bg-indigo-600` (indigo)

## Workflow Options:

### Option 1: Single Tracks/Singles
Use just the **Releases** sheet above. Leave release-level streaming URLs (like full album Spotify links) in the main columns.

### Option 2: Multi-Track Albums/EPs
1. **Create the release** in the Releases sheet (use album-level links)
2. **Create individual tracks** in a separate Tracks sheet
3. **Upload releases first**, then tracks

## Upload Process:

1. **Create your Excel file(s)** with the exact column headers above
2. **Fill in your data** row by row
3. **Save as CSV** (File → Save As → CSV format)
4. **Send me the CSV data** - you can copy and paste the content
5. **I'll format it** for the bulk upload script
6. **Run the upload** and your releases/photos will appear on the site

**Important:** For multi-track releases, upload the releases first, then the tracks (the track system needs the release to exist first).

## Image Hosting Tips:

### Dropbox Images (Recommended)
If using Dropbox, convert sharing links to direct download links:
- **Sharing Link**: `https://www.dropbox.com/s/FILE_ID/filename.jpg?dl=0`
- **Direct Link**: `https://www.dropbox.com/s/FILE_ID/filename.jpg?dl=1` (change `dl=0` to `dl=1`)

### Google Drive Images
If using Google Drive, convert sharing links to direct links:
- **Sharing Link**: `https://drive.google.com/file/d/FILE_ID/view?usp=drive_link`
- **Direct Link**: `https://drive.google.com/uc?export=view&id=FILE_ID`

### Other Options
- **Imgur**: Free image hosting, get direct .jpg/.png links
- **Cloudinary**: Professional image hosting with optimization
- **Your own website**: Host images directly on your domain

### Testing Images
Always test your image URLs by pasting them in a browser - you should see just the image, not a webpage.

## Tips:

- Leave columns blank if you don't have that information (don't put "N/A")
- For TRUE/FALSE columns, use exactly those words
- Make sure image URLs are direct links to the actual image files
- Test with a few releases first before doing your full catalog

Ready to create your Excel file? Once you have it ready, just paste the data here and I'll process it for upload!