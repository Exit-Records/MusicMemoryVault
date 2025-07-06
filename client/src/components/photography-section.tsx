import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Photo } from "@shared/schema";

const categories = [
  { value: "all", label: "All Photos" },
  { value: "backstage", label: "Back Stage" },
  { value: "people", label: "People" },
  { value: "places", label: "Places" },
];

export default function PhotographySection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos", selectedCategory],
    queryFn: async ({ queryKey }) => {
      const [url, category] = queryKey;
      const params = category !== "all" ? `?category=${category}` : "";
      const response = await fetch(`${url}${params}`);
      if (!response.ok) throw new Error("Failed to fetch photos");
      return response.json();
    },
  });

  const openLightbox = (photo: Photo) => {
    const event = new CustomEvent('openLightbox', { detail: photo });
    window.dispatchEvent(event);
  };

  return (
    <section id="photography" className="py-20" style={{backgroundColor: '#F3EFE0'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">View</h2>
        </div>

        {/* Photography Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "secondary"}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category.value
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative">
                <Skeleton className="w-full h-80 rounded-lg" />
              </div>
            ))
          ) : (
            photos?.map((photo) => (
              <div 
                key={photo.id} 
                className="group cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="font-semibold">{photo.title}</h4>
                    <p className="text-sm">{photo.location}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg transition-colors duration-200">
            Load More Photos
          </Button>
        </div>
      </div>
    </section>
  );
}
