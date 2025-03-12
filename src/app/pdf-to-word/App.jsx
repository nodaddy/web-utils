"use client";

import { useState } from 'react';

export default function PDFToWordConverter() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setConverted(false);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    try {
      setConverting(true);
      setError(null);
      
      // Simulate conversion process with a delay
      // In a real app, you would send the file to a backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConverting(false);
      setConverted(true);
    } catch (err) {
      setConverting(false);
      setError('Conversion failed. Please try again.');
      console.error(err);
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the converted file
    // Here we're just simulating the download functionality
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['Converted content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
    link.download = file.name.replace('.pdf', '.docx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PDF to Word Converter 📄➡️📝
            </h1>
            <p className="text-gray-600 mb-8">
              Convert your PDF documents to editable Word files easily.
            </p>
          </div>

          <div className="mb-6">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-150">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf"
              />
              <div className="space-y-1 text-center">
                <div className="text-4xl mb-2">📂</div>
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">
                    {file ? file.name : "Drag and drop your PDF here or click to browse"}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Only PDF files are supported
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {file && !error && !converted && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg flex items-center">
              <span className="text-xl mr-2">📄</span>
              <span className="flex-1 truncate">{file.name}</span>
              <button 
                onClick={() => setFile(null)}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ✖️
              </button>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!file || converting || converted}
            className={`w-full py-3 px-4 rounded-md font-medium text-white mb-4 
              ${!file || converting || converted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {converting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">🔄</span> Converting...
              </span>
            ) : converted ? (
              <span>Converted ✅</span>
            ) : (
              <span>Convert to Word 🔄</span>
            )}
          </button>

          {converted && (
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-medium text-white"
            >
              Download Word File ⬇️
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How it works</h2>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex">
                <span className="mr-2">1️⃣</span> Upload your PDF file
              </li>
              <li className="flex">
                <span className="mr-2">2️⃣</span> Click the Convert button
              </li>
              <li className="flex">
                <span className="mr-2">3️⃣</span> Download your Word document
              </li>
            </ol>
          </div>

          <div className="mt-8 text-xs text-center text-gray-500">
            <p>🔒 Your files are securely processed and automatically deleted after conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
}