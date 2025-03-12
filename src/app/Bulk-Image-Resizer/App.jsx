'use client';

import { useState, useRef } from 'react';

export default function ImageResizer() {
  const [images, setImages] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizedImages, setResizedImages] = useState([]);
  const [resizeOptions, setResizeOptions] = useState({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    format: 'jpeg',
    quality: 80
  });
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newImages = imageFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 15),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  // Handle URL input
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    try {
      // Check if URL is valid
      new URL(urlInput);
      
      // Try to fetch the image to verify it exists
      const response = await fetch(urlInput, { method: 'HEAD' });
      
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        // Create a new image object from URL
        const newImage = {
          id: Date.now() + Math.random().toString(36).substring(2, 15),
          url: urlInput,
          name: urlInput.split('/').pop() || 'image-from-url',
          type: response.headers.get('content-type'),
          size: null, // Size is unknown for remote images
          isUrl: true
        };
        
        setImages(prev => [...prev, newImage]);
        setUrlInput('');
      } else {
        alert('The URL does not point to a valid image');
      }
    } catch (error) {
      alert('Please enter a valid URL');
    }
  };

  // Remove image from list
  const removeImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  // Handle resize options change
  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResizeOptions({
      ...resizeOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Resize images
  const resizeImage = (imageObj) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // For URL images
      
      img.onload = () => {
        // Calculate dimensions
        let newWidth = parseInt(resizeOptions.width);
        let newHeight = parseInt(resizeOptions.height);
        
        if (resizeOptions.maintainAspectRatio) {
          const ratio = img.width / img.height;
          
          if (newWidth && !newHeight) {
            newHeight = newWidth / ratio;
          } else if (!newWidth && newHeight) {
            newWidth = newHeight * ratio;
          } else {
            // Both dimensions provided, prioritize width
            newHeight = newWidth / ratio;
          }
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw image to canvas with new dimensions
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert to requested format
        const quality = parseInt(resizeOptions.quality) / 100;
        const format = resizeOptions.format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, quality);
        
        // Create downloadable link
        const a = document.createElement('a');
        a.href = dataUrl;
        const fileExtension = format === 'image/png' ? 'png' : 'jpg';
        a.download = `resized-${imageObj.name.split('.')[0]}.${fileExtension}`;
        
        resolve({
          id: imageObj.id,
          dataUrl,
          downloadUrl: a.href,
          downloadLink: a,
          filename: a.download,
          newWidth,
          newHeight,
          format,
          originalName: imageObj.name
        });
      };
      
      img.src = imageObj.isUrl ? imageObj.url : imageObj.url;
    });
  };

  // Process all images
  const processImages = async () => {
    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }
    
    setIsResizing(true);
    setResizedImages([]);
    
    try {
      const resizedResults = await Promise.all(images.map(resizeImage));
      setResizedImages(resizedResults);
    } catch (error) {
      console.error('Error resizing images:', error);
      alert('Failed to resize some images');
    } finally {
      setIsResizing(false);
    }
  };

  // Download all resized images
  const downloadAll = () => {
    if (resizedImages.length === 0) return;
    
    resizedImages.forEach(img => {
      setTimeout(() => {
        img.downloadLink.click();
      }, 100);
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            📷 Bulk Image Resizer
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Resize multiple images at once. Upload files or add image URLs.
          </p>
        </div>
        
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          {/* File Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📂 Upload Images
              </h2>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Select Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {/* URL Input */}
            <form onSubmit={handleUrlSubmit} className="flex items-center mt-4 mb-6">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add URL
              </button>
            </form>
          </div>
          
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📊 {images.length} Images Selected
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map(image => (
                  <div key={image.id} className="relative border rounded-lg overflow-hidden group">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-sm font-medium text-gray-800 truncate" title={image.name}>{image.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Resize Options */}
          <div className="mb-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⚙️ Resize Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  name="width"
                  value={resizeOptions.width}
                  onChange={handleOptionChange}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  name="height"
                  value={resizeOptions.height}
                  onChange={handleOptionChange}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  name="format"
                  value={resizeOptions.format}
                  onChange={handleOptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality (1-100)
                </label>
                <input
                  type="number"
                  name="quality"
                  value={resizeOptions.quality}
                  onChange={handleOptionChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="maintainAspectRatio"
                    checked={resizeOptions.maintainAspectRatio}
                    onChange={handleOptionChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Maintain aspect ratio</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={processImages}
              disabled={images.length === 0 || isResizing}
              className={`px-6 py-3 rounded-md font-medium ${
                images.length === 0 || isResizing
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isResizing ? '⏳ Processing...' : '✨ Resize Images'}
            </button>
            
            {resizedImages.length > 0 && (
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                📥 Download All
              </button>
            )}
          </div>
          
          {/* Resized Images Results */}
          {resizedImages.length > 0 && (
            <div className="mt-10 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ✅ Resized Images ({resizedImages.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {resizedImages.map(img => (
                  <div key={img.id} className="border rounded-lg overflow-hidden">
                    <img 
                      src={img.dataUrl} 
                      alt={img.filename}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3 bg-white">
                      <p className="text-sm font-medium text-gray-800 truncate" title={img.filename}>
                        {img.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {img.newWidth} × {img.newHeight} px
                      </p>
                      <a
                        href={img.downloadUrl}
                        download={img.filename}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        📥 Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💻 Your images are processed directly in your browser. Nothing is uploaded to any server.</p>
        </div>
      </div>
    </div>
  );
}