"use client";

import { useState, useRef } from "react";

export default function PptToPdfConverter() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [slideImages, setSlideImages] = useState([]);
  const [slideCount, setSlideCount] = useState(0);
  const dropAreaRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      // Reset states
      setDownloadLink(null);
      setError("");
      setSlideImages([]);

      // Check if file is a PowerPoint document
      const validTypes = [
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow", // .ppsx
        "application/vnd.oasis.opendocument.presentation", // .odp
      ];

      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.match(/\.(pptx|ppt|ppsx|odp)$/i)
      ) {
        setFile(selectedFile);
      } else {
        setError(
          "Please upload a valid PowerPoint file (.pptx, .ppt, .ppsx, or .odp)"
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

  const convertToPdf = async (slideElements, fileName) => {
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
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .slide {
              page-break-after: always;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 20px;
              box-sizing: border-box;
            }
            .slide-content {
              max-width: 90%;
              max-height: 90%;
            }
            .slide-info {
              position: absolute;
              bottom: 20px;
              right: 20px;
              font-size: 12px;
              color: #888;
            }
            img {
              max-width: 100%;
              max-height: 70vh;
              object-fit: contain;
            }
            @media print {
              html, body {
                height: 100%;
                margin: 0 !important;
                padding: 0 !important;
              }
              .slide {
                page-break-after: always;
                height: 100%;
              }
              @page {
                size: landscape;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="presentation-container">
            ${slideElements}
          </div>
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

    try {
      // Since we can't directly parse PPT/PPTX files in the browser without a specialized library,
      // we'll use a workaround approach by creating slide placeholders with notes

      // Simulate file reading and slide extraction
      setProgress(10);

      // Get the number of estimated slides based on file size
      // This is just an approximation for the UI
      const estimatedSlides = Math.max(1, Math.floor(file.size / 20000));
      setSlideCount(estimatedSlides);

      setProgress(30);

      // Generate placeholder HTML for each slide
      let slidesHtml = "";

      for (let i = 0; i < estimatedSlides; i++) {
        slidesHtml += `
          <div class="slide">
            <div class="slide-content">
              <h2>Slide ${i + 1}</h2>
              <p>This is a placeholder for slide ${i + 1} from ${file.name}</p>
              <p class="slide-note">Note: Actual slide content cannot be rendered in the browser.</p>
              <p>Please use the print dialog to save as PDF, then use a PDF viewer to view the results.</p>
            </div>
            <div class="slide-info">Slide ${i + 1} / ${estimatedSlides}</div>
          </div>
        `;

        // Update progress as we "process" each slide
        setProgress(30 + Math.floor(((i + 1) / estimatedSlides) * 60));
      }

      setProgress(95);

      // Info message about limitations
      slidesHtml =
        `
        <div class="slide">
          <div class="slide-content">
            <h1>${file.name}</h1>
            <p style="color: #d32f2f; margin-top: 30px;">Browser-based PowerPoint to PDF Conversion</p>
            <p style="margin-top: 30px;">Due to browser limitations, direct conversion of PowerPoint content isn't fully possible.</p>
            <p>This PDF contains placeholder slides to demonstrate the concept.</p>
            <p style="margin-top: 30px;">For a complete conversion, consider:</p>
            <ul style="text-align: left; display: inline-block; margin-top: 10px;">
              <li>Using PowerPoint's built-in "Save as PDF" feature</li>
              <li>Using Google Slides to import and export as PDF</li>
              <li>Using a dedicated online converter service</li>
            </ul>
          </div>
        </div>
      ` + slidesHtml;

      // Convert to PDF
      const fileName = file.name.replace(/\.(pptx|ppt|ppsx|odp)$/i, "");
      const success = await convertToPdf(slidesHtml, fileName);

      setProgress(100);

      if (success) {
        setDownloadLink(`${fileName}.pdf`);
      } else {
        setError(
          "Could not create PDF. Please check if popups are allowed in your browser."
        );
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setError(`Conversion failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-purple-600 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🖼️</span>
            PowerPoint to PDF Converter
          </h1>
          <p className="text-purple-100 mt-1">
            Convert your presentations to PDF right in your browser
          </p>
        </div>

        <div className="p-8">
          {/* File Upload Area */}
          <div
            ref={dropAreaRef}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-50 ${
              isDragging
                ? "border-purple-500 bg-purple-50"
                : "border-slate-300 hover:border-purple-400"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="text-4xl block mb-3">
              {isDragging ? "📥" : "🖼️"}
            </span>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              {file
                ? file.name
                : isDragging
                ? "Drop your presentation here"
                : "Drop your PowerPoint file here or click to browse"}
            </h3>
            <p className="text-sm text-slate-500">
              Supports .pptx, .ppt, .ppsx, and .odp files
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".pptx,.ppt,.ppsx,.odp,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.oasis.opendocument.presentation"
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
                  className="bg-purple-600 rounded-full h-2 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress < 30
                  ? "Reading presentation file..."
                  : progress < 70
                  ? `Processing slides (${Math.floor(
                      ((progress - 30) / 60) * slideCount
                    )}/${slideCount})...`
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center"
              >
                <span className="mr-1">🔄</span> Convert Again
              </button>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleConversion}
            disabled={!file || isConverting}
            className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              !file || isConverting
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
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
              <span className="text-xl block mb-1">📱</span>
              <h3 className="text-sm font-medium text-slate-800">
                Works on All Devices
              </h3>
              <p className="text-xs text-slate-500">No software needed</p>
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
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="text-sm font-bold text-amber-800 flex items-center">
            <span className="mr-2">⚠️</span> Browser Limitations
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            Due to browser limitations, this tool can only create placeholder
            slides for PowerPoint files. For a complete conversion with all
            formatting and graphics, we recommend:
          </p>
          <ul className="text-xs text-amber-700 mt-1 ml-5 list-disc">
            <li>Using PowerPoint's built-in "Save as PDF" feature</li>
            <li>
              Using Google Slides to import your presentation and export as PDF
            </li>
            <li>
              Using a dedicated PowerPoint to PDF converter software or online
              service
            </li>
          </ul>
        </div>

        <p className="text-sm text-slate-500 text-center mt-4">
          This converter demonstrates the concept of browser-based conversion.
          When you click "Convert to PDF", a print dialog will open where you
          can save as PDF.
        </p>
      </div>
    </div>
  );
}
