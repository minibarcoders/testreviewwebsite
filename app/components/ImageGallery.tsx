'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

interface Props {
  onSelect: (url: string) => void;
}

export default function ImageGallery({ onSelect }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images', {
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error fetching images:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/images', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const newImage = await response.json();
      setImages([newImage, ...images]);
      setIsUploading(false);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Upload Section */}
      <div className="mb-6">
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
            isUploading ? 'bg-gray-50 border-gray-300' : 'border-indigo-300 hover:border-indigo-400'
          }`}
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Upload an image'}
            </div>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onSelect(image.url)}
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Select</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 