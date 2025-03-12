'use client';

import { useState, useRef } from 'react';

export default function PDFSplitter() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pageRanges, setPageRanges] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPdfUrl('');
      setError('');
    } else if (selectedFile) {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPdfUrl(url);
    if (url) {
      setFile(null);
    }
    setError('');
  };

  const validatePageRanges = (ranges) => {
    // Simple validation for page ranges format
    const rangePattern = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
    return rangePattern.test(ranges);
  };

  const handleSplit = async () => {
    // Reset states
    setError('');
    setSuccess('');
    
    // Validate if we have a file or URL
    if (!file && !pdfUrl) {
      setError('Please select a PDF file or enter a URL');
      return;
    }

    // Validate page ranges
    if (!pageRanges) {
      setError('Please enter page ranges');
      return;
    }

    if (!validatePageRanges(pageRanges)) {
      setError('Invalid page range format. Please use format like: 1-3,5,7-9');
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would implement the PDF splitting logic here
      // This would typically involve sending the file to a server endpoint
      // For demonstration, we're simulating a successful split after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(`PDF successfully split according to ranges: ${pageRanges}`);
      
      // Reset form after successful split
      if (file) {
        fileInputRef.current.value = '';
        setFile(null);
      } else {
        urlInputRef.current.value = '';
        setPdfUrl('');
      }
      setPageRanges('');
    } catch (err) {
      setError('Failed to split PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">PDF Splitter 📄✂️</h1>
          <p className="text-gray-600 mt-2">Split your PDF files by page ranges</p>
        </div>

        <div className="space-y-4">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <label className="block text-gray-700 font-medium mb-2">Upload PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* URL Input Section */}
          <div className="border-t pt-4">
            <p className="text-center text-gray-500 mb-2">- OR -</p>
            <label className="block text-gray-700 font-medium mb-2">Enter PDF URL</label>
            <input
              type="url"
              placeholder="https://example.com/document.pdf"
              onChange={handleUrlChange}
              ref={urlInputRef}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Page Ranges Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Page Ranges</label>
            <input
              type="text"
              placeholder="e.g., 1-3,5,7-9"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="mt-1 text-xs text-gray-500">
              Specify pages and ranges separated by commas (e.g., 1-3,5,7-9)
            </p>
          </div>

          {/* Split Button */}
          <button
            onClick={handleSplit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Split PDF ✂️
              </span>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              ✅ {success}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
          <h3 className="font-medium text-gray-700 mb-1">How to use:</h3>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Upload a PDF file or provide a valid PDF URL</li>
            <li>Enter the page ranges you want to extract</li>
            <li>Click "Split PDF" to process your document</li>
            <li>Download the split PDF files when processing is complete</li>
          </ol>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-xs">
        <p>PDF Splitter App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}