'use client';

import React, { useState, useRef } from 'react';

const ImageCompressor = () => {
  // States for handling image compression
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [compressSize, setCompressSize] = useState(1024); // Default: 1MB (1024KB)
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionRate, setCompressionRate] = useState(0);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const downloadLinkRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    setError('');
    setCompressedImage(null);
    setShowSuccess(false);
    
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle compression
  const compressImage = () => {
    if (!originalImage) return;
    
    setIsCompressing(true);
    setError('');
    
    // Create an image element to work with
    const img = new Image();
    img.src = originalImage;
    
    img.onload = () => {
      // Create a canvas to draw and compress the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      // Calculate compression ratio based on desired size
      const originalSizeInKB = Math.round(originalImage.length * 0.75 / 1000);
      const ratio = Math.min(1, compressSize / originalSizeInKB);
      
      if (ratio < 1) {
        width *= Math.sqrt(ratio);
        height *= Math.sqrt(ratio);
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image to canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed data URL
      const quality = Math.max(0.1, Math.min(1, ratio));
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Calculate compression ratio for display
      const newSizeInKB = Math.round(compressedDataUrl.length * 0.75 / 1000);
      setCompressionRate(Math.round((1 - (newSizeInKB / originalSizeInKB)) * 100));
      
      setCompressedImage(compressedDataUrl);
      setIsCompressing(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    };
  };
  
  // Handle download
  const handleDownload = () => {
    if (!compressedImage) return;
    
    const extension = fileName.split('.').pop();
    const newFileName = fileName.replace(`.${extension}`, `-compressed.jpg`);
    
    // Set download attributes and trigger click
    downloadLinkRef.current.href = compressedImage;
    downloadLinkRef.current.download = newFileName;
    downloadLinkRef.current.click();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">🖼️</span> Premium Image Compressor
        </h2>
        <p className="text-gray-400 mt-1">
          Reduce image file size while maintaining quality
        </p>
      </div>
      
      {/* Main content */}
      <div className="p-8">
        {/* Upload section */}
        <div className="mb-8">
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            {originalImage ? (
              <div className="flex flex-col items-center">
                <img 
                  src={originalImage} 
                  alt="Preview" 
                  className="max-h-48 max-w-full rounded-md shadow-md mb-4" 
                />
                <p className="text-gray-300 text-sm">
                  {fileName} • Click to change
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-3">📁</span>
                <p className="text-gray-300 mb-2">
                  Drag & drop your image here or click to browse
                </p>
                <p className="text-gray-500 text-sm">
                  Supports JPG, PNG, GIF, WebP
                </p>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}
        </div>
        
        {/* Compression settings */}
        {originalImage && (
          <div className="mb-8 bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-white text-lg font-medium mb-4">Compression Settings</h3>
            
            <div className="flex flex-col md:flex-row md:items-center mb-4">
              <label className="text-gray-400 md:w-1/4 mb-2 md:mb-0">
                Target Size:
              </label>
              <div className="flex-1">
                <div className="flex items-center">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={compressSize}
                    onChange={(e) => setCompressSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="ml-4 min-w-16 px-3 py-1 bg-blue-500 text-white rounded text-center">
                    {compressSize > 1000 
                      ? `${(compressSize / 1024).toFixed(1)} MB` 
                      : `${compressSize} KB`}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={compressImage}
              disabled={isCompressing}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-md shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isCompressing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Compressing...
                </span>
              ) : (
                'Compress Image'
              )}
            </button>
          </div>
        )}
        
        {/* Results */}
        {compressedImage && (
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-white text-lg font-medium mb-4">Compression Results</h3>
            
            <div className="flex flex-col lg:flex-row gap-6 mb-4">
              <div className="flex-1">
                <p className="text-gray-400 mb-2 text-center">Original</p>
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full h-40 object-contain rounded" 
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-400 mb-2 text-center">Compressed</p>
                <div className="bg-gray-700/50 p-2 rounded-md">
                  <img 
                    src={compressedImage} 
                    alt="Compressed" 
                    className="w-full h-40 object-contain rounded" 
                  />
                </div>
              </div>
            </div>
            
            {/* Compression stats */}
            <div className="bg-gray-700/30 p-4 rounded-md mb-6">
              <div className="flex flex-col sm:flex-row justify-between text-center sm:text-left">
                <div className="mb-3 sm:mb-0">
                  <p className="text-gray-400 text-sm">Compression Rate</p>
                  <p className="text-white font-bold text-xl">{compressionRate}%</p>
                </div>
                <div className="mb-3 sm:mb-0">
                  <p className="text-gray-400 text-sm">Original Size</p>
                  <p className="text-white font-bold text-xl">
                    {Math.round(originalImage.length * 0.75 / 1000)} KB
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">New Size</p>
                  <p className="text-white font-bold text-xl">
                    {Math.round(compressedImage.length * 0.75 / 1000)} KB
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-md shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
            >
              <span className="mr-2">⬇️</span> Download Compressed Image
            </button>
            
            {/* Hidden download link */}
            <a ref={downloadLinkRef} className="hidden"></a>
          </div>
        )}
        
        {/* Success notification */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg flex items-center animate-fade-in-out">
            <span className="mr-2">✅</span> Image compressed successfully!
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-8 py-4 bg-gray-900 border-t border-gray-700">
        <p className="text-gray-500 text-sm text-center">
          Premium Image Compressor • Compress images without losing quality
        </p>
      </div>
    </div>
  );
};

export default ImageCompressor;

// Add this to your global CSS for the fade in/out animation
/* 
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

.animate-fade-in-out {
  animation: fadeInOut 3s forwards;
}
*/