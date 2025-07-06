import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Music, Camera, Package, Circle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { MusicRelease, Photo, Merchandise, CorePage, NotePage } from "@shared/schema";

interface SearchResults {
  musicReleases: MusicRelease[];
  photos: Photo[];
  merchandise: Merchandise[];
  corePages: CorePage[];
  notePages: NotePage[];
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all data for search
  const { data: musicReleases = [] } = useQuery<MusicRelease[]>({
    queryKey: ["/api/music"],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const { data: merchandise = [] } = useQuery<Merchandise[]>({
    queryKey: ["/api/merchandise"],
  });

  const { data: corePages = [] } = useQuery<CorePage[]>({
    queryKey: ["/api/core-pages"],
  });

  const { data: notePages = [] } = useQuery<NotePage[]>({
    queryKey: ["/api/note-pages"],
  });

  // Filter results based on search query
  const getFilteredResults = (): SearchResults => {
    if (!searchQuery.trim()) {
      return {
        musicReleases: [],
        photos: [],
        merchandise: [],
        corePages: [],
        notePages: []
      };
    }

    const query = searchQuery.toLowerCase();

    return {
      musicReleases: musicReleases.filter(release =>
        release.title.toLowerCase().includes(query) ||
        release.artist.toLowerCase().includes(query) ||
        release.genre.toLowerCase().includes(query) ||
        release.description.toLowerCase().includes(query) ||
        (release.label && release.label.toLowerCase().includes(query)) ||
        (release.catalogNumber && release.catalogNumber.toLowerCase().includes(query))
      ),
      photos: photos.filter(photo =>
        photo.title.toLowerCase().includes(query) ||
        photo.location.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query)
      ),
      merchandise: merchandise.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      ),
      corePages: corePages.filter(page =>
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query) ||
        page.category.toLowerCase().includes(query)
      ),
      notePages: notePages.filter(page =>
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query) ||
        page.category.toLowerCase().includes(query) ||
        (page.eventLocation && page.eventLocation.toLowerCase().includes(query))
      )
    };
  };

  const results = getFilteredResults();
  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black text-black dark:text-[#F3EFE0] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light mb-6">LOOK</h1>
          
          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Search ECHO, VIEW, FORM, CORE, or NOTE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg p-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>
          
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {totalResults} results found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-8">
            {/* Music Releases */}
            {results.musicReleases.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Music className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Music ({results.musicReleases.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.musicReleases.map((release) => (
                    <Card key={release.id} className="bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {release.coverImage && (
                            <img
                              src={release.coverImage}
                              alt={release.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{release.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{release.artist}</p>
                            <p className="text-sm text-gray-500">{release.year} • {release.genre}</p>
                            {release.label && (
                              <p className="text-xs text-gray-500">{release.label}</p>
                            )}
                          </div>
                        </div>
                        <Link to="/echo">
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            View in ECHO
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Photos */}
            {results.photos.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Photography ({results.photos.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.photos.map((photo) => (
                    <Card key={photo.id} className="bg-white dark:bg-gray-900 overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="text-sm font-medium truncate">{photo.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{photo.location}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {photo.category}
                          </Badge>
                        </div>
                        <Link to="/view">
                          <Button variant="outline" size="sm" className="mx-3 mb-3 w-[calc(100%-1.5rem)]">
                            View in VIEW
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Merchandise */}
            {results.merchandise.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Merchandise ({results.merchandise.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.merchandise.map((item) => (
                    <Card key={item.id} className="bg-white dark:bg-gray-900">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                            <p className="text-lg font-semibold">{item.price}</p>
                            <Badge variant={item.available ? "default" : "secondary"} className="mt-1">
                              {item.available ? "Available" : "Sold Out"}
                            </Badge>
                          </div>
                        </div>
                        <Link to="/form">
                          <Button variant="outline" size="sm" className="mt-3 w-full">
                            View in FORM
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Core Pages */}
            {results.corePages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Circle className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Philosophy ({results.corePages.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.corePages.map((page) => (
                    <Card key={page.id} className="bg-white dark:bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <Badge variant="outline">{page.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {page.content}
                        </p>
                        <Link to="/core">
                          <Button variant="outline" size="sm" className="mt-3">
                            View in CORE
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Note Pages */}
            {results.notePages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Future ({results.notePages.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.notePages.map((page) => (
                    <Card key={page.id} className="bg-white dark:bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{page.category}</Badge>
                          {page.eventDate && (
                            <Badge variant="secondary">
                              {new Date(page.eventDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {page.content}
                        </p>
                        {page.eventLocation && (
                          <p className="text-sm text-gray-500 mt-2">📍 {page.eventLocation}</p>
                        )}
                        <Link to="/note">
                          <Button variant="outline" size="sm" className="mt-3">
                            View in NOTE
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}



            {/* No Results */}
            {totalResults === 0 && searchQuery && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching with different keywords or check your spelling.
                </p>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}