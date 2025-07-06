import { db } from "./db";
import { photos } from "@shared/schema";

// Function to add a new photo
async function addPhoto(photoData: {
  title: string;
  location: string;
  category: "backstage" | "people" | "places";
  imageUrl: string;
  year: number;
}) {
  try {
    const [newPhoto] = await db
      .insert(photos)
      .values({
        title: photoData.title,
        location: photoData.location,
        category: photoData.category,
        imageUrl: photoData.imageUrl,
        year: photoData.year,
      })
      .returning();

    console.log("Successfully added photo:", newPhoto);
    return newPhoto;
  } catch (error) {
    console.error("Error adding photo:", error);
    throw error;
  }
}

// Example usage - add your photos here:
async function addYourPhotos() {
  // Example photos - replace with your actual data
  await addPhoto({
    title: "Studio Session",
    location: "Recording Studio, 2024",
    category: "backstage",
    imageUrl: "https://your-image-hosting.com/photo1.jpg",
    year: 2024,
  });

  await addPhoto({
    title: "Concert Preparation",
    location: "Concert Hall, 2024", 
    category: "backstage",
    imageUrl: "https://your-image-hosting.com/photo2.jpg",
    year: 2024,
  });

  console.log("All photos added successfully!");
}

// Run this to add photos
if (import.meta.url === `file://${process.argv[1]}`) {
  addYourPhotos().catch(console.error);
}

export { addPhoto };