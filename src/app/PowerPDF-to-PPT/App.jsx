"use client";

import { useState } from 'react';
import Head from 'next/head';

export default function PowerPDFToPPT() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setConvertedFile(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    setConverting(true);
    setProgress(0);

    // Simulate conversion process
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(Math.floor((step / totalSteps) * 100));
    }

    // Simulate finished conversion
    setConverting(false);
    setProgress(100);
    setConvertedFile({
      name: file.name.replace('.pdf', '.pptx'),
      size: Math.floor(file.size * 0.8) // Simulated smaller file size
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Head>
        <title>PowerPDF to PPT Converter</title>
        <meta name="description" content="Convert PDF documents to PowerPoint presentations" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4">
              PowerPDF to PPT Converter <span className="text-3xl">📄➡️📊</span>
            </h1>
            <p className="text-lg text-gray-600">
              Transform your PDF documents into editable PowerPoint presentations in seconds
            </p>
          </div>

          {/* Converter Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            {/* File Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center
              ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {!file ? (
                <div>
                  <div className="text-6xl mb-4">📄</div>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg cursor-pointer hover:bg-indigo-700 transition duration-300"
                  >
                    Select PDF File
                  </label>
                  <p className="mt-3 text-gray-500">or drag and drop your file here</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">📑</div>
                  <h3 className="text-xl font-medium text-gray-800">{file.name}</h3>
                  <p className="text-gray-500 mb-4">{Math.round(file.size / 1024)} KB</p>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300"
                  >
                    Change File
                  </label>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto order-2 sm:order-1">
                {file && !convertedFile && (
                  <button
                    onClick={handleConvert}
                    disabled={converting}
                    className={`w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-white
                      ${converting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
                      transition duration-300`}
                  >
                    {converting ? 'Converting...' : 'Convert to PowerPoint'} {converting ? '⏳' : '✨'}
                  </button>
                )}
                
                {convertedFile && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => alert("Download would start here")}
                      className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Download PPTX ⬇️
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setConvertedFile(null);
                        setProgress(0);
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                      Convert Another File 🔄
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full sm:w-auto order-1 sm:order-2">
                {file && !convertedFile && progress > 0 && (
                  <div className="w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">
                      {progress}% Complete
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Convert your PDFs to PowerPoint presentations in seconds</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-gray-600">Your files are processed securely and never stored on our servers</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Maintain text, images, and formatting with our accurate conversion</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-center text-indigo-800 mb-8">
              How It Works <span className="text-xl">🔍</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  1️⃣
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload</h3>
                <p className="text-gray-600">Select your PDF document</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  2️⃣
                </div>
                <h3 className="text-lg font-semibold mb-2">Convert</h3>
                <p className="text-gray-600">Our system processes your file</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  3️⃣
                </div>
                <h3 className="text-lg font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Get your PowerPoint presentation</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-indigo-800 mb-8">
              Frequently Asked Questions <span className="text-xl">❓</span>
            </h2>
            
            <div className="space-y-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>What types of PDFs can I convert?</span>
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                  You can convert any PDF document, including those with text, images, charts, and tables.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Will my formatting be preserved?</span>
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                  Yes, our tool maintains text formatting, images, and layout as accurately as possible.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Is there a file size limit?</span>
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                  Yes, the maximum file size is 25MB for free conversions.
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Can I convert multiple PDFs at once?</span>
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                  This feature is available in our premium version.
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-indigo-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} PowerPDF to PPT Converter. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="inline-block hover:text-indigo-300 transition">Terms</a>
            <a href="#" className="inline-block hover:text-indigo-300 transition">Privacy</a>
            <a href="#" className="inline-block hover:text-indigo-300 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}