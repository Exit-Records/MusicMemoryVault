import { Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CorePage } from "@shared/schema";

export default function PhilosophySection() {
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
    <section id="philosophy" className="py-20" style={{backgroundColor: '#F3EFE0'}}>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Core</h2>
        </div>

        <div className="space-y-12">
          {publishedPages.map((page, index) => (
            <article key={page.id} className="group cursor-pointer">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 mt-2">
                  <Circle className="w-3 h-3 fill-current text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">{page.createdAt ? new Date(page.createdAt).toLocaleDateString() : ''}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{page.category}</span>
                  </div>
                  <h3 className="text-2xl font-light mb-4 group-hover:text-gray-600 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {page.excerpt}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      Continue reading →
                    </span>
                  </div>
                </div>
              </div>
              {index < publishedPages.length - 1 && (
                <div className="mt-12 border-b border-gray-200"></div>
              )}
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="text-gray-600 hover:text-black transition-colors text-lg font-light">
            View All Thoughts
          </button>
        </div>
      </div>
    </section>
  );
}