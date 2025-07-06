import { useState } from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserLocation } from '@/hooks/use-location';
import { useToast } from '@/hooks/use-toast';

interface VinylStore {
  name: string;
  address: string;
  distance: string;
  phone?: string;
  hours?: string;
  website?: string;
}

interface VinylStoreFinderProps {
  albumTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VinylStoreFinder({ albumTitle, isOpen, onClose }: VinylStoreFinderProps) {
  const [stores, setStores] = useState<VinylStore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { latitude, longitude, error, loading, requestLocation } = useUserLocation();
  const { toast } = useToast();

  const findNearbyStores = async () => {
    if (!latitude || !longitude) {
      requestLocation();
      return;
    }

    setIsSearching(true);
    
    // Simulate API call to find vinyl stores
    // In reality, you'd use Google Places API, Yelp API, or Foursquare API
    try {
      // Simulated vinyl stores based on common chains and independent stores
      const mockStores: VinylStore[] = [
        {
          name: "Vinyl Revolution Records",
          address: "1234 Music Ave, Downtown",
          distance: "0.3 miles",
          phone: "(555) 123-4567",
          hours: "Mon-Sat 10AM-8PM, Sun 12PM-6PM",
          website: "https://vinylrevolution.com"
        },
        {
          name: "Spinning Disc Emporium",
          address: "5678 Groove St, Arts District",
          distance: "0.7 miles", 
          phone: "(555) 987-6543",
          hours: "Daily 11AM-9PM",
          website: "https://spinningdisc.com"
        },
        {
          name: "The Record Crate",
          address: "9012 Beat Blvd, Midtown",
          distance: "1.2 miles",
          phone: "(555) 456-7890",
          hours: "Tue-Sun 10AM-7PM",
          website: "https://recordcrate.com"
        },
        {
          name: "Analog Dreams Music",
          address: "3456 Vinyl Way, Eastside",
          distance: "1.5 miles",
          phone: "(555) 234-5678",
          hours: "Mon-Fri 12PM-8PM, Sat-Sun 10AM-9PM"
        }
      ];

      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStores(mockStores);
      toast({
        title: "Stores found!",
        description: `Found ${mockStores.length} vinyl stores near you.`,
      });
    } catch (err) {
      toast({
        title: "Search failed",
        description: "Could not find vinyl stores. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleStoreClick = (store: VinylStore) => {
    // In a real implementation, this would:
    // 1. Open maps with directions
    // 2. Search for the specific album in their inventory
    // 3. Show real-time availability
    const query = encodeURIComponent(`${store.name} ${store.address}`);
    window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find "{albumTitle}" on Vinyl
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!latitude || !longitude ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location Access Needed</h3>
              <p className="text-gray-600 mb-4">
                We need your location to find vinyl stores near you.
              </p>
              {error && (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              )}
              <Button 
                onClick={requestLocation} 
                disabled={loading}
                className="bg-accent hover:bg-accent/90"
              >
                {loading ? 'Getting Location...' : 'Allow Location Access'}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
                <Button 
                  onClick={findNearbyStores} 
                  disabled={isSearching}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isSearching ? 'Searching...' : 'Find Vinyl Stores'}
                </Button>
              </div>

              {stores.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Nearby Vinyl Stores:</h4>
                  {stores.map((store, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleStoreClick(store)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold">{store.name}</h5>
                        <span className="text-sm text-accent font-medium">{store.distance}</span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {store.address}
                        </div>
                        
                        {store.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {store.phone}
                          </div>
                        )}
                        
                        {store.hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {store.hours}
                          </div>
                        )}
                        
                        {store.website && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <a 
                              href={store.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}