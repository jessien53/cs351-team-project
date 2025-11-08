import React, { useState } from "react";
import { Heart, Share2 } from "lucide-react";

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="lg:w-1/2 bg-secondary relative lg:sticky lg:top-0 lg:h-screen">
      <div className="h-full flex flex-col gap-4">
        {/* Top Right Action Buttons */}
        <div className="flex gap-3 p-10 justify-end">
          <button className="bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image and Thumbnails */}
        <div className="flex-1 relative flex items-center justify-center p-8">
          <img
            className="max-h-full max-w-full object-contain rounded-2xl shadow-lg"
            src={images[currentImage]}
            alt="Current Product Image"
          />
        </div>

        <div className="p-8">
          <div className="flex gap-3 overflow-x-auto">
            {images.map((image, i) => (
              <img
                key={i}
                className={`flex-shrink-0 w-20 h-20 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition ${
                  i === currentImage ? "border-4 border-accent" : "opacity-70"
                }`}
                src={image}
                alt={`Product Thumbnail ${i + 1}`}
                onClick={() => setCurrentImage(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
