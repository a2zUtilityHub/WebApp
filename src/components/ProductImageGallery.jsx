import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductImageGallery = ({ images = [], alt = "Product Image" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayImages = images.length > 0 ? images : [{ url: placeholderImage }];
  const currentImage = displayImages[currentIndex];

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative group w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img 
          src={currentImage.url || placeholderImage} 
          alt={`${alt} - View ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {displayImages.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={20} className="text-gray-800" />
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img.url || placeholderImage} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl bg-black border-none p-0 overflow-hidden text-white">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <img 
              src={currentImage.url || placeholderImage} 
              alt={`${alt} - View ${currentIndex + 1} (Zoomed)`}
              className="max-w-full max-h-full object-contain"
            />
            {displayImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors">
                  <ChevronLeft size={32} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;