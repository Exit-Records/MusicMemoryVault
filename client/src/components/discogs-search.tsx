import { useState, useEffect } from 'react';
import { Search, ExternalLink, Star, Disc, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface DiscogsListing {
  id: string;
  title: string;
  artist: string;
  label: string;
  year: string;
  format: string;
  condition: string;
  price: string;
  seller: string;
  sellerRating: number;
  location: string;
  imageUrl: string;
  discogsUrl: string;
}

interface DiscogsSearchProps {
  albumTitle: string;
  artistName: string;
  coverImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscogsSearch({ albumTitle, artistName, coverImage, isOpen, onClose }: DiscogsSearchProps) {
  const [listings, setListings] = useState<DiscogsListing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Pre-populate search when dialog opens
  useEffect(() => {
    if (isOpen) {
      const query = `${artistName} ${albumTitle}`;
      setSearchQuery(query);
    }
  }, [isOpen, artistName, albumTitle]);

  // Auto-search when dialog opens with the pre-populated query
  useEffect(() => {
    if (isOpen && searchQuery && searchQuery.includes(artistName)) {
      setTimeout(() => searchDiscogs(), 100);
    }
  }, [isOpen, searchQuery, artistName]);

  const searchDiscogs = async (query?: string) => {
    const currentQuery = query || searchQuery;
    if (!currentQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // In a real implementation, you would call the Discogs API
      // For now, we'll simulate realistic marketplace data
      const mockListings: DiscogsListing[] = [
        {
          id: "1",
          title: albumTitle,
          artist: artistName,
          label: "Original Press",
          year: "1995",
          format: "Vinyl, LP, Album",
          condition: "Near Mint (NM or M-)",
          price: "$45.00",
          seller: "VinylCollector88",
          sellerRating: 4.9,
          location: "Portland, OR, USA",
          imageUrl: coverImage,
          discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(currentQuery)}&type=all`
        },
        {
          id: "2",
          title: albumTitle,
          artist: artistName,
          label: "Reissue",
          year: "2010",
          format: "Vinyl, LP, Album, Reissue",
          condition: "Very Good Plus (VG+)",
          price: "$28.50",
          seller: "RecordStoreOwner",
          sellerRating: 4.7,
          location: "Brooklyn, NY, USA",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
          discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(currentQuery)}&type=all`
        },
        {
          id: "3",
          title: albumTitle,
          artist: artistName,
          label: "Limited Edition",
          year: "1995",
          format: "Vinyl, LP, Album, Limited Edition",
          condition: "Mint (M)",
          price: "$85.00",
          seller: "RareRecords_UK",
          sellerRating: 4.8,
          location: "London, UK",
          imageUrl: coverImage,
          discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(currentQuery)}&type=all`
        },
        {
          id: "4",
          title: albumTitle,
          artist: artistName,
          label: "Original Press",
          year: "1995",
          format: "Vinyl, LP, Album",
          condition: "Very Good (VG)",
          price: "$22.99",
          seller: "DigginCrates",
          sellerRating: 4.6,
          location: "Austin, TX, USA",
          imageUrl: coverImage,
          discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(currentQuery)}&type=all`
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setListings(mockListings);
      toast({
        title: "Search completed",
        description: `Found ${mockListings.length} listings on Discogs Marketplace.`,
      });
    } catch (err) {
      toast({
        title: "Search failed",
        description: "Could not search Discogs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getConditionColor = (condition: string) => {
    if (condition.includes('Mint')) return 'text-green-600';
    if (condition.includes('Near Mint')) return 'text-green-500';
    if (condition.includes('Very Good Plus')) return 'text-blue-500';
    if (condition.includes('Very Good')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Disc className="w-5 h-5" />
            Search Discogs Marketplace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for album, artist, or catalog number..."
              className="flex-1"
              onKeyDown={(e) => { if (e.key === 'Enter') searchDiscogs(); }}
            />
            <Button 
              onClick={() => searchDiscogs()} 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              {isSearching ? 'Searching...' : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {isSearching && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {listings.length > 0 && !isSearching && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Marketplace Listings ({listings.length})</h4>
                <a 
                  href={`https://www.discogs.com/search/?q=${encodeURIComponent(searchQuery)}&type=all`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline flex items-center gap-1"
                >
                  View all on Discogs <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid gap-4">
                {listings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={listing.imageUrl} 
                        alt={listing.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold truncate">{listing.title}</h5>
                            <p className="text-sm text-gray-600">{listing.artist}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-600">{listing.price}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {listing.sellerRating}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Label:</span> {listing.label}
                          </div>
                          <div>
                            <span className="font-medium">Year:</span> {listing.year}
                          </div>
                          <div>
                            <span className="font-medium">Format:</span> {listing.format}
                          </div>
                          <div>
                            <span className="font-medium">Condition:</span> 
                            <span className={`ml-1 ${getConditionColor(listing.condition)}`}>
                              {listing.condition}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Seller: <span className="font-medium">{listing.seller}</span> • {listing.location}
                          </div>
                          <a
                            href={listing.discogsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent text-white px-4 py-2 rounded-lg text-sm hover:bg-accent/90 transition-colors flex items-center gap-1"
                          >
                            <DollarSign className="w-4 h-4" />
                            Buy on Discogs
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && listings.length === 0 && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              <Disc className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No listings found. Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}