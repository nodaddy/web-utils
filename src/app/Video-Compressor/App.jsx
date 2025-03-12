'use client'

import { useState, useRef } from 'react';

export default function VideoCompressor() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFileUrl, setCompressedFileUrl] = useState('');
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 'medium',
    resolution: '720p',
  });
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
      setVideoUrl('');
    } else if (selectedFile) {
      alert('Please select a valid video file');
    }
  };

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    setFile(null);
  };

  const handleCompress = () => {
    if (!file && !videoUrl) {
      alert('Please select a file or enter a video URL');
      return;
    }

    setIsCompressing(true);
    
    // Simulate compression process
    setTimeout(() => {
      setIsCompressing(false);
      
      // In a real app, this would be the URL to the compressed file
      setCompressedFileUrl(file ? URL.createObjectURL(file) : videoUrl);
    }, 3000);
  };

  const handleQualityChange = (e) => {
    setCompressionSettings({
      ...compressionSettings,
      quality: e.target.value,
    });
  };

  const handleResolutionChange = (e) => {
    setCompressionSettings({
      ...compressionSettings,
      resolution: e.target.value,
    });
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleReset = () => {
    setFile(null);
    setVideoUrl('');
    setCompressedFileUrl('');
    setIsCompressing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            📹 Video Compressor
          </h1>
          <p className="mt-2 text-gray-600">
            Compress your videos without losing quality
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <div className="space-y-6">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Video File 📁
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-gray-600 mb-1">
                      {file ? file.name : "Drag and drop or click to upload"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: MP4, MOV, AVI, etc.
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* URL Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Video URL 🔗
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/video.mp4"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            {/* Compression Settings */}
            <div>
              <button
                type="button"
                onClick={toggleSettings}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                ⚙️ {showSettings ? 'Hide' : 'Show'} Compression Settings
              </button>
              
              {showSettings && (
                <div className="mt-3 space-y-4 p-4 bg-gray-50 rounded-lg">
                  {/* Quality Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quality
                    </label>
                    <select
                      value={compressionSettings.quality}
                      onChange={handleQualityChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="low">Low (Smaller file) 📉</option>
                      <option value="medium">Medium (Balanced) ⚖️</option>
                      <option value="high">High (Better quality) 📈</option>
                    </select>
                  </div>
                  
                  {/* Resolution Setting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution
                    </label>
                    <select
                      value={compressionSettings.resolution}
                      onChange={handleResolutionChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p (HD)</option>
                      <option value="1080p">1080p (Full HD)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleCompress}
                disabled={isCompressing || (!file && !videoUrl)}
                className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isCompressing || (!file && !videoUrl)
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isCompressing ? (
                  <span>Compressing... ⏳</span>
                ) : (
                  <span>Compress Video 🔄</span>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset 🔄
              </button>
            </div>
          </div>
        </div>

        {/* Compression Results */}
        {compressedFileUrl && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Compression Complete ✅
            </h2>
            
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <video 
                controls 
                className="rounded-lg w-full h-auto"
                src={compressedFileUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <a
                href={compressedFileUrl}
                download="compressed-video"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download 📥
              </a>
              
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Process Another Video 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}