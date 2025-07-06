import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Music, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import YouTubePlayer from "@/components/youtube-player";
import type { Track } from "@shared/schema";

interface TrackListingProps {
  releaseId: number;
  releaseTitle: string;
}

export default function TrackListing({ releaseId, releaseTitle }: TrackListingProps) {
  const [youtubePlayerOpen, setYoutubePlayerOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const { data: tracks, isLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks", releaseId],
    queryFn: async () => {
      const response = await fetch(`/api/tracks/${releaseId}`);
      if (!response.ok) throw new Error("Failed to fetch tracks");
      return response.json();
    },
  });

  const handleTrackPlay = (track: Track) => {
    if (track.youtubeUrl) {
      setSelectedTrack(track);
      setYoutubePlayerOpen(true);
    } else if (track.bandcampUrl) {
      window.open(track.bandcampUrl, '_blank');
    } else if (track.spotifyUrl) {
      window.open(track.spotifyUrl, '_blank');
    } else if (track.appleUrl) {
      window.open(track.appleUrl, '_blank');
    }
  };

  const getTrackPlaySource = (track: Track): string => {
    if (track.youtubeUrl) return "YouTube";
    if (track.bandcampUrl) return "Bandcamp";
    if (track.spotifyUrl) return "Spotify";
    if (track.appleUrl) return "Apple Music";
    return "N/A";
  };

  const hasPlayableTrack = (track: Track): boolean => {
    return !!(track.youtubeUrl || track.bandcampUrl || track.spotifyUrl || track.appleUrl);
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-3 text-foreground">Track Listing</h4>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-3 text-foreground">Track Listing</h4>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div 
            key={track.id} 
            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors min-h-[60px]"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-muted-foreground w-6 flex-shrink-0">
                {track.trackNumber}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{track.title}</p>
                {track.duration && (
                  <p className="text-sm text-muted-foreground">{track.duration}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              {hasPlayableTrack(track) && (
                <>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {getTrackPlaySource(track)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTrackPlay(track)}
                    className="w-8 h-8 p-0 hover:bg-muted flex items-center justify-center flex-shrink-0"
                  >
                    {track.youtubeUrl ? (
                      <Play className="w-3 h-3" />
                    ) : (
                      <Music className="w-3 h-3" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTrack && selectedTrack.youtubeUrl && (
        <YouTubePlayer 
          videoUrl={selectedTrack.youtubeUrl}
          albumTitle={`${releaseTitle} - ${selectedTrack.title}`}
          isOpen={youtubePlayerOpen}
          onClose={() => setYoutubePlayerOpen(false)}
        />
      )}
    </div>
  );
}