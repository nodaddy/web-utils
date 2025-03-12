'use client';

import { useState, useEffect } from 'react';

export default function HTMLFormatter() {
  const [inputHTML, setInputHTML] = useState('');
  const [outputHTML, setOutputHTML] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');

  // Function to format HTML
  const formatHTML = (html, spaces) => {
    if (!html) return '';
    
    let formatted = '';
    let indent = 0;
    
    // Convert string to array of characters
    const arr = html.replace(/>\s+</g, '><').split('');
    
    // Process character by character
    for (let i = 0; i < arr.length; i++) {
      const char = arr[i];
      
      if (char === '<' && arr[i + 1] === '/') {
        // Closing tag
        indent -= spaces;
        formatted += '\n' + ' '.repeat(indent) + char;
      } else if (char === '<' && arr[i + 1] !== '/') {
        // Opening tag
        formatted += '\n' + ' '.repeat(indent) + char;
        indent += spaces;
      } else if (char === '>') {
        // End of tag
        formatted += char;
      } else {
        // Content
        formatted += char;
      }
    }
    
    // Clean up extra whitespace
    return formatted.trim();
  };

  // Handle format button click
  const handleFormat = () => {
    try {
      setError('');
      const formattedHTML = formatHTML(inputHTML, indentSize);
      setOutputHTML(formattedHTML);
    } catch (err) {
      setError('Error formatting HTML: ' + err.message);
    }
  };

  // Handle URL fetch
  const fetchHTMLFromURL = async () => {
    if (!urlInput) {
      setError('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create a proxy URL to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlInput)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch HTML from URL');
      }
      
      const html = await response.text();
      setInputHTML(html);
      
      // Format the fetched HTML
      const formattedHTML = formatHTML(html, indentSize);
      setOutputHTML(formattedHTML);
    } catch (err) {
      setError('Error fetching HTML: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHTML)
      .then(() => {
        setCopyStatus('Copied! ✓');
        setTimeout(() => setCopyStatus('Copy'), 2000);
      })
      .catch(err => {
        setError('Failed to copy: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            HTML Formatter 🧹
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Beautify and format your HTML code with ease
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* URL Input */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <input
                type="text"
                placeholder="Enter URL to fetch HTML (optional)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={fetchHTMLFromURL}
                disabled={loading}
                className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
              >
                {loading ? 'Loading... ⏳' : 'Fetch HTML 🔍'}
              </button>
            </div>
          </div>

          {/* Input/Output Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input HTML 📝
              </h2>
              <textarea
                value={inputHTML}
                onChange={(e) => setInputHTML(e.target.value)}
                placeholder="Paste your HTML code here..."
                className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm"
              ></textarea>
            </div>

            {/* Output */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Formatted HTML 🎨
                </h2>
                <button
                  onClick={copyToClipboard}
                  disabled={!outputHTML}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm transition duration-200"
                >
                  {copyStatus} 📋
                </button>
              </div>
              <div className="relative">
                <pre className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm overflow-auto">
                  {outputHTML}
                </pre>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 dark:text-gray-300">
                Indent Size:
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <button
              onClick={handleFormat}
              disabled={!inputHTML}
              className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-200"
            >
              Format HTML ✨
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
              ⚠️ {error}
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>HTML Formatter - Format your code beautifully</p>
          <p className="mt-1">
            Built with Next.js and Tailwind CSS 💻
          </p>
        </footer>
      </div>
    </div>
  );
}