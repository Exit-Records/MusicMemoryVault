import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertCorePageSchema, insertNotePageSchema, insertMerchandiseSchema, insertCodeEntrySchema } from "@shared/schema";

// Configure multer for image uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded images statically
  app.use('/uploads', express.static('uploads'));

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Return the URL path to access the uploaded image
      const imageUrl = `/uploads/images/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Get all music releases
  app.get("/api/music", async (req, res) => {
    try {
      const decade = req.query.decade as string;
      
      let releases;
      if (decade && decade !== "all") {
        releases = await storage.getMusicReleasesByDecade(decade);
      } else {
        releases = await storage.getMusicReleases();
      }
      
      res.json(releases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch music releases" });
    }
  });

  // Get all photos
  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let photos;
      if (category && category !== "all") {
        photos = await storage.getPhotosByCategory(category);
      } else {
        photos = await storage.getPhotos();
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Get tracks for a specific release
  app.get("/api/tracks/:releaseId", async (req, res) => {
    try {
      const releaseId = parseInt(req.params.releaseId);
      const tracks = await storage.getTracksByRelease(releaseId);
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  // Create new music release
  app.post("/api/music", async (req, res) => {
    try {
      const release = await storage.createMusicRelease(req.body);
      res.json(release);
    } catch (error) {
      console.error("Error creating music release:", error);
      res.status(500).json({ message: "Failed to create music release" });
    }
  });

  // Update music release
  app.put("/api/music/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const release = await storage.updateMusicRelease(id, req.body);
      res.json(release);
    } catch (error) {
      console.error("Error updating music release:", error);
      res.status(500).json({ message: "Failed to update music release" });
    }
  });

  // Create new track
  app.post("/api/tracks", async (req, res) => {
    try {
      const track = await storage.createTrack(req.body);
      res.json(track);
    } catch (error) {
      console.error("Error creating track:", error);
      res.status(500).json({ message: "Failed to create track" });
    }
  });

  // Update track
  app.put("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.updateTrack(id, req.body);
      res.json(track);
    } catch (error) {
      console.error("Error updating track:", error);
      res.status(500).json({ message: "Failed to update track" });
    }
  });

  // Delete track
  app.delete("/api/tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTrack(id);
      res.json({ message: "Track deleted successfully" });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ message: "Failed to delete track" });
    }
  });

  // Create new photo
  app.post("/api/photos", async (req, res) => {
    try {
      const photo = await storage.createPhoto(req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error creating photo:", error);
      res.status(500).json({ message: "Failed to create photo" });
    }
  });

  // Update photo
  app.put("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.updatePhoto(id, req.body);
      res.json(photo);
    } catch (error) {
      console.error("Error updating photo:", error);
      res.status(500).json({ message: "Failed to update photo" });
    }
  });

  // Delete photo
  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhoto(id);
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Get all core pages
  app.get("/api/core-pages", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let pages;
      if (category && category !== "all") {
        pages = await storage.getCorePagesByCategory(category);
      } else {
        pages = await storage.getCorePages();
      }
      
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch core pages" });
    }
  });

  // Create new core page
  app.post("/api/core-pages", async (req, res) => {
    try {
      const validatedData = insertCorePageSchema.parse(req.body);
      const page = await storage.createCorePage(validatedData);
      res.json(page);
    } catch (error) {
      console.error("Error creating core page:", error);
      res.status(500).json({ message: "Failed to create core page" });
    }
  });

  // Update core page
  app.put("/api/core-pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCorePageSchema.parse(req.body);
      const page = await storage.updateCorePage(id, validatedData);
      res.json(page);
    } catch (error) {
      console.error("Error updating core page:", error);
      res.status(500).json({ message: "Failed to update core page" });
    }
  });

  // Delete core page
  app.delete("/api/core-pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCorePage(id);
      res.json({ message: "Core page deleted successfully" });
    } catch (error) {
      console.error("Error deleting core page:", error);
      res.status(500).json({ message: "Failed to delete core page" });
    }
  });

  // Get all note pages
  app.get("/api/note-pages", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let pages;
      if (category && category !== "all") {
        pages = await storage.getNotePagesByCategory(category);
      } else {
        pages = await storage.getNotePages();
      }
      
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note pages" });
    }
  });

  // Create new note page
  app.post("/api/note-pages", async (req, res) => {
    try {
      const validatedData = insertNotePageSchema.parse(req.body);
      const page = await storage.createNotePage(validatedData);
      res.json(page);
    } catch (error) {
      console.error("Error creating note page:", error);
      res.status(500).json({ message: "Failed to create note page" });
    }
  });

  // Update note page
  app.put("/api/note-pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNotePageSchema.parse(req.body);
      const page = await storage.updateNotePage(id, validatedData);
      res.json(page);
    } catch (error) {
      console.error("Error updating note page:", error);
      res.status(500).json({ message: "Failed to update note page" });
    }
  });

  // Delete note page
  app.delete("/api/note-pages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNotePage(id);
      res.json({ message: "Note page deleted successfully" });
    } catch (error) {
      console.error("Error deleting note page:", error);
      res.status(500).json({ message: "Failed to delete note page" });
    }
  });

  // Get merchandise items
  app.get("/api/merchandise", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let items;
      if (category && category !== "all") {
        items = await storage.getMerchandiseByCategory(category);
      } else {
        items = await storage.getMerchandise();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchandise" });
    }
  });

  // Create new merchandise item
  app.post("/api/merchandise", async (req, res) => {
    try {
      const validatedData = insertMerchandiseSchema.parse(req.body);
      const item = await storage.createMerchandise(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating merchandise:", error);
      res.status(500).json({ message: "Failed to create merchandise" });
    }
  });

  // Update merchandise item
  app.put("/api/merchandise/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMerchandiseSchema.parse(req.body);
      const item = await storage.updateMerchandise(id, validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error updating merchandise:", error);
      res.status(500).json({ message: "Failed to update merchandise" });
    }
  });

  // Delete merchandise item
  app.delete("/api/merchandise/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMerchandise(id);
      res.json({ message: "Merchandise item deleted successfully" });
    } catch (error) {
      console.error("Error deleting merchandise:", error);
      res.status(500).json({ message: "Failed to delete merchandise" });
    }
  });

  // Get all code entries (admin only)
  app.get("/api/code-entries", async (req, res) => {
    try {
      const entries = await storage.getCodeEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch code entries" });
    }
  });

  // Verify code and get download (public endpoint)
  app.post("/api/verify-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }

      const entry = await storage.getCodeEntryByCode(code);
      
      if (!entry || !entry.isActive) {
        return res.status(404).json({ message: "Invalid or inactive code" });
      }

      res.json({
        title: entry.title,
        description: entry.description,
        downloadUrl: entry.downloadUrl,
        downloadName: entry.downloadName
      });
    } catch (error) {
      console.error("Error verifying code:", error);
      res.status(500).json({ message: "Failed to verify code" });
    }
  });

  // Create new code entry
  app.post("/api/code-entries", async (req, res) => {
    try {
      const validatedData = insertCodeEntrySchema.parse(req.body);
      const entry = await storage.createCodeEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating code entry:", error);
      res.status(500).json({ message: "Failed to create code entry" });
    }
  });

  // Update code entry
  app.put("/api/code-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCodeEntrySchema.parse(req.body);
      const entry = await storage.updateCodeEntry(id, validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error updating code entry:", error);
      res.status(500).json({ message: "Failed to update code entry" });
    }
  });

  // Delete code entry
  app.delete("/api/code-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCodeEntry(id);
      res.json({ message: "Code entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting code entry:", error);
      res.status(500).json({ message: "Failed to delete code entry" });
    }
  });

  // Bulk create code entries
  app.post("/api/code-entries/bulk", async (req, res) => {
    try {
      const { title, description, downloadUrl, downloadName, count, isActive = true } = req.body;
      
      if (!title || !description || !downloadUrl || !downloadName || !count) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (count < 1 || count > 100) {
        return res.status(400).json({ message: "Count must be between 1 and 100" });
      }

      const entries = [];
      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      for (let i = 0; i < count; i++) {
        let code = generateCode();
        // Ensure uniqueness by checking existing codes
        let attempts = 0;
        while (attempts < 10) {
          const existing = await storage.getCodeEntryByCode(code);
          if (!existing) break;
          code = generateCode();
          attempts++;
        }

        const entryData = {
          title: `${title} #${i + 1}`,
          description,
          code,
          downloadUrl,
          downloadName,
          isActive: isActive ? 1 : 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const entry = await storage.createCodeEntry(entryData);
        entries.push(entry);
      }

      res.json({ success: true, count: entries.length, entries });
    } catch (error) {
      console.error("Error creating bulk code entries:", error);
      res.status(500).json({ message: "Failed to create bulk code entries" });
    }
  });

  // Upload file for code entries
  app.post("/api/upload-file", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(process.cwd(), 'dist', 'public', 'uploads', filename);
      
      // Ensure uploads directory exists
      const uploadsDir = path.dirname(filePath);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Write file to disk
      fs.writeFileSync(filePath, req.file.buffer);
      
      const fileUrl = `/uploads/${filename}`;
      res.json({ fileUrl, fileName: req.file.originalname });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
