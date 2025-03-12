'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function WebpToJpgConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputType, setInputType] = useState('file'); // 'file' or 'url'
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.includes('image/webp')) {
        setError('Please select a WebP image file.');
        setSelectedFile(null);
        return;
      }
      setError('');
      setSelectedFile(file);
      setConvertedImage(null);
    }
  };

  const handleUrlChange = (event) => {
    setInputUrl(event.target.value);
    setConvertedImage(null);
    setError('');
  };

  const convertWebpToJpg = async () => {
    setIsConverting(true);
    setError('');
    
    try {
      let imageUrl;
      
      if (inputType === 'file' && selectedFile) {
        imageUrl = URL.createObjectURL(selectedFile);
      } else if (inputType === 'url' && inputUrl) {
        // Check if URL ends with .webp
        if (!inputUrl.toLowerCase().endsWith('.webp')) {
          throw new Error('URL must point to a WebP image (ending with .webp)');
        }
        imageUrl = inputUrl;
      } else {
        throw new Error('Please select a file or enter a valid URL');
      }

      // Create a new image element to load the WebP
      const img = new Image();
      
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPG
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.9);
        setConvertedImage(jpgUrl);
        setIsConverting(false);
      };
      
      img.onerror = () => {
        throw new Error('Failed to load the image. Make sure it\'s a valid WebP image.');
      };
      
      // Set crossOrigin for URL inputs to avoid CORS issues when possible
      if (inputType === 'url') {
        img.crossOrigin = 'anonymous';
      }
      
      // Load the image
      img.src = imageUrl;
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
      setIsConverting(false);
    }
  };

  const downloadJpg = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = inputType === 'file' 
      ? `${selectedFile.name.replace('.webp', '')}.jpg`
      : 'converted-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConvertedImage(null);
    setError('');
    setInputUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>WebP to JPG Converter</title>
        <meta name="description" content="Convert WebP images to JPG format online" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          WebP to JPG Converter 🖼️
        </h1>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 text-center ${inputType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setInputType('file')}
              >
                File Upload 📁
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center ${inputType === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => setInputType('url')}
              >
                URL 🔗
              </button>
            </div>
          </div>
          
          {inputType === 'file' ? (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload WebP Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500"
                onClick={() => fileInputRef.current.click()}
              >
                <p className="text-gray-500 text-sm mb-2">
                  {selectedFile ? selectedFile.name : 'Click to select a WebP file'}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'or drag and drop here'}
                </p>
                <input
                  type="file"
                  accept=".webp,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter WebP Image URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.webp"
                value={inputUrl}
                onChange={handleUrlChange}
              />
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              ⚠️ {error}
            </div>
          )}
          
          <div className="flex space-x-2 mb-6">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={convertWebpToJpg}
              disabled={isConverting || (inputType === 'file' && !selectedFile) || (inputType === 'url' && !inputUrl)}
            >
              {isConverting ? 'Converting...' : 'Convert to JPG'}
            </button>
            
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              onClick={resetConverter}
            >
              ↻
            </button>
          </div>
          
          {convertedImage && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Converted Image</h2>
              <div className="border rounded-md p-2 mb-4">
                <img
                  src={convertedImage}
                  alt="Converted JPG"
                  className="max-w-full h-auto rounded"
                />
              </div>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                onClick={downloadJpg}
              >
                Download JPG 💾
              </button>
            </div>
          )}
        </div>
        
        <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-500">
          <p>💡 This converter works directly in your browser. No files are uploaded to any server.</p>
        </div>
      </main>
    </div>
  );
}