import React, { useState } from 'react';

interface ImageSliderProps {
  images: string[];
  size?: number;
  altText?: string;
}

export function ImageSlider({
  images,
  size = 200,
  altText = 'image',
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-400 select-none"
      >
        No Img
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded border border-gray-300 overflow-hidden"
    >
      <img
        src={images[currentIndex]}
        alt={`${altText} ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white text-xs px-1 rounded-r select-none"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white text-xs px-1 rounded-l select-none"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
