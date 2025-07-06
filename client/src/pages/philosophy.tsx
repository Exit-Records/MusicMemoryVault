import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CorePage } from "@shared/schema";

const categories = [
  "All", "Composition", "Theory", "Technology", "Collaboration", "Visual Arts"
];

export default function PhilosophyPage() {
  const { data: corePages = [], isLoading } = useQuery<CorePage[]>({
    queryKey: ["/api/core-pages"],
    queryFn: async () => {
      const response = await fetch("/api/core-pages");
      if (!response.ok) throw new Error("Failed to fetch core pages");
      return response.json();
    },
  });

  // Filter only published core pages
  const publishedPages = corePages.filter(page => page.isPublished);

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-black dark:text-[#F3EFE0]">Core</h1>
        </div>



        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant="secondary" 
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-300 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {publishedPages.map((page) => (
            <Card 
              key={page.id}
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {page.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
                
                <h3 className="text-2xl font-light mb-4 text-black dark:text-[#F3EFE0] group-hover:text-black dark:group-hover:text-[#F3EFE0] transition-colors">
                  {page.title}
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {page.excerpt}
                </p>
                
                <div className="flex items-center text-black dark:text-[#F3EFE0] group-hover:gap-3 transition-all duration-200">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium ml-2">Read More</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Archive Note */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Archive of thoughts spanning three decades of creative practice
          </p>
        </div>
      </div>
    </div>
  );
}