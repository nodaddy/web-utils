"use client";

import { useState, useRef, useEffect } from "react";
import * as mammoth from "mammoth";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function WordToPdfConverter() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef(null);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("Word(docx) to PDF Converter");
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      // Reset states
      setDownloadLink(null);
      setError("");

      // Check if file is a Word document
      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // .docx format is supported by mammoth
        setFile(selectedFile);
      } else if (selectedFile.type === "application/msword") {
        // .doc format - show warning but allow upload
        setFile(selectedFile);
        setError(
          "Note: .doc files may not convert correctly. For best results, please use .docx format."
        );
      } else {
        setError(
          "Please upload a valid Word document (preferably .docx format)"
        );
        setFile(null);
      }
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragging to false if the drag leaves the drop area
    // Check if the related target is not within the drop area
    if (dropAreaRef.current && !dropAreaRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const convertToPdf = async (htmlContent, fileName) => {
    try {
      // Create a new window to hold our HTML content for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error(
          "Browser blocked opening a new window. Please allow popups."
        );
      }

      // Add basic print styles to format the document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fileName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 2cm;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1em;
              margin-bottom: 0.5em;
              color: #222;
            }
            p {
              margin-top: 0;
              margin-bottom: 1em;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1em;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            @media print {
              body {
                margin: 0;
                padding: 1cm;
              }
              @page {
                size: A4;
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);

      // Wait a moment for the content to render properly
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Trigger the print dialog, which can save as PDF
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      // Return true when print dialog is shown
      return true;
    } catch (err) {
      console.error("Error creating PDF:", err);
      return false;
    }
  };

  const handleConversion = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsConverting(true);
    setProgress(0);

    // Check if it's a .doc file
    const isDocFormat =
      file.name.toLowerCase().endsWith(".doc") ||
      file.type === "application/msword";

    if (isDocFormat) {
      setError(
        "Sorry, .doc files are not fully supported by this browser-based converter. Please convert your file to .docx format first, or try our alternate method below."
      );
      setIsConverting(false);
      return;
    }

    try {
      // Create an array buffer from the file
      const arrayBuffer = await file.arrayBuffer();

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        // Convert Word to HTML using mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value;

        // Set progress to 95%
        setProgress(95);

        // Convert HTML to PDF (using browser print to PDF functionality)
        const fileName = file.name.replace(/\.(docx|doc)$/, "");
        const success = await convertToPdf(htmlContent, fileName);

        // Complete the process
        clearInterval(progressInterval);
        setProgress(100);

        if (success) {
          setDownloadLink(`${fileName}.pdf`);
        } else {
          setError(
            "Could not create PDF. Please try again or check if popups are allowed."
          );
        }
      } catch (innerErr) {
        console.error("Inner conversion error:", innerErr);
        if (innerErr.message && innerErr.message.includes("Corrupted zip")) {
          setError(
            "This file appears to be in the older .doc format which isn't supported. Please save your document as .docx and try again."
          );
        } else {
          setError(
            `PDF creation failed: ${innerErr.message || "Unknown error"}`
          );
        }
      }
    } catch (err) {
      console.error("Conversion error:", err);

      // Provide more user-friendly error messages
      if (err.message && err.message.includes("Corrupted zip")) {
        setError(
          "This file appears to be in the older .doc format which isn't supported by the browser converter. Please save your document as .docx and try again."
        );
      } else if (err.message && err.message.includes("Failed to fetch")) {
        setError(
          "Network error. Please check your connection or try again later."
        );
      } else {
        setError(`Conversion failed: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">📄</span>
            Word to PDF Converter
          </h1>
          <p className="text-indigo-100 mt-1">
            Convert your Word documents to PDF right in your browser
          </p>
        </div>

        <div className="p-8">
          {/* File Upload Area */}
          <div
            ref={dropAreaRef}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-50 ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 hover:border-indigo-400"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="text-4xl block mb-3">
              {isDragging ? "📥" : "📋"}
            </span>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              {file
                ? file.name
                : isDragging
                ? "Drop your file here"
                : "Drop your file here or click to browse"}
            </h3>
            <p className="text-sm text-slate-500">
              Supports .docx files (preferred)
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
            />
            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
          </div>

          {/* Progress Bar (shown only when converting) */}
          {isConverting && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Converting...
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 rounded-full h-2 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress < 50
                  ? "Parsing document..."
                  : progress < 90
                  ? "Converting content..."
                  : "Preparing PDF..."}
              </p>
            </div>
          )}

          {/* Download Link (shown after conversion) */}
          {downloadLink && !isConverting && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">✅</span>
                <div>
                  <p className="font-medium text-green-800">
                    Conversion Complete!
                  </p>
                  <p className="text-sm text-green-600">
                    Your PDF has been created
                  </p>
                </div>
              </div>
              <button
                onClick={handleConversion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center"
              >
                <span className="mr-1">🔄</span> Convert Again
              </button>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              logGAEvent(applicationNamesForGA.wordToPdf + "_click_convert", {
                fileType: file ? file.name.split(".").pop() : "unknown",
              });
              handleConversion();
            }}
            disabled={!file || isConverting}
            className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              !file || isConverting
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            }`}
          >
            {isConverting ? (
              <>
                <span className="animate-spin mr-2">⚙️</span> Converting...
              </>
            ) : (
              <>
                <span className="mr-2">🔄</span> Convert to PDF
              </>
            )}
          </button>
        </div>

        {/* Features Section */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="text-xl block mb-1">🔒</span>
              <h3 className="text-sm font-medium text-slate-800">
                100% Private
              </h3>
              <p className="text-xs text-slate-500">
                Files never leave your browser
              </p>
            </div>
            <div className="text-center">
              <span className="text-xl block mb-1">⚡</span>
              <h3 className="text-sm font-medium text-slate-800">
                Fast Conversion
              </h3>
              <p className="text-xs text-slate-500">No server uploads needed</p>
            </div>
            <div className="text-center">
              <span className="text-xl block mb-1">💻</span>
              <h3 className="text-sm font-medium text-slate-800">
                Client-side Only
              </h3>
              <p className="text-xs text-slate-500">Works offline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <p className="text-sm text-slate-500 text-center mb-2">
          This converter uses your browser's built-in capabilities to convert
          Word documents (.docx only) to PDF. When you click "Convert to PDF", a
          print dialog will open where you can save as PDF.
        </p>

        {/* Alternative method for .doc files */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <span className="mr-2">💡</span> Having trouble with .doc files?
          </h3>
          <p className="text-xs text-blue-700 mt-1">
            The browser-based converter only supports .docx files. For .doc
            files, try these alternatives:
          </p>
          <ol className="text-xs text-blue-700 mt-1 ml-5 list-decimal">
            <li>
              Open your .doc file in Microsoft Word or Google Docs and save it
              as .docx
            </li>
            <li>Use Microsoft Word's built-in "Save as PDF" feature</li>
            <li>Try an online converter service that supports .doc format</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
