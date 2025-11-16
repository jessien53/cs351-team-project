import React from "react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const mainImage = images[0] || "https://placehold.co/800";

  return (
    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center bg-secondary">
      {" "}
      {/* Increased padding for a larger area */}
      <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={mainImage}
          alt="Product main"
          className="w-full h-auto object-contain p-4" // Use object-contain and remove fixed height
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white rounded-full p-2 shadow">
            {/* Heart Icon */}
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
          <button className="bg-white rounded-full p-2 shadow">
            {/* Share Icon */}
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Small thumbnail gallery if there are multiple images */}
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