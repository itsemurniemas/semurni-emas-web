import { useEffect, useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  images: (string | StaticImageData)[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageZoom = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageZoomProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.addEventListener("keydown", handleArrowKeys);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("keydown", handleArrowKeys);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0 && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0 && e.touches[0]) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-10 text-white p-2 hover:opacity-75 transition-opacity"
      >
        <X className="h-12 w-12" />
      </button>

      {/* Carousel container */}
      <div className="relative w-full max-w-5xl px-4 py-12 z-10 flex items-center justify-center gap-4">
        {/* Previous button */}
        <button
          onClick={prevImage}
          className="absolute left-2 z-10 text-white p-4 hover:opacity-75 transition-opacity"
        >
          <ChevronLeft className="w-16 h-16" strokeWidth={1} />
        </button>

        {/* Image */}
        <div
          className="relative aspect-3/4 w-full h-full max-h-[80vh] md:aspect-square flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[currentIndex]!}
            alt={`Catalog view ${currentIndex + 1}`}
            fill
            className="object-contain animate-scale-in select-none"
            priority
          />
        </div>

        {/* Next button */}
        <button
          onClick={nextImage}
          className="absolute right-2 z-10 text-white p-4 hover:opacity-75 transition-opacity"
        >
          <ChevronRight className="w-16 h-16" strokeWidth={1} />
        </button>
      </div>

      {/* Dots indicator and counter */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <p className="text-white text-sm font-light">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

export default ImageZoom;
