import React from "react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const mainImage = images[0] || "https://placehold.co/800"; // Fallback placeholder

  return (
    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center bg-secondary">
      <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={mainImage}
          alt="Product main"
          className="w-full h-auto object-contain p-4"
        />
      </div>

      {/* Thumbnail gallery if there are multiple images */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-accent"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;