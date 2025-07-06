import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Photo } from "@shared/schema";

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const handleOpenLightbox = (event: CustomEvent<Photo>) => {
      setCurrentPhoto(event.detail);
      setIsOpen(true);
    };

    window.addEventListener('openLightbox', handleOpenLightbox as EventListener);

    return () => {
      window.removeEventListener('openLightbox', handleOpenLightbox as EventListener);
    };
  }, []);

  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentPhoto(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        <button 
          onClick={closeLightbox}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={currentPhoto.imageUrl} 
          alt={currentPhoto.title}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
          <h4 className="font-semibold text-lg">{currentPhoto.title}</h4>
          <p className="text-sm text-gray-300">{currentPhoto.location}</p>
        </div>
      </div>
    </div>
  );
}
