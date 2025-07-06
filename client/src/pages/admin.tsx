import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Volume2, Eye, Hand, Circle, FileText, Code, Upload, Edit, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import type { MusicRelease, Track, Photo, CorePage, NotePage, Merchandise, CodeEntry } from "@shared/schema";
import SortableList from "@/components/sortable-list";

// Release Card Component with Track Management
function ReleaseCard({ release, onEditRelease }: { release: MusicRelease; onEditRelease: (release: MusicRelease) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showTracks, setShowTracks] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
  const [editingTrackData, setEditingTrackData] = useState<any>(null);

  // Fetch tracks for this release
  const { data: tracks = [] } = useQuery<Track[]>({ 
    queryKey: ["/api/tracks", release.id],
    queryFn: () => fetch(`/api/tracks/${release.id}`).then(res => res.json()),
    enabled: showTracks
  });

  // Track mutations
  const updateTrackMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/tracks/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks", release.id] });
      setEditingTrackId(null);
      setEditingTrackData(null);
      toast({ title: "Success", description: "Track updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update track: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: number) => {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks", release.id] });
      toast({ title: "Success", description: "Track deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete track: ${error.message}`, variant: "destructive" });
    },
  });

  const startEditingTrack = (track: Track) => {
    setEditingTrackId(track.id);
    setEditingTrackData({
      title: track.title,
      duration: track.duration || "",
      spotifyUrl: track.spotifyUrl || "",
      appleUrl: track.appleUrl || "",
      youtubeUrl: track.youtubeUrl || "",
      bandcampUrl: track.bandcampUrl || "",
    });
  };

  const cancelTrackEdit = () => {
    setEditingTrackId(null);
    setEditingTrackData(null);
  };

  const saveTrackEdit = () => {
    if (editingTrackId && editingTrackData) {
      updateTrackMutation.mutate({
        id: editingTrackId,
        ...editingTrackData,
      });
    }
  };

  const handleDeleteTrack = (trackId: number) => {
    if (confirm("Are you sure you want to delete this track?")) {
      deleteTrackMutation.mutate(trackId);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between p-4">
        <div>
          <h4 className="font-medium">{release.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {release.artist} • {release.year} • {release.genre}
          </p>
          {release.catalogNumber && (
            <Badge variant="outline" className="mt-1">
              {release.catalogNumber}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowTracks(!showTracks)}
          >
            {showTracks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Tracks
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEditRelease(release)}
          >
            Edit Release
          </Button>
        </div>
      </div>
      
      {showTracks && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <h5 className="font-medium mb-3">Tracks ({tracks.length})</h5>
          <div className="space-y-2">
            {tracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded min-h-[60px]">
                {editingTrackId === track.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      value={editingTrackData?.title || ""}
                      onChange={(e) => setEditingTrackData({ ...editingTrackData, title: e.target.value })}
                      placeholder="Track title"
                    />
                    <Input
                      value={editingTrackData?.duration || ""}
                      onChange={(e) => setEditingTrackData({ ...editingTrackData, duration: e.target.value })}
                      placeholder="Duration"
                    />
                    <Input
                      value={editingTrackData?.spotifyUrl || ""}
                      onChange={(e) => setEditingTrackData({ ...editingTrackData, spotifyUrl: e.target.value })}
                      placeholder="Spotify URL"
                    />
                    <Input
                      value={editingTrackData?.youtubeUrl || ""}
                      onChange={(e) => setEditingTrackData({ ...editingTrackData, youtubeUrl: e.target.value })}
                      placeholder="YouTube URL"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-6 flex-shrink-0">
                      {track.trackNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      {track.duration && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{track.duration}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {editingTrackId === track.id ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={saveTrackEdit} 
                        disabled={updateTrackMutation.isPending}
                        className="w-8 h-8 p-0 hover:bg-muted flex items-center justify-center"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={cancelTrackEdit}
                        className="w-8 h-8 p-0 hover:bg-muted flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEditingTrack(track)}
                        className="w-8 h-8 p-0 hover:bg-muted flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteTrack(track.id)}
                        disabled={deleteTrackMutation.isPending}
                        className="w-8 h-8 p-0 hover:bg-muted flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {tracks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No tracks added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("music");

  // Edit mode state
  const [editMode, setEditMode] = useState<{
    type: "release" | "photo" | "corePage" | "notePage" | "merchandise" | "codeEntry" | null;
    item: any;
  }>({ type: null, item: null });

  // Image upload state
  const [uploading, setUploading] = useState(false);

  // Helper function to upload image
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const result = await response.json();
    return result.imageUrl;
  };

  // Helper function to upload files
  const uploadFile = async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const result = await response.json();
    return result;
  };

  // Fetch existing data
  const { data: releases = [] } = useQuery<MusicRelease[]>({ queryKey: ["/api/music"] });
  const { data: photos = [] } = useQuery<Photo[]>({ queryKey: ["/api/photos"] });
  const { data: corePages = [] } = useQuery<CorePage[]>({ queryKey: ["/api/core-pages"] });
  const { data: notePages = [] } = useQuery<NotePage[]>({ queryKey: ["/api/note-pages"] });
  const { data: merchandise = [] } = useQuery<Merchandise[]>({ queryKey: ["/api/merchandise"] });
  const { data: codeEntries = [] } = useQuery<CodeEntry[]>({ queryKey: ["/api/code-entries"] });

  // Sortable state management
  const [sortablePhotos, setSortablePhotos] = useState<Photo[]>([]);
  const [sortableReleases, setSortableReleases] = useState<MusicRelease[]>([]);
  const [sortableMerchandise, setSortableMerchandise] = useState<Merchandise[]>([]);
  const [sortableCorePages, setSortableCorePages] = useState<CorePage[]>([]);
  const [sortableNotePages, setSortableNotePages] = useState<NotePage[]>([]);
  const [sortableCodeEntries, setSortableCodeEntries] = useState<CodeEntry[]>([]);

  // Update sortable arrays when data changes
  useEffect(() => {
    setSortablePhotos([...photos]);
  }, [photos]);

  useEffect(() => {
    setSortableReleases([...releases]);
  }, [releases]);

  useEffect(() => {
    setSortableMerchandise([...merchandise]);
  }, [merchandise]);

  useEffect(() => {
    setSortableCorePages([...corePages]);
  }, [corePages]);

  useEffect(() => {
    setSortableNotePages([...notePages]);
  }, [notePages]);

  useEffect(() => {
    setSortableCodeEntries([...codeEntries]);
  }, [codeEntries]);

  // Release form state
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    artist: "",
    year: new Date().getFullYear(),
    genre: "",
    description: "",
    coverImage: "",
    catalogNumber: "",
    label: "",
    spotifyUrl: "",
    appleUrl: "",
    buyUrl: "",
    bandcampUrl: "",
    ninaProtocolUrl: "",
    youtubeUrl: "",
    primaryAudioSource: "spotify",
    enableLocationBasedBuy: false,
    enableDiscogsSearch: false,
  });

  // Track management state
  const [tracks, setTracks] = useState<Array<{
    trackNumber: number;
    title: string;
    duration: string;
    spotifyUrl: string;
    appleUrl: string;
    youtubeUrl: string;
    bandcampUrl: string;
  }>>([]);

  const [currentTrack, setCurrentTrack] = useState({
    trackNumber: 1,
    title: "",
    duration: "",
    spotifyUrl: "",
    appleUrl: "",
    youtubeUrl: "",
    bandcampUrl: "",
  });

  // Photo form state
  const [photoForm, setPhotoForm] = useState({
    title: "",
    location: "",
    category: "places" as "backstage" | "people" | "places",
    imageUrl: "",
    year: new Date().getFullYear(),
  });

  // Core page form state
  const [corePageForm, setCorePageForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "about" as "about" | "bio" | "statement",
    featuredImage: "",
    isPublished: true,
  });

  // Note page form state
  const [notePageForm, setNotePageForm] = useState({
    title: "",
    content: "",
    tags: "",
    category: "reflection" as "reflection" | "idea" | "observation" | "events",
    eventLocation: "",
    ticketLink: "",
    eventDate: "",
    featuredImage: "",
    isPublished: true,
  });

  // Merchandise form state
  const [merchandiseForm, setMerchandiseForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "apparel" as "apparel" | "vinyl" | "artwork" | "accessories",
    imageUrl: "",
    available: true,
  });

  // Code entry form state
  const [codeEntryForm, setCodeEntryForm] = useState({
    title: "",
    description: "",
    code: "",
    downloadUrl: "",
    downloadName: "",
    isActive: true,
  });

  // Bulk code generator state
  const [bulkCodeForm, setBulkCodeForm] = useState({
    title: "",
    description: "",
    downloadName: "",
    count: 1,
    isActive: true,
  });

  // File upload state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showBulkGenerator, setShowBulkGenerator] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [photoSearchQuery, setPhotoSearchQuery] = useState("");
  const [corePageSearchQuery, setCorePageSearchQuery] = useState("");
  const [notePageSearchQuery, setNotePageSearchQuery] = useState("");
  const [merchandiseSearchQuery, setMerchandiseSearchQuery] = useState("");
  const [codeEntrySearchQuery, setCodeEntrySearchQuery] = useState("");

  // Track editing state
  const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
  const [editingTrackData, setEditingTrackData] = useState<any>(null);

  // Filter releases based on search query
  const filteredReleases = sortableReleases.filter(release =>
    release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (release.catalogNumber && release.catalogNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter photos based on search query
  const filteredPhotos = sortablePhotos.filter(photo =>
    photo.title.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
    photo.location.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
    photo.category.toLowerCase().includes(photoSearchQuery.toLowerCase())
  );

  // Filter core pages based on search query
  const filteredCorePages = sortableCorePages.filter(page =>
    page.title.toLowerCase().includes(corePageSearchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(corePageSearchQuery.toLowerCase()) ||
    (page.category && page.category.toLowerCase().includes(corePageSearchQuery.toLowerCase()))
  );

  // Filter note pages based on search query
  const filteredNotePages = sortableNotePages.filter(page =>
    page.title.toLowerCase().includes(notePageSearchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(notePageSearchQuery.toLowerCase()) ||
    (page.category && page.category.toLowerCase().includes(notePageSearchQuery.toLowerCase()))
  );

  // Filter merchandise based on search query
  const filteredMerchandise = sortableMerchandise.filter(item =>
    item.title.toLowerCase().includes(merchandiseSearchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(merchandiseSearchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(merchandiseSearchQuery.toLowerCase())
  );

  // Filter code entries based on search query
  const filteredCodeEntries = sortableCodeEntries.filter(entry =>
    entry.title.toLowerCase().includes(codeEntrySearchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(codeEntrySearchQuery.toLowerCase()) ||
    entry.code.toLowerCase().includes(codeEntrySearchQuery.toLowerCase())
  );

  // Mutations
  const createReleaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create release");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music"] });
      setReleaseForm({
        title: "",
        artist: "",
        year: new Date().getFullYear(),
        genre: "",
        description: "",
        coverImage: "",
        catalogNumber: "",
        label: "",
        spotifyUrl: "",
        appleUrl: "",
        buyUrl: "",
        bandcampUrl: "",
        ninaProtocolUrl: "",
        youtubeUrl: "",
        primaryAudioSource: "spotify",
        enableLocationBasedBuy: false,
        enableDiscogsSearch: false,
      });
      toast({ title: "Success", description: "Music release created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create release: ${error.message}`, variant: "destructive" });
    },
  });

  // Function to add track to current release
  const addTrackToRelease = () => {
    if (!currentTrack.title.trim()) {
      toast({ title: "Error", description: "Track title is required", variant: "destructive" });
      return;
    }

    const newTrack = {
      ...currentTrack,
      trackNumber: tracks.length + 1,
    };

    setTracks([...tracks, newTrack]);
    setCurrentTrack({
      trackNumber: tracks.length + 2,
      title: "",
      duration: "",
      spotifyUrl: "",
      appleUrl: "",
      youtubeUrl: "",
      bandcampUrl: "",
    });
    toast({ title: "Success", description: "Track added to release" });
  };

  const removeTrackFromRelease = (index: number) => {
    const updatedTracks = tracks.filter((_, i) => i !== index);
    // Renumber tracks
    const renumberedTracks = updatedTracks.map((track, i) => ({
      ...track,
      trackNumber: i + 1,
    }));
    setTracks(renumberedTracks);
    setCurrentTrack({
      ...currentTrack,
      trackNumber: renumberedTracks.length + 1,
    });
  };

  const createPhotoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create photo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setPhotoForm({
        title: "",
        location: "",
        category: "places",
        imageUrl: "",
        year: new Date().getFullYear(),
      });
      toast({ title: "Success", description: "Photo created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create photo: ${error.message}`, variant: "destructive" });
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/photos/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update photo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setEditMode({ type: null, item: null });
      setPhotoForm({
        title: "",
        location: "",
        category: "places",
        imageUrl: "",
        year: new Date().getFullYear(),
      });
      toast({ title: "Success", description: "Photo updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update photo: ${error.message}`, variant: "destructive" });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: number) => {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete photo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Success", description: "Photo deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete photo: ${error.message}`, variant: "destructive" });
    },
  });

  const createCorePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/core-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create core page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/core-pages"] });
      setCorePageForm({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "about",
        featuredImage: "",
        isPublished: true,
      });
      toast({ title: "Success", description: "Core page created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create core page: ${error.message}`, variant: "destructive" });
    },
  });

  const createNotePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/note-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create note page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/note-pages"] });
      setNotePageForm({
        title: "",
        content: "",
        tags: "",
        category: "reflection",
        eventLocation: "",
        ticketLink: "",
        eventDate: "",
        featuredImage: "",
        isPublished: true,
      });
      toast({ title: "Success", description: "Note page created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create note page: ${error.message}`, variant: "destructive" });
    },
  });

  const createMerchandiseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/merchandise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create merchandise");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      setMerchandiseForm({
        title: "",
        description: "",
        price: "",
        category: "apparel",
        imageUrl: "",
        available: true,
      });
      toast({ title: "Success", description: "Merchandise item created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create merchandise: ${error.message}`, variant: "destructive" });
    },
  });

  const createCodeEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/code-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create code entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/code-entries"] });
      setCodeEntryForm({
        title: "",
        description: "",
        code: "",
        downloadUrl: "",
        downloadName: "",
        isActive: true,
      });
      toast({ title: "Success", description: "Code entry created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create code entry: ${error.message}`, variant: "destructive" });
    },
  });

  const createBulkCodesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/code-entries/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create bulk codes");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/code-entries"] });
      setBulkCodeForm({
        title: "",
        description: "",
        downloadName: "",
        count: 1,
        isActive: true,
      });
      setShowBulkGenerator(false);
      toast({ title: "Success", description: `${data.count} codes generated successfully` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to generate bulk codes: ${error.message}`, variant: "destructive" });
    },
  });

  // Update mutations
  const updateReleaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/music/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update release");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music"] });
      setEditMode({ type: null, item: null });
      toast({ title: "Success", description: "Release updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update release: ${error.message}`, variant: "destructive" });
    },
  });

  const updateCorePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/core-pages/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update core page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/core-pages"] });
      setEditMode({ type: null, item: null });
      toast({ title: "Success", description: "Core page updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update core page: ${error.message}`, variant: "destructive" });
    },
  });

  const updateNotePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/note-pages/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update note page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/note-pages"] });
      setEditMode({ type: null, item: null });
      toast({ title: "Success", description: "Note page updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update note page: ${error.message}`, variant: "destructive" });
    },
  });

  const updateMerchandiseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/merchandise/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update merchandise");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      setEditMode({ type: null, item: null });
      toast({ title: "Success", description: "Merchandise updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update merchandise: ${error.message}`, variant: "destructive" });
    },
  });

  const updateCodeEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/code-entries/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update code entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/code-entries"] });
      setEditMode({ type: null, item: null });
      toast({ title: "Success", description: "Code entry updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update code entry: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteNotePageMutation = useMutation({
    mutationFn: async (notePageId: number) => {
      const response = await fetch(`/api/note-pages/${notePageId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/note-pages"] });
      toast({ title: "Success", description: "Note page deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete note page: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteCorePageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/core-pages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete core page");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/core-pages"] });
      toast({ title: "Success", description: "Core page deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete core page: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteMerchandiseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/merchandise/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete merchandise");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      toast({ title: "Success", description: "Merchandise deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete merchandise: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteCodeEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/code-entries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete code entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/code-entries"] });
      toast({ title: "Success", description: "Code entry deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete code entry: ${error.message}`, variant: "destructive" });
    },
  });

  // Track mutations
  const updateTrackMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/tracks/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
      setEditingTrackId(null);
      setEditingTrackData(null);
      toast({ title: "Success", description: "Track updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update track: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: number) => {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete track");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
      toast({ title: "Success", description: "Track deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to delete track: ${error.message}`, variant: "destructive" });
    },
  });

  // Helper functions for edit mode
  const startEditingRelease = (release: MusicRelease) => {
    setReleaseForm({
      title: release.title,
      artist: release.artist,
      year: release.year,
      genre: release.genre,
      description: release.description,
      coverImage: release.coverImage,
      catalogNumber: release.catalogNumber || "",
      label: release.label || "",
      spotifyUrl: release.spotifyUrl || "",
      appleUrl: release.appleUrl || "",
      buyUrl: release.buyUrl || "",
      bandcampUrl: release.bandcampUrl || "",
      ninaProtocolUrl: release.ninaProtocolUrl || "",
      youtubeUrl: release.youtubeUrl || "",
      primaryAudioSource: release.primaryAudioSource || "spotify",
      enableLocationBasedBuy: !!release.enableLocationBasedBuy,
      enableDiscogsSearch: !!release.enableDiscogsSearch,
    });
    setEditMode({ type: "release", item: release });
  };

  const startEditingCorePage = (page: CorePage) => {
    setCorePageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || "",
      category: (page.category || "about") as "about" | "bio" | "statement",
      featuredImage: page.featuredImage || "",
      isPublished: !!page.isPublished,
    });
    setEditMode({ type: "corePage", item: page });
  };

  const startEditingNotePage = (page: NotePage) => {
    setNotePageForm({
      title: page.title,
      content: page.content,
      tags: page.tags || "",
      category: (page.category || "reflection") as "reflection" | "idea" | "observation" | "events",
      eventLocation: page.eventLocation || "",
      ticketLink: page.ticketLink || "",
      eventDate: page.eventDate || "",
      featuredImage: page.featuredImage || "",
      isPublished: !!page.isPublished,
    });
    setEditMode({ type: "notePage", item: page });
  };

  const startEditingPhoto = (photo: Photo) => {
    setPhotoForm({
      title: photo.title,
      location: photo.location,
      category: photo.category as "backstage" | "people" | "places",
      imageUrl: photo.imageUrl,
      year: photo.year,
    });
    setEditMode({ type: "photo", item: photo });
  };

  const startEditingMerchandise = (item: Merchandise) => {
    setMerchandiseForm({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category as "apparel" | "vinyl" | "artwork" | "accessories",
      imageUrl: item.imageUrl,
      available: !!item.available,
    });
    setEditMode({ type: "merchandise", item });
  };

  const startEditingCodeEntry = (entry: CodeEntry) => {
    setCodeEntryForm({
      title: entry.title,
      description: entry.description,
      code: entry.code,
      downloadUrl: entry.downloadUrl,
      downloadName: entry.downloadName,
      isActive: !!entry.isActive,
    });
    setEditMode({ type: "codeEntry", item: entry });
  };

  const cancelEdit = () => {
    setEditMode({ type: null, item: null });
    // Reset forms to default state
    setReleaseForm({
      title: "",
      artist: "",
      year: new Date().getFullYear(),
      genre: "",
      description: "",
      coverImage: "",
      catalogNumber: "",
      label: "",
      spotifyUrl: "",
      appleUrl: "",
      buyUrl: "",
      bandcampUrl: "",
      ninaProtocolUrl: "",
      youtubeUrl: "",
      primaryAudioSource: "spotify",
      enableLocationBasedBuy: false,
      enableDiscogsSearch: false,
    });
    setPhotoForm({
      title: "",
      location: "",
      category: "places",
      imageUrl: "",
      year: new Date().getFullYear(),
    });
    setCorePageForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "about",
      featuredImage: "",
      isPublished: true,
    });
    setNotePageForm({
      title: "",
      content: "",
      tags: "",
      category: "reflection",
      eventLocation: "",
      ticketLink: "",
      eventDate: "",
      featuredImage: "",
      isPublished: true,
    });
    setMerchandiseForm({
      title: "",
      description: "",
      price: "",
      category: "apparel",
      imageUrl: "",
      available: true,
    });
    setCodeEntryForm({
      title: "",
      description: "",
      code: "",
      downloadUrl: "",
      downloadName: "",
      isActive: true,
    });
  };

  // Track editing helpers
  const startEditingTrack = (track: any) => {
    setEditingTrackId(track.id);
    setEditingTrackData({
      title: track.title,
      duration: track.duration || "",
      spotifyUrl: track.spotifyUrl || "",
      appleUrl: track.appleUrl || "",
      youtubeUrl: track.youtubeUrl || "",
      bandcampUrl: track.bandcampUrl || "",
    });
  };

  const cancelTrackEdit = () => {
    setEditingTrackId(null);
    setEditingTrackData(null);
  };

  const saveTrackEdit = () => {
    if (editingTrackId && editingTrackData) {
      updateTrackMutation.mutate({
        id: editingTrackId,
        ...editingTrackData,
      });
    }
  };

  const handleDeleteTrack = (trackId: number) => {
    if (confirm("Are you sure you want to delete this track?")) {
      deleteTrackMutation.mutate(trackId);
    }
  };

  const handleReleaseWithTracksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editMode.type === "release" && editMode.item) {
        // Update existing release
        await updateReleaseMutation.mutateAsync({
          ...releaseForm,
          id: editMode.item.id,
          enableLocationBasedBuy: releaseForm.enableLocationBasedBuy ? 1 : 0,
          enableDiscogsSearch: releaseForm.enableDiscogsSearch ? 1 : 0,
        });
      } else {
        // Create new release
        const releaseResponse = await fetch("/api/music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...releaseForm,
            enableLocationBasedBuy: releaseForm.enableLocationBasedBuy ? 1 : 0,
            enableDiscogsSearch: releaseForm.enableDiscogsSearch ? 1 : 0,
          }),
        });
        
        if (!releaseResponse.ok) throw new Error("Failed to create release");
        const newRelease = await releaseResponse.json();
        
        // Then create tracks if any
        if (tracks.length > 0) {
          for (const track of tracks) {
            await fetch("/api/tracks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...track,
                releaseId: newRelease.id,
              }),
            });
          }
        }
        
        // Reset forms
        setReleaseForm({
          title: "",
          artist: "",
          year: new Date().getFullYear(),
          genre: "",
          description: "",
          coverImage: "",
          catalogNumber: "",
          label: "",
          spotifyUrl: "",
          appleUrl: "",
          buyUrl: "",
          bandcampUrl: "",
          ninaProtocolUrl: "",
          youtubeUrl: "",
          primaryAudioSource: "spotify",
          enableLocationBasedBuy: false,
          enableDiscogsSearch: false,
        });
        setTracks([]);
        setCurrentTrack({
          trackNumber: 1,
          title: "",
          duration: "",
          spotifyUrl: "",
          appleUrl: "",
          youtubeUrl: "",
          bandcampUrl: "",
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/music"] });
        queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
        toast({ title: "Success", description: `Release "${newRelease.title}" created with ${tracks.length} tracks` });
      }
    } catch (error) {
      toast({ title: "Error", description: editMode.type === "release" ? "Failed to update release" : "Failed to create release", variant: "destructive" });
    }
  };

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode.type === "photo" && editMode.item) {
      updatePhotoMutation.mutate({
        ...photoForm,
        id: editMode.item.id,
      });
    } else {
      createPhotoMutation.mutate(photoForm);
    }
  };

  const handleCorePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...corePageForm,
      isPublished: corePageForm.isPublished ? 1 : 0,
    };

    if (editMode.type === "corePage" && editMode.item) {
      updateCorePageMutation.mutate({
        ...formData,
        id: editMode.item.id,
      });
    } else {
      createCorePageMutation.mutate(formData);
    }
  };

  const handleNotePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...notePageForm,
      isPublished: notePageForm.isPublished ? 1 : 0,
    };

    if (editMode.type === "notePage" && editMode.item) {
      updateNotePageMutation.mutate({
        ...formData,
        id: editMode.item.id,
      });
    } else {
      createNotePageMutation.mutate(formData);
    }
  };

  const handleMerchandiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...merchandiseForm,
      available: merchandiseForm.available ? 1 : 0,
    };

    if (editMode.type === "merchandise" && editMode.item) {
      updateMerchandiseMutation.mutate({
        ...formData,
        id: editMode.item.id,
      });
    } else {
      createMerchandiseMutation.mutate(formData);
    }
  };

  const handleCodeEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...codeEntryForm,
      isActive: codeEntryForm.isActive ? 1 : 0,
    };

    if (editMode.type === "codeEntry" && editMode.item) {
      updateCodeEntryMutation.mutate({
        ...formData,
        id: editMode.item.id,
      });
    } else {
      createCodeEntryMutation.mutate(formData);
    }
  };

  const handleBulkCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBulkCodesMutation.mutate({
      ...bulkCodeForm,
      downloadUrl: codeEntryForm.downloadUrl, // Use the main form's download URL
      isActive: bulkCodeForm.isActive,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black text-black dark:text-[#F3EFE0] transition-colors duration-300">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">Content Management Portal</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage content for ECHO, VIEW, FORM, CODE, CORE, and NOTE pages
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              ECHO
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              VIEW
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex items-center gap-2">
              <Hand className="w-4 h-4" />
              FORM
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              CODE
            </TabsTrigger>
            <TabsTrigger value="core" className="flex items-center gap-2">
              <Circle className="w-4 h-4" />
              CORE
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              NOTE
            </TabsTrigger>
          </TabsList>

          {/* Music & Tracks Tab */}
          <TabsContent value="music" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    {editMode.type === "release" ? "Edit Music Release" : "Add New Music Release"}
                  </div>
                  {editMode.type === "release" && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReleaseWithTracksSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={releaseForm.title}
                        onChange={(e) => setReleaseForm({ ...releaseForm, title: e.target.value })}
                        placeholder="Release title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="artist">Artist</Label>
                      <Input
                        id="artist"
                        value={releaseForm.artist}
                        onChange={(e) => setReleaseForm({ ...releaseForm, artist: e.target.value })}
                        placeholder="Artist name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={releaseForm.year}
                        onChange={(e) => setReleaseForm({ ...releaseForm, year: parseInt(e.target.value) })}
                        placeholder="2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Input
                        id="genre"
                        value={releaseForm.genre}
                        onChange={(e) => setReleaseForm({ ...releaseForm, genre: e.target.value })}
                        placeholder="Electronic, Jungle, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="catalogNumber">Catalog Number</Label>
                      <Input
                        id="catalogNumber"
                        value={releaseForm.catalogNumber}
                        onChange={(e) => setReleaseForm({ ...releaseForm, catalogNumber: e.target.value })}
                        placeholder="CAT001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={releaseForm.label}
                        onChange={(e) => setReleaseForm({ ...releaseForm, label: e.target.value })}
                        placeholder="Record label"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={releaseForm.description}
                      onChange={(e) => setReleaseForm({ ...releaseForm, description: e.target.value })}
                      placeholder="Release description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImageFile">Upload Cover Image</Label>
                    <Input
                      id="coverImageFile"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          try {
                            const imageUrl = await uploadImage(file);
                            setReleaseForm({ ...releaseForm, coverImage: imageUrl });
                            toast({ title: "Success", description: "Cover image uploaded successfully" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to upload cover image", variant: "destructive" });
                          } finally {
                            setUploading(false);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500">Uploading cover image...</p>}
                    {releaseForm.coverImage && (
                      <div className="mt-2">
                        <img 
                          src={releaseForm.coverImage} 
                          alt="Cover Preview" 
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="spotifyUrl">Spotify URL</Label>
                      <Input
                        id="spotifyUrl"
                        value={releaseForm.spotifyUrl}
                        onChange={(e) => setReleaseForm({ ...releaseForm, spotifyUrl: e.target.value })}
                        placeholder="https://open.spotify.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appleUrl">Apple Music URL</Label>
                      <Input
                        id="appleUrl"
                        value={releaseForm.appleUrl}
                        onChange={(e) => setReleaseForm({ ...releaseForm, appleUrl: e.target.value })}
                        placeholder="https://music.apple.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bandcampUrl">Bandcamp URL</Label>
                      <Input
                        id="bandcampUrl"
                        value={releaseForm.bandcampUrl}
                        onChange={(e) => setReleaseForm({ ...releaseForm, bandcampUrl: e.target.value })}
                        placeholder="https://artist.bandcamp.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtubeUrl">YouTube URL</Label>
                      <Input
                        id="youtubeUrl"
                        value={releaseForm.youtubeUrl}
                        onChange={(e) => setReleaseForm({ ...releaseForm, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryAudioSource">Primary Audio Source</Label>
                    <Select 
                      value={releaseForm.primaryAudioSource} 
                      onValueChange={(value) => setReleaseForm({ ...releaseForm, primaryAudioSource: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spotify">Spotify</SelectItem>
                        <SelectItem value="apple">Apple Music</SelectItem>
                        <SelectItem value="bandcamp">Bandcamp</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableLocationBasedBuy"
                        checked={releaseForm.enableLocationBasedBuy}
                        onCheckedChange={(checked) => 
                          setReleaseForm({ ...releaseForm, enableLocationBasedBuy: !!checked })
                        }
                      />
                      <Label htmlFor="enableLocationBasedBuy">Enable Location-Based Buy</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableDiscogsSearch"
                        checked={releaseForm.enableDiscogsSearch}
                        onCheckedChange={(checked) => 
                          setReleaseForm({ ...releaseForm, enableDiscogsSearch: !!checked })
                        }
                      />
                      <Label htmlFor="enableDiscogsSearch">Enable Discogs Search</Label>
                    </div>
                  </div>

                  {/* Track Management Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Tracks for this Release</h3>
                      <Badge variant="outline">{tracks.length} tracks</Badge>
                    </div>

                    {/* Add Track Form */}
                    <div className="border dark:border-gray-700 rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Add Track</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentTrackTitle">Track Title</Label>
                          <Input
                            id="currentTrackTitle"
                            value={currentTrack.title}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, title: e.target.value })}
                            placeholder="Track name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currentTrackDuration">Duration</Label>
                          <Input
                            id="currentTrackDuration"
                            value={currentTrack.duration}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, duration: e.target.value })}
                            placeholder="3:45"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentTrackSpotify">Spotify URL</Label>
                          <Input
                            id="currentTrackSpotify"
                            value={currentTrack.spotifyUrl}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, spotifyUrl: e.target.value })}
                            placeholder="https://open.spotify.com/track/..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentTrackApple">Apple Music URL</Label>
                          <Input
                            id="currentTrackApple"
                            value={currentTrack.appleUrl}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, appleUrl: e.target.value })}
                            placeholder="https://music.apple.com/..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentTrackYoutube">YouTube URL</Label>
                          <Input
                            id="currentTrackYoutube"
                            value={currentTrack.youtubeUrl}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentTrackBandcamp">Bandcamp URL</Label>
                          <Input
                            id="currentTrackBandcamp"
                            value={currentTrack.bandcampUrl}
                            onChange={(e) => setCurrentTrack({ ...currentTrack, bandcampUrl: e.target.value })}
                            placeholder="https://artist.bandcamp.com/track/..."
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" onClick={addTrackToRelease} variant="outline" size="sm">
                          Add Track
                        </Button>
                      </div>
                    </div>

                    {/* Track List */}
                    {tracks.length > 0 && (
                      <div className="space-y-2">
                        {tracks.map((track, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="text-xs">{track.trackNumber}</Badge>
                              <div>
                                <p className="font-medium text-sm">{track.title}</p>
                                {track.duration && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{track.duration}</p>
                                )}
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              onClick={() => removeTrackFromRelease(index)} 
                              variant="ghost" 
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800 dark:bg-[#F3EFE0] dark:hover:bg-[#E5E0D0] dark:text-black"
                  >
                    {editMode.type === "release" ? "Update Release" : `Create Release ${tracks.length > 0 ? `with ${tracks.length} tracks` : ""}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Releases */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Releases ({releases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Releases</Label>
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, artist, genre, or catalog number..."
                      className="w-full"
                    />
                  </div>
                  
                  {/* Results Counter */}
                  {searchQuery && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {filteredReleases.length} of {releases.length} releases
                    </p>
                  )}
                  
                  {filteredReleases.length > 0 ? (
                    <SortableList
                      items={filteredReleases}
                      onReorder={(reorderedReleases) => setSortableReleases(reorderedReleases)}
                      getId={(release) => release.id.toString()}
                      className="space-y-4"
                      renderItem={(release) => <ReleaseCard release={release} onEditRelease={startEditingRelease} />}
                    />
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No releases found matching "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try searching by title, artist, genre, or catalog number</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {editMode.type === "photo" ? "Edit Photo" : "Add New Photo"}
                  </div>
                  {editMode.type === "photo" && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhotoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="photoTitle">Title</Label>
                      <Input
                        id="photoTitle"
                        value={photoForm.title}
                        onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                        placeholder="Photo title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={photoForm.location}
                        onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                        placeholder="City, Country"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={photoForm.category} 
                        onValueChange={(value: "backstage" | "people" | "places") => 
                          setPhotoForm({ ...photoForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="backstage">Back Stage</SelectItem>
                          <SelectItem value="people">People</SelectItem>
                          <SelectItem value="places">Places</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photoYear">Year</Label>
                      <Input
                        id="photoYear"
                        type="number"
                        value={photoForm.year}
                        onChange={(e) => setPhotoForm({ ...photoForm, year: parseInt(e.target.value) })}
                        placeholder="2024"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageFile">Upload Image</Label>
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          try {
                            const imageUrl = await uploadImage(file);
                            setPhotoForm({ ...photoForm, imageUrl });
                            toast({ title: "Success", description: "Image uploaded successfully" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
                          } finally {
                            setUploading(false);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                    {photoForm.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={photoForm.imageUrl} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={createPhotoMutation.isPending || updatePhotoMutation.isPending}
                    >
                      {editMode.type === "photo" ? 
                        (updatePhotoMutation.isPending ? "Updating..." : "Update Photo") :
                        (createPhotoMutation.isPending ? "Creating..." : "Create Photo")
                      }
                    </Button>
                    {editMode.type === "photo" && editMode.item && (
                      <>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          variant="destructive"
                          onClick={() => deletePhotoMutation.mutate(editMode.item.id)}
                          disabled={deletePhotoMutation.isPending}
                        >
                          {deletePhotoMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Photos */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Photos ({filteredPhotos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search photos by title, location, or category..."
                    value={photoSearchQuery}
                    onChange={(e) => setPhotoSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <SortableList
                  items={filteredPhotos}
                  onReorder={(reorderedPhotos) => setSortablePhotos(reorderedPhotos)}
                  getId={(photo) => photo.id.toString()}
                  className="space-y-4"
                  renderItem={(photo) => (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex gap-4">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title} 
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{photo.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {photo.location} • {photo.year}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {photo.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingPhoto(photo)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePhotoMutation.mutate(photo.id)}
                            disabled={deletePhotoMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Entries Tab */}
          <TabsContent value="code" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {editMode.type === "codeEntry" ? "Edit Code Entry" : "Add New Code Entry"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCodeEntrySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="codeTitle">Title</Label>
                      <Input
                        id="codeTitle"
                        value={codeEntryForm.title}
                        onChange={(e) => setCodeEntryForm({ ...codeEntryForm, title: e.target.value })}
                        placeholder="Download title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codeValue">Access Code</Label>
                      <Input
                        id="codeValue"
                        value={codeEntryForm.code}
                        onChange={(e) => setCodeEntryForm({ ...codeEntryForm, code: e.target.value.toUpperCase() })}
                        placeholder="UNIQUE-CODE"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="downloadName">Download Name</Label>
                      <Input
                        id="downloadName"
                        value={codeEntryForm.downloadName}
                        onChange={(e) => setCodeEntryForm({ ...codeEntryForm, downloadName: e.target.value })}
                        placeholder="Exclusive Track.mp3"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeDescription">Description</Label>
                    <Textarea
                      id="codeDescription"
                      value={codeEntryForm.description}
                      onChange={(e) => setCodeEntryForm({ ...codeEntryForm, description: e.target.value })}
                      placeholder="Description of the exclusive content..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2">
                    <Label htmlFor="fileUpload">Upload File to Host</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingFile(true);
                          try {
                            const result = await uploadFile(file);
                            setCodeEntryForm({ 
                              ...codeEntryForm, 
                              downloadUrl: result.fileUrl,
                              downloadName: result.fileName 
                            });
                            toast({ title: "Success", description: "File uploaded successfully" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
                          } finally {
                            setUploadingFile(false);
                          }
                        }
                      }}
                      disabled={uploadingFile}
                    />
                    {uploadingFile && <p className="text-sm text-gray-500">Uploading file...</p>}
                    {codeEntryForm.downloadUrl && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        File ready: {codeEntryForm.downloadName}
                      </p>
                    )}
                  </div>

                  {/* Manual URL Entry */}
                  <div className="space-y-2">
                    <Label htmlFor="downloadUrl">Or Enter Download URL Manually</Label>
                    <Input
                      id="downloadUrl"
                      value={codeEntryForm.downloadUrl}
                      onChange={(e) => setCodeEntryForm({ ...codeEntryForm, downloadUrl: e.target.value })}
                      placeholder="https://example.com/download/file.zip"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="codeActive"
                      checked={codeEntryForm.isActive}
                      onCheckedChange={(checked) => 
                        setCodeEntryForm({ ...codeEntryForm, isActive: checked as boolean })
                      }
                    />
                    <Label htmlFor="codeActive">Code is active</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={createCodeEntryMutation.isPending || updateCodeEntryMutation.isPending || !codeEntryForm.downloadUrl}
                      className="flex-1 bg-black hover:bg-gray-800 dark:bg-[#F3EFE0] dark:hover:bg-[#E5E0D0] dark:text-black"
                    >
                      {editMode.type === "codeEntry" ? 
                        (updateCodeEntryMutation.isPending ? "Updating..." : "Update Code Entry") :
                        (createCodeEntryMutation.isPending ? "Creating..." : "Create Single Code")
                      }
                    </Button>
                    
                    {editMode.type === "codeEntry" && editMode.item ? (
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={() => deleteCodeEntryMutation.mutate(editMode.item.id)}
                        disabled={deleteCodeEntryMutation.isPending}
                        className="flex-1"
                      >
                        {deleteCodeEntryMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={() => setShowBulkGenerator(!showBulkGenerator)}
                        variant="outline"
                        className="flex-1"
                      >
                        {showBulkGenerator ? "Hide" : "Show"} Bulk Generator
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Bulk Code Generator */}
            {showBulkGenerator && (
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Bulk Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBulkCodeSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bulkTitle">Base Title</Label>
                        <Input
                          id="bulkTitle"
                          value={bulkCodeForm.title}
                          onChange={(e) => setBulkCodeForm({ ...bulkCodeForm, title: e.target.value })}
                          placeholder="Exclusive Track"
                          required
                        />
                        <p className="text-xs text-gray-500">Codes will be titled "Base Title #1", "Base Title #2", etc.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulkCount">Number of Codes</Label>
                        <Input
                          id="bulkCount"
                          type="number"
                          min="1"
                          max="100"
                          value={bulkCodeForm.count}
                          onChange={(e) => setBulkCodeForm({ ...bulkCodeForm, count: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulkDownloadName">Download File Name</Label>
                        <Input
                          id="bulkDownloadName"
                          value={bulkCodeForm.downloadName}
                          onChange={(e) => setBulkCodeForm({ ...bulkCodeForm, downloadName: e.target.value })}
                          placeholder="exclusive-track.mp3"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulkDescription">Description</Label>
                      <Textarea
                        id="bulkDescription"
                        value={bulkCodeForm.description}
                        onChange={(e) => setBulkCodeForm({ ...bulkCodeForm, description: e.target.value })}
                        placeholder="Description for all generated codes..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulkActive"
                        checked={bulkCodeForm.isActive}
                        onCheckedChange={(checked) => 
                          setBulkCodeForm({ ...bulkCodeForm, isActive: checked as boolean })
                        }
                      />
                      <Label htmlFor="bulkActive">All codes active</Label>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Note:</strong> This will use the download URL from the main form above. 
                        Make sure to upload a file or enter a URL first.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createBulkCodesMutation.isPending || !codeEntryForm.downloadUrl}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createBulkCodesMutation.isPending ? "Generating..." : `Generate ${bulkCodeForm.count} Codes`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Existing Code Entries */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Code Entries ({filteredCodeEntries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search code entries by title, description, or code..."
                    value={codeEntrySearchQuery}
                    onChange={(e) => setCodeEntrySearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <SortableList
                  items={filteredCodeEntries}
                  onReorder={(reorderedCodeEntries) => setSortableCodeEntries(reorderedCodeEntries)}
                  getId={(entry) => entry.id.toString()}
                  className="space-y-4"
                  renderItem={(entry) => (
                    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{entry.title}</h3>
                            <Badge variant={entry.isActive ? "default" : "secondary"} className="text-xs">
                              {entry.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mb-2">
                            {entry.code}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {entry.description}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Download: {entry.downloadName}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingCodeEntry(entry)}
                            className="text-xs h-7"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCodeEntryMutation.mutate(entry.id)}
                            disabled={deleteCodeEntryMutation.isPending}
                            className="text-xs h-7"
                          >
                            {deleteCodeEntryMutation.isPending ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Core Pages Tab */}
          <TabsContent value="core" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {editMode.type === "corePage" ? "Edit Core Page" : "Add New Core Page"}
                  </div>
                  {editMode.type === "corePage" && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCorePageSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="coreTitle">Title</Label>
                      <Input
                        id="coreTitle"
                        value={corePageForm.title}
                        onChange={(e) => setCorePageForm({ ...corePageForm, title: e.target.value })}
                        placeholder="Page title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={corePageForm.slug}
                        onChange={(e) => setCorePageForm({ ...corePageForm, slug: e.target.value })}
                        placeholder="url-friendly-slug"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coreCategory">Category</Label>
                      <Select 
                        value={corePageForm.category} 
                        onValueChange={(value: "about" | "bio" | "statement") => 
                          setCorePageForm({ ...corePageForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="bio">Biography</SelectItem>
                          <SelectItem value="statement">Artist Statement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        id="corePublished"
                        checked={corePageForm.isPublished}
                        onCheckedChange={(checked) => 
                          setCorePageForm({ ...corePageForm, isPublished: checked as boolean })
                        }
                      />
                      <Label htmlFor="corePublished" className="ml-2">Published</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                    <Textarea
                      id="excerpt"
                      value={corePageForm.excerpt}
                      onChange={(e) => setCorePageForm({ ...corePageForm, excerpt: e.target.value })}
                      placeholder="Brief description or excerpt"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coreImageFile">Featured Image (Optional)</Label>
                    <Input
                      id="coreImageFile"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          try {
                            const imageUrl = await uploadImage(file);
                            setCorePageForm({ ...corePageForm, featuredImage: imageUrl });
                            toast({ title: "Success", description: "Featured image uploaded successfully" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to upload featured image", variant: "destructive" });
                          } finally {
                            setUploading(false);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500">Uploading featured image...</p>}
                    {corePageForm.featuredImage && (
                      <div className="mt-2">
                        <img 
                          src={corePageForm.featuredImage} 
                          alt="Featured Image Preview" 
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={corePageForm.content}
                      onChange={(e) => setCorePageForm({ ...corePageForm, content: e.target.value })}
                      placeholder="Page content (supports markdown)"
                      rows={10}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createCorePageMutation.isPending || updateCorePageMutation.isPending}
                    className="w-full"
                  >
                    {(createCorePageMutation.isPending || updateCorePageMutation.isPending) 
                      ? (editMode.type === "corePage" ? "Updating..." : "Creating...") 
                      : (editMode.type === "corePage" ? "Update Core Page" : "Create Core Page")
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Core Pages */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Core Pages ({filteredCorePages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search core pages by title, content, or category..."
                    value={corePageSearchQuery}
                    onChange={(e) => setCorePageSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <SortableList
                  items={filteredCorePages}
                  onReorder={(reorderedCorePages) => setSortableCorePages(reorderedCorePages)}
                  getId={(page) => page.id.toString()}
                  className="space-y-4"
                  renderItem={(page) => (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{page.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            /{page.slug}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {page.category}
                            </Badge>
                            <Badge variant={page.isPublished ? "default" : "secondary"} className="text-xs">
                              {page.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          {page.excerpt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                              {page.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEditingCorePage(page)}
                            className="text-xs px-2 py-1 h-7"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteCorePageMutation?.mutate(page.id)}
                            disabled={deleteCorePageMutation?.isPending}
                            className="text-xs px-2 py-1 h-7"
                          >
                            {deleteCorePageMutation?.isPending ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Note Pages Tab */}
          <TabsContent value="notes" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {editMode.type === "notePage" ? "Edit Note Page" : "Add New Note Page"}
                  </div>
                  {editMode.type === "notePage" && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotePageSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="noteTitle">Title</Label>
                      <Input
                        id="noteTitle"
                        value={notePageForm.title}
                        onChange={(e) => setNotePageForm({ ...notePageForm, title: e.target.value })}
                        placeholder="Note title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noteCategory">Category</Label>
                      <Select 
                        value={notePageForm.category} 
                        onValueChange={(value: "reflection" | "idea" | "observation" | "events") => 
                          setNotePageForm({ ...notePageForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reflection">Reflection</SelectItem>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Event-specific fields */}
                    {notePageForm.category === "events" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="eventDate">Event Date</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={notePageForm.eventDate}
                            onChange={(e) => setNotePageForm({ ...notePageForm, eventDate: e.target.value })}
                            required={notePageForm.category === "events"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eventLocation">Event Location</Label>
                          <Input
                            id="eventLocation"
                            value={notePageForm.eventLocation}
                            onChange={(e) => setNotePageForm({ ...notePageForm, eventLocation: e.target.value })}
                            placeholder="Venue name, City, Country"
                            required={notePageForm.category === "events"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ticketLink">Ticket Link</Label>
                          <Input
                            id="ticketLink"
                            type="url"
                            value={notePageForm.ticketLink}
                            onChange={(e) => setNotePageForm({ ...notePageForm, ticketLink: e.target.value })}
                            placeholder="https://tickets.example.com"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={notePageForm.tags}
                        onChange={(e) => setNotePageForm({ ...notePageForm, tags: e.target.value })}
                        placeholder="music, art, inspiration"
                      />
                    </div>

                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        id="notePublished"
                        checked={notePageForm.isPublished}
                        onCheckedChange={(checked) => 
                          setNotePageForm({ ...notePageForm, isPublished: checked as boolean })
                        }
                      />
                      <Label htmlFor="notePublished" className="ml-2">Published</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noteImageFile">Featured Image (Optional)</Label>
                    <Input
                      id="noteImageFile"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploading(true);
                          try {
                            const imageUrl = await uploadImage(file);
                            setNotePageForm({ ...notePageForm, featuredImage: imageUrl });
                            toast({ title: "Success", description: "Featured image uploaded successfully" });
                          } catch (error) {
                            toast({ title: "Error", description: "Failed to upload featured image", variant: "destructive" });
                          } finally {
                            setUploading(false);
                          }
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500">Uploading featured image...</p>}
                    {notePageForm.featuredImage && (
                      <div className="mt-2">
                        <img 
                          src={notePageForm.featuredImage} 
                          alt="Featured Image Preview" 
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noteContent">Content</Label>
                    <Textarea
                      id="noteContent"
                      value={notePageForm.content}
                      onChange={(e) => setNotePageForm({ ...notePageForm, content: e.target.value })}
                      placeholder="Note content (supports markdown)"
                      rows={8}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createNotePageMutation.isPending || updateNotePageMutation.isPending}
                    className="w-full"
                  >
                    {(createNotePageMutation.isPending || updateNotePageMutation.isPending) 
                      ? (editMode.type === "notePage" ? "Updating..." : "Creating...") 
                      : (editMode.type === "notePage" ? "Update Note Page" : "Create Note Page")
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Note Pages */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Note Pages ({filteredNotePages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search note pages by title, content, or category..."
                    value={notePageSearchQuery}
                    onChange={(e) => setNotePageSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <SortableList
                  items={filteredNotePages}
                  onReorder={(reorderedNotePages) => setSortableNotePages(reorderedNotePages)}
                  getId={(page) => page.id.toString()}
                  className="space-y-4"
                  renderItem={(page) => (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{page.title}</h4>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {page.category}
                            </Badge>
                            <Badge variant={page.isPublished ? "default" : "secondary"} className="text-xs">
                              {page.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          {page.category === "events" ? (
                            <>
                              {page.eventDate && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  📅 {page.eventDate}
                                </p>
                              )}
                              {page.eventLocation && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  📍 {page.eventLocation}
                                </p>
                              )}
                              {page.ticketLink && (
                                <a 
                                  href={page.ticketLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  🎫 Get Tickets
                                </a>
                              )}
                            </>
                          ) : (
                            <>
                              {page.tags && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Tags: {page.tags}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                                {page.content.substring(0, 150)}...
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEditingNotePage(page)}
                            className="text-xs px-2 py-1"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this note page?")) {
                                deleteNotePageMutation.mutate(page.id);
                              }
                            }}
                            disabled={deleteNotePageMutation.isPending}
                            className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merchandise Tab */}
          <TabsContent value="merchandise" className="space-y-8">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hand className="w-5 h-5" />
                  {editMode.type === "merchandise" ? "Edit Merchandise" : "Add New Merchandise"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMerchandiseSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="merchTitle">Title</Label>
                      <Input
                        id="merchTitle"
                        value={merchandiseForm.title}
                        onChange={(e) => setMerchandiseForm({ ...merchandiseForm, title: e.target.value })}
                        placeholder="Item title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="merchCategory">Category</Label>
                      <Select 
                        value={merchandiseForm.category} 
                        onValueChange={(value: "apparel" | "vinyl" | "artwork" | "accessories") => 
                          setMerchandiseForm({ ...merchandiseForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apparel">Apparel</SelectItem>
                          <SelectItem value="vinyl">Vinyl</SelectItem>
                          <SelectItem value="artwork">Artwork</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="merchPrice">Price</Label>
                      <Input
                        id="merchPrice"
                        value={merchandiseForm.price}
                        onChange={(e) => setMerchandiseForm({ ...merchandiseForm, price: e.target.value })}
                        placeholder="$25.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="merchImage">Product Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="merchImage"
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploading(true);
                              try {
                                const imageUrl = await uploadImage(file);
                                setMerchandiseForm({ ...merchandiseForm, imageUrl });
                                toast({ title: "Success", description: "Image uploaded successfully" });
                              } catch (error) {
                                toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                          disabled={uploading}
                        />
                        {merchandiseForm.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={merchandiseForm.imageUrl} 
                              alt="Preview" 
                              className="w-20 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="merchDescription">Description</Label>
                    <Textarea
                      id="merchDescription"
                      value={merchandiseForm.description}
                      onChange={(e) => setMerchandiseForm({ ...merchandiseForm, description: e.target.value })}
                      placeholder="Product description..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="merchAvailable"
                      checked={merchandiseForm.available}
                      onCheckedChange={(checked) => 
                        setMerchandiseForm({ ...merchandiseForm, available: checked as boolean })
                      }
                    />
                    <Label htmlFor="merchAvailable">Available for purchase</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={createMerchandiseMutation.isPending || updateMerchandiseMutation.isPending}
                      className="flex-1 bg-black hover:bg-gray-800 dark:bg-[#F3EFE0] dark:hover:bg-[#E5E0D0] dark:text-black"
                    >
                      {editMode.type === "merchandise" ? 
                        (updateMerchandiseMutation.isPending ? "Updating..." : "Update Merchandise") :
                        (createMerchandiseMutation.isPending ? "Creating..." : "Create Merchandise")
                      }
                    </Button>
                    {editMode.type === "merchandise" && editMode.item && (
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={() => deleteMerchandiseMutation.mutate(editMode.item.id)}
                        disabled={deleteMerchandiseMutation.isPending}
                      >
                        {deleteMerchandiseMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Merchandise Display */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Existing Merchandise ({filteredMerchandise.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search merchandise by title, description, or category..."
                    value={merchandiseSearchQuery}
                    onChange={(e) => setMerchandiseSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <SortableList
                  items={filteredMerchandise}
                  onReorder={(reorderedMerchandise) => setSortableMerchandise(reorderedMerchandise)}
                  getId={(item) => item.id.toString()}
                  className="space-y-4"
                  renderItem={(item) => (
                    <div className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-sm">{item.title}</h3>
                            <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                              {item.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {item.category} • {item.price}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingMerchandise(item)}
                            className="text-xs h-7"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMerchandiseMutation.mutate(item.id)}
                            disabled={deleteMerchandiseMutation.isPending}
                            className="text-xs h-7"
                          >
                            {deleteMerchandiseMutation.isPending ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}