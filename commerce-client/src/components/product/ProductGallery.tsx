"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-xl border border-hairline-light bg-shade-30/20">
        <img
          src={images[activeIndex] || images[0]}
          alt={`${title} - view ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-ink opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white shadow-xs cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-ink opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white shadow-xs cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer ${
                activeIndex === idx
                  ? "border-black shadow-xs"
                  : "border-hairline-light opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
