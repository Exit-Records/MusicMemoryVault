import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Lightbulb, FileText, BookOpen, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { NotePage } from "@shared/schema";

function getCategoryIcon(category: string) {
  switch (category) {
    case "reflection":
      return <BookOpen className="w-6 h-6" />;
    case "idea":
      return <Lightbulb className="w-6 h-6" />;
    case "observation":
      return <FileText className="w-6 h-6" />;
    case "events":
      return <Calendar className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "reflection":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "idea":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "observation":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "events":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

function FuturePage() {
  const { data: notePages = [], isLoading } = useQuery<NotePage[]>({
    queryKey: ["/api/note-pages"],
    queryFn: async () => {
      const response = await fetch("/api/note-pages");
      if (!response.ok) throw new Error("Failed to fetch note pages");
      return response.json();
    },
  });

  // Filter only published note pages
  const publishedNotes = notePages.filter(page => page.isPublished);

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-black dark:text-[#F3EFE0]">Note</h1>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <CardContent className="p-8">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : publishedNotes.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-6 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-medium mb-4 text-black dark:text-[#F3EFE0]">
              No Notes Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new thoughts and reflections.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {publishedNotes.map((note) => (
              <Card 
                key={note.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-black/10 dark:bg-[#F3EFE0]/10 rounded-full flex items-center justify-center text-black dark:text-[#F3EFE0]">
                        {getCategoryIcon(note.category)}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-semibold text-black dark:text-[#F3EFE0]">
                          {note.title}
                        </h4>
                        <Badge className={`text-xs capitalize ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </Badge>
                      </div>
                      
                      {/* Event-specific info */}
                      {note.category === "events" && (
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-400">
                          {note.eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(note.eventDate)}
                            </div>
                          )}
                          {note.eventLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {note.eventLocation}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {note.content}
                        </p>
                      </div>

                      {/* Tags */}
                      {note.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {note.tags.split(',').map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ticket link for events */}
                      {note.category === "events" && note.ticketLink && (
                        <div className="mt-4">
                          <a 
                            href={note.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Get Tickets
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured image */}
                  {note.featuredImage && (
                    <div className="mt-6">
                      <img 
                        src={note.featuredImage}
                        alt={note.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FuturePage;