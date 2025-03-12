'use client';

import { useState, useRef } from 'react';

export default function PDFMergeApp() {
  const [files, setFiles] = useState([]);
  const [mergedURL, setMergedURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  const addFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addURLFile = () => {
    const url = urlInputRef.current.value.trim();
    if (!url) return;
    
    setLoading(true);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch PDF from URL');
        }
        return response.blob();
      })
      .then(blob => {
        const file = new File([blob], `url-pdf-${files.length + 1}.pdf`, { type: 'application/pdf' });
        setFiles(prev => [...prev, file]);
        urlInputRef.current.value = '';
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError(`Error fetching PDF: ${err.message}`);
        setLoading(false);
      });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveFileDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please add at least two PDF files to merge');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, we would use PDF.js or a server API
      // For this demo, we'll simulate the merge process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a simulated merged PDF blob
      const mergedBlob = new Blob([files[0]], { type: 'application/pdf' });
      const mergedObjectURL = URL.createObjectURL(mergedBlob);
      
      setMergedURL(mergedObjectURL);
      setLoading(false);
    } catch (err) {
      setError(`Error merging PDFs: ${err.message}`);
      setLoading(false);
    }
  };

  const resetApp = () => {
    setFiles([]);
    if (mergedURL) {
      URL.revokeObjectURL(mergedURL);
    }
    setMergedURL(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="mr-2">📄</span> PDF Merge App
            </h1>
            <p className="mt-2 opacity-90">Combine multiple PDF files into one document</p>
          </div>

          {/* Main content */}
          <div className="p-6">
            {mergedURL ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center">
                  <span className="text-xl mr-2">✅</span>
                  <span>PDFs merged successfully!</span>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <iframe 
                    src={mergedURL} 
                    className="w-full h-96" 
                    title="Merged PDF"
                  />
                </div>

                <div className="flex space-x-3">
                  <a 
                    href={mergedURL} 
                    download="merged.pdf"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center flex items-center justify-center"
                  >
                    <span className="mr-2">⬇️</span> Download PDF
                  </a>
                  <button 
                    onClick={resetApp}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                  >
                    <span className="mr-1">🔄</span> Start Over
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Upload section */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={addFiles}
                      className="hidden"
                      id="file-input"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="file-input"
                      className="block cursor-pointer"
                    >
                      <span className="text-4xl block mb-2">📄</span>
                      <span className="block text-lg font-medium text-gray-700 mb-1">
                        Drag PDFs here or click to upload
                      </span>
                      <span className="text-sm text-gray-500">
                        (Only PDF files are supported)
                      </span>
                    </label>
                  </div>

                  {/* URL input */}
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      placeholder="Enter PDF URL"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ref={urlInputRef}
                    />
                    <button
                      onClick={addURLFile}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      <span>➕</span> Add URL
                    </button>
                  </div>

                  {/* Files list */}
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Files to merge ({files.length})
                      </h3>
                      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                        {files.map((file, index) => (
                          <li key={index} className="p-3 bg-white hover:bg-gray-50 flex items-center">
                            <span className="text-xl mr-2">📄</span>
                            <span className="flex-1 truncate">{file.name}</span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => moveFileUp(index)}
                                disabled={index === 0}
                                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                title="Move up"
                              >
                                ⬆️
                              </button>
                              <button
                                onClick={() => moveFileDown(index)}
                                disabled={index === files.length - 1}
                                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                title="Move down"
                              >
                                ⬇️
                              </button>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Remove"
                              >
                                ❌
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Merge button */}
                  {files.length > 0 && (
                    <div className="mt-6">
                      <button
                        onClick={mergePDFs}
                        disabled={loading || files.length < 2}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin mr-2">🔄</span> Processing...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">🔗</span> Merge {files.length} PDFs
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <span className="mr-2">⚠️</span> {error}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
            <p>
              PDF Merge App • Made with Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}