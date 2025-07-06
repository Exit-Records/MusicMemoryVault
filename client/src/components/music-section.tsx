import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListMusic, Music, ShoppingCart, Globe, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VinylStoreFinder from "@/components/vinyl-store-finder";
import DiscogsSearch from "@/components/discogs-search";
import type { MusicRelease } from "@shared/schema";

interface CustomLink {
  name: string;
  url: string;
  color: string;
}

const decades = [
  { value: "all", label: "All Years" },
  { value: "2020", label: "2020s" },
  { value: "2010", label: "2010s" },
  { value: "2000", label: "2000s" },
  { value: "1990", label: "1990s" },
];

export default function MusicSection() {
  const [selectedDecade, setSelectedDecade] = useState("all");
  const [vinylFinderOpen, setVinylFinderOpen] = useState(false);
  const [discogsSearchOpen, setDiscogsSearchOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [selectedArtist, setSelectedArtist] = useState<string>("Alexandra Chen");
  const [selectedCoverImage, setSelectedCoverImage] = useState<string>("");

  const { data: releases, isLoading } = useQuery<MusicRelease[]>({
    queryKey: ["/api/music", selectedDecade],
    queryFn: async ({ queryKey }) => {
      const [url, decade] = queryKey;
      const params = decade !== "all" ? `?decade=${decade}` : "";
      const response = await fetch(`${url}${params}`);
      if (!response.ok) throw new Error("Failed to fetch music releases");
      return response.json();
    },
  });

  const handleBuyClick = (release: MusicRelease) => {
    if (release.enableLocationBasedBuy) {
      setSelectedAlbum(release.title);
      setVinylFinderOpen(true);
    } else if (release.buyUrl) {
      window.open(release.buyUrl, '_blank');
    }
  };

  const handleDiscogsClick = (release: MusicRelease) => {
    setSelectedAlbum(release.title);
    setSelectedCoverImage(release.coverImage);
    setDiscogsSearchOpen(true);
  };

  return (
    <section id="music" className="py-20" style={{backgroundColor: '#F3EFE0'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Echo</h2>
        </div>

        {/* Decade Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {decades.map((decade) => (
            <Button
              key={decade.value}
              variant={selectedDecade === decade.value ? "default" : "secondary"}
              onClick={() => setSelectedDecade(decade.value)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedDecade === decade.value
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {decade.label}
            </Button>
          ))}
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-64" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            releases?.map((release) => (
              <Card 
                key={release.id} 
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={release.coverImage} 
                    alt={`${release.title} album cover`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{release.title}</h3>
                  <p className="text-neutral mb-1">{release.year} • {release.genre}</p>
                  <p className="text-sm text-gray-600 mb-4">{release.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(release.buyUrl || Boolean(release.enableLocationBasedBuy)) && (
                      <button 
                        onClick={() => handleBuyClick(release)}
                        className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600 transition-colors flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {Boolean(release.enableLocationBasedBuy) ? 'Find Vinyl' : 'Buy'}
                      </button>
                    )}
                    {Boolean(release.enableDiscogsSearch) && (
                      <button 
                        onClick={() => handleDiscogsClick(release)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <Disc className="w-3 h-3" />
                        Discogs
                      </button>
                    )}
                    {release.bandcampUrl && (
                      <a 
                        href={release.bandcampUrl} 
                        className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-700 transition-colors flex items-center gap-1"
                      >
                        <Music className="w-3 h-3" />
                        Bandcamp
                      </a>
                    )}
                    {release.ninaProtocolUrl && (
                      <a 
                        href={release.ninaProtocolUrl} 
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        Nina
                      </a>
                    )}
                    {release.spotifyUrl && (
                      <a 
                        href={release.spotifyUrl} 
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <ListMusic className="w-3 h-3" />
                        Spotify
                      </a>
                    )}
                    {release.appleUrl && (
                      <a 
                        href={release.appleUrl} 
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Music className="w-3 h-3" />
                        Apple
                      </a>
                    )}
                    {release.customLinks && (() => {
                      try {
                        const customLinks: CustomLink[] = JSON.parse(release.customLinks);
                        return customLinks.map((link, index) => (
                          <a 
                            key={index}
                            href={link.url} 
                            className={`${link.color} text-white px-3 py-1 rounded-full text-sm hover:opacity-90 transition-colors flex items-center gap-1`}
                          >
                            <Globe className="w-3 h-3" />
                            {link.name}
                          </a>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <VinylStoreFinder 
          albumTitle={selectedAlbum}
          isOpen={vinylFinderOpen}
          onClose={() => setVinylFinderOpen(false)}
        />
        
        <DiscogsSearch 
          albumTitle={selectedAlbum}
          artistName={selectedArtist}
          coverImage={selectedCoverImage}
          isOpen={discogsSearchOpen}
          onClose={() => setDiscogsSearchOpen(false)}
        />
      </div>
    </section>
  );
}
