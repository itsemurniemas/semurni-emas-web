import { useState, useRef } from "react";
import Image from "next/image";
import { CatalogModel } from "@repo/core";
import ImageZoom from "./ImageZoom";

interface ProductImageGalleryProps {
  catalog: CatalogModel;
}

const ProductImageGallery = ({ catalog }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Get product images from catalog
  const productImages = catalog.images.map((img) => img.image);
  const hasImages = productImages.length > 0;

  const nextImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    if (!hasImages) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  const handleImageClick = (index: number) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
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

  // Fallback placeholder if no images
  if (!hasImages) {
    return (
      <div className="w-full">
        <div className="w-full aspect-4/5 bg-muted flex items-center justify-center rounded">
          <p className="text-muted-foreground text-sm font-light">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Gallery (1024px and above) */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails Sidebar */}
        <div className="w-20 shrink-0 flex flex-col gap-3">
          {productImages.map((image, index) => (
            <div
              key={index}
              className={`aspect-square relative overflow-hidden cursor-pointer border transition-colors ${
                currentImageIndex === index
                  ? "border-foreground"
                  : "border-border hover:border-muted-foreground/30"
              }`}
              onClick={() => setCurrentImageIndex(index)}
              onMouseEnter={() => setCurrentImageIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Image View */}
        <div className="flex-1">
          <div
            className="w-full aspect-4/5 relative overflow-hidden cursor-zoom-in group border border-border"
            onClick={() => handleImageClick(currentImageIndex)}
          >
            <Image
              src={productImages[currentImageIndex]!}
              alt={`Product Main view`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Image slider (below 1024px) */}
      <div className="lg:hidden">
        <div className="relative">
          <div
            className="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y relative border border-border"
            onClick={() => handleImageClick(currentImageIndex)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={productImages[currentImageIndex]!}
              alt={`Product view ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-foreground" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={productImages}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;
