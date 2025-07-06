import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Disc, Music, Globe, ListMusic, Play } from "lucide-react";
import type { MusicRelease } from "@shared/schema";
import VinylStoreFinder from "@/components/vinyl-store-finder";
import DiscogsSearch from "@/components/discogs-search";
import YouTubePlayer from "@/components/youtube-player";
import TrackListing from "@/components/track-listing";

interface CustomLink {
  name: string;
  url: string;
  color: string;
}

const decades = [
  { value: "all", label: "All Years" },
  { value: "1990s", label: "1990s" },
  { value: "2000s", label: "2000s" },
  { value: "2010s", label: "2010s" },
  { value: "2020s", label: "2020s" },
];

export default function MusicPage() {
  const [selectedDecade, setSelectedDecade] = useState("all");
  const [vinylFinderOpen, setVinylFinderOpen] = useState(false);
  const [discogsSearchOpen, setDiscogsSearchOpen] = useState(false);
  const [youtubePlayerOpen, setYoutubePlayerOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedCoverImage, setSelectedCoverImage] = useState("");
  const [selectedYoutubeUrl, setSelectedYoutubeUrl] = useState("");

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
    if (Boolean(release.enableLocationBasedBuy)) {
      setSelectedAlbum(release.title);
      setVinylFinderOpen(true);
    } else if (release.buyUrl) {
      window.open(release.buyUrl, '_blank');
    }
  };

  const handleDiscogsClick = (release: MusicRelease) => {
    setSelectedAlbum(release.title);
    setSelectedArtist(release.artist);
    setSelectedCoverImage(release.coverImage);
    setDiscogsSearchOpen(true);
  };

  const handleYoutubeClick = (release: MusicRelease) => {
    if (release.youtubeUrl) {
      setSelectedAlbum(release.title);
      setSelectedYoutubeUrl(release.youtubeUrl);
      setYoutubePlayerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-black dark:text-[#F3EFE0]">Echo</h1>
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
                  ? "bg-black dark:bg-[#F3EFE0] text-white dark:text-black hover:bg-black/90 dark:hover:bg-[#F3EFE0]/90"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {decade.label}
            </Button>
          ))}
        </div>

        {/* Music Releases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            releases?.map((release) => (
              <Card 
                key={release.id} 
                className="group bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={release.coverImage} 
                    alt={`${release.title} album cover`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <CardContent className="p-6 bg-white dark:bg-gray-900">
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-[#F3EFE0]">{release.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{release.year} • {release.genre}</p>
                  {(release.catalogNumber || release.label) && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                      {release.catalogNumber && <span>Cat No: {release.catalogNumber}</span>}
                      {release.catalogNumber && release.label && <span> • </span>}
                      {release.label && <span>Label: {release.label}</span>}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{release.description}</p>
                  
                  <TrackListing releaseId={release.id} releaseTitle={release.title} />
                  <div className="flex flex-wrap gap-2 mt-4">
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
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-700 transition-colors flex items-center gap-1"
                      >
                        <Music className="w-3 h-3" />
                        Bandcamp
                      </a>
                    )}
                    {release.ninaProtocolUrl && (
                      <a 
                        href={release.ninaProtocolUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        Nina
                      </a>
                    )}
                    {release.youtubeUrl && (
                      <button 
                        onClick={() => handleYoutubeClick(release)}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Watch
                      </button>
                    )}
                    {release.spotifyUrl && (
                      <a 
                        href={release.spotifyUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <ListMusic className="w-3 h-3" />
                        Spotify
                      </a>
                    )}
                    {release.appleUrl && (
                      <a 
                        href={release.appleUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
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
                            target="_blank"
                            rel="noopener noreferrer"
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
        
        <YouTubePlayer 
          videoUrl={selectedYoutubeUrl}
          albumTitle={selectedAlbum}
          isOpen={youtubePlayerOpen}
          onClose={() => setYoutubePlayerOpen(false)}
        />
      </div>
    </div>
  );
}