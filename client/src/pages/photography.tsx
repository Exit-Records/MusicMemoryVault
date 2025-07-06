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

export default function PhotographyPage() {
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
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-black dark:text-[#F3EFE0]">View</h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "secondary"}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category.value
                  ? "bg-black dark:bg-[#F3EFE0] text-white dark:text-black hover:bg-black/90 dark:hover:bg-[#F3EFE0]/90"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="w-full h-64" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            photos?.map((photo) => (
              <div 
                key={photo.id}
                className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-black dark:text-[#F3EFE0]">{photo.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{photo.location} • {photo.year}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && photos?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No photos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}