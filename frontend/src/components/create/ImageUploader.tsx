// 📁 src/components/create-listing/ImageUploader.tsx

import React from "react";
import type { ImageObject } from "../../types/create.ts";

interface Props {
  images: ImageObject[];
  setImages: React.Dispatch<React.SetStateAction<ImageObject[]>>;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  error?: string;
}

const ImageUploader: React.FC<Props> = ({
  images,
  setImages,
  videoUrl,
  onVideoUrlChange,
  error,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    (e.target as HTMLInputElement).value = ""; // Clear the input

    const newImagePromises = files.map((file) => {
      return new Promise<ImageObject>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            file,
            dataURL: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then((newImages) => {
      setImages((prev) => [...prev, ...newImages].slice(0, 10)); // Enforce 10 image limit
    });
  };

  const removeImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="lg:w-1/2 bg-gradient-to-br from-secondary via-secondary/90 to-secondary relative lg:sticky lg:top-0 lg:h-screen">
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
        <h1 className="text-white text-2xl font-bold">New Listing</h1>
      </div>

      <div className="h-full flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            {/* ... SVG icon ... */}
            <svg
              className="w-16 h-16 text-white/50 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-white text-xl font-semibold mb-2">
              Upload Images
            </h2>
            <p className="text-white/60 text-sm">
              Add up to 10 photos. First image will be the cover.
            </p>
            {error && (
              <div className="text-red-400 text-sm mt-2 font-semibold">
                {error}
              </div>
            )}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="relative aspect-square bg-white rounded-lg overflow-hidden group"
              >
                <img
                  src={img.url}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-accent text-xs px-2 py-1 rounded">
                    Cover
                  </div>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  {/* ... X icon ... */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="fileInput"
                />
                {/* ... + icon ... */}
                <svg
                  className="w-8 h-8 text-white/50 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-white/50 text-sm">Add Photo</span>
              </label>
            )}
          </div>

          {/* Video URL Input */}
          <div className="mt-6">
            <label
              htmlFor="video-url"
              className="text-white text-sm font-semibold mb-2 block"
            >
              Video URL (Optional)
            </label>
            <input
              id="video-url"
              type="url"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-white/10 border-2 border-transparent rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:bg-white/5 focus:border-primary transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
