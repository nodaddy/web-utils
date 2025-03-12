'use client';

import { useState, useRef } from 'react';

export default function SVGtoPNGConverter() {
  const [svgInput, setSvgInput] = useState('');
  const [svgFile, setSvgFile] = useState(null);
  const [pngUrl, setPngUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleTextInput = (e) => {
    setSvgInput(e.target.value);
    setSvgFile(null);
    setPngUrl('');
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvgInput(e.target.result);
        setSvgFile(file);
        setPngUrl('');
        setError('');
      };
      reader.readAsText(file);
    } else if (file) {
      setError('Please upload an SVG file.');
      fileInputRef.current.value = '';
    }
  };

  const convertToPNG = () => {
    if (!svgInput.trim()) {
      setError('Please enter SVG content or upload an SVG file.');
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      const svg = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);
      const img = new Image();
      
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the SVG
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw SVG on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to PNG
        try {
          const pngDataUrl = canvas.toDataURL('image/png');
          setPngUrl(pngDataUrl);
          setIsConverting(false);
        } catch (err) {
          setError('Error converting to PNG: ' + err.message);
          setIsConverting(false);
        }
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        setError('Invalid SVG content. Please check your input.');
        setIsConverting(false);
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (err) {
      setError('Error processing SVG: ' + err.message);
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pngUrl) return;
    
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = svgFile 
      ? svgFile.name.replace('.svg', '.png') 
      : 'converted-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSvgInput('');
    setSvgFile(null);
    setPngUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            SVG to PNG Converter
            <span className="ml-2" role="img" aria-label="convert">🔄</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Upload or paste your SVG code and convert it to a PNG image
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label 
              htmlFor="svg-input" 
              className="block text-gray-700 font-medium mb-2"
            >
              SVG Code <span className="text-gray-500 text-sm">(or upload a file)</span>
            </label>
            <textarea
              id="svg-input"
              className="w-full h-40 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={svgInput}
              onChange={handleTextInput}
              placeholder="<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>...</svg>"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <label 
                htmlFor="file-upload" 
                className="block text-gray-700 font-medium mb-2"
              >
                Upload SVG File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".svg"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg">
              <p className="flex items-center">
                <span className="mr-2" role="img" aria-label="error">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={convertToPNG}
              disabled={isConverting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isConverting ? (
                <span>Converting...</span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2" role="img" aria-label="convert">🔄</span>
                  Convert to PNG
                </span>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <span className="flex items-center">
                <span className="mr-2" role="img" aria-label="reset">🔄</span>
                Reset
              </span>
            </button>
            
            {pngUrl && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span className="flex items-center">
                  <span className="mr-2" role="img" aria-label="download">⬇️</span>
                  Download PNG
                </span>
              </button>
            )}
          </div>

          {pngUrl && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Converted PNG Image
                <span className="ml-2" role="img" aria-label="image">🖼️</span>
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                <img 
                  src={pngUrl} 
                  alt="Converted PNG" 
                  className="max-w-full shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Created with Next.js and Tailwind CSS
            <span className="mx-1" role="img" aria-label="coding">💻</span>
            No additional libraries required!
          </p>
        </footer>
      </div>

      {/* Hidden canvas used for SVG to PNG conversion */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
}