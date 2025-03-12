'use client';

import { useState } from 'react';

export default function PDFToExcelConverter() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setConverted(false);
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };
  
  const handleConversion = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    
    try {
      setConverting(true);
      setError('');
      
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would use a PDF parsing library 
      // and then convert the data to Excel format
      
      setConverting(false);
      setConverted(true);
    } catch (err) {
      setConverting(false);
      setError('Conversion failed. Please try again.');
      console.error(err);
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would generate and download the Excel file
    const link = document.createElement('a');
    link.href = '#'; // Would be a URL to the generated Excel file
    link.download = file.name.replace('.pdf', '.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to Excel Converter</h1>
            <p className="text-gray-600">Convert your PDF files to Excel spreadsheets in seconds.</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-5xl mb-3">📄</span>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
            
            {error && (
              <div className="mt-3 text-center text-red-500">
                <span className="mr-1">⚠️</span>
                {error}
              </div>
            )}
            
            {file && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setFile(null)}
                  >
                    ❌
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              className={`py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                file && !converting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!file || converting}
              onClick={handleConversion}
            >
              {converting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Converting...
                </>
              ) : (
                <>
                  <span className="mr-2">🔄</span>
                  Convert to Excel
                </>
              )}
            </button>
            
            {converted && (
              <button
                className="py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium flex items-center justify-center"
                onClick={handleDownload}
              >
                <span className="mr-2">⬇️</span>
                Download Excel File
              </button>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-xs">
            <p>
              <span className="mr-1">🔒</span>
              Your files are encrypted and automatically deleted after 24 hours.
            </p>
            <p className="mt-2">
              <span className="mr-1">⚡</span>
              Fast and secure conversion with no registration required.
            </p>
            <p className="mt-4">© 2025 PDF to Excel Converter</p>
          </div>
        </div>
      </div>
    </div>
  );
}