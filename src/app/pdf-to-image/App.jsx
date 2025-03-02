"use client";
// pages/index.js
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useAppContext } from "../../Context/AppContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

// PDF.js is imported dynamically to avoid SSR issues
let pdfjs = null;

export default function Home() {
  // Context for app name
  const { setTool } = useAppContext();

  // State variables
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [conversionSettings, setConversionSettings] = useState({
    quality: 90,
    scale: 2.0,
    pageRange: "all",
    format: "png",
  });
  const [dragActive, setDragActive] = useState(false);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize PDF.js only on client-side
  useEffect(() => {
    setTool("PDF to JPG Converter");

    const loadPdfJs = async () => {
      try {
        // Only load PDF.js in browser environment
        if (typeof window !== "undefined") {
          // First import the main library
          const pdfjsLib = await import("pdfjs-dist");

          // Create a web worker using the dedicated worker entry point
          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
          ).toString();

          // Store the library reference
          pdfjs = pdfjsLib;
          setPdfJsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load PDF.js:", error);
      }
    };

    loadPdfJs();
  }, [setTool]);

  // Handle file input change
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      handlePdfSelection(file);
    } else if (file) {
      alert("Please select a valid PDF file");
    }
  };

  // Handle PDF file selection
  const handlePdfSelection = async (file) => {
    if (!pdfjs || !pdfJsLoaded) {
      alert("PDF.js is still loading. Please try again in a moment.");
      return;
    }

    setPdfFile(file);
    setFileName(file.name.replace(".pdf", ""));
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
        setPageCount(pdf.numPages);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error loading PDF:", error);
      alert("Error loading PDF. Please try another file.");
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      handlePdfSelection(file);
    } else if (file) {
      alert("Please select a valid PDF file");
    }
  };

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setConversionSettings((prev) => ({
      ...prev,
      [name]:
        name === "quality" || name === "scale" ? parseFloat(value) : value,
    }));
  };

  // Convert PDF to JPG/PNG
  const convertPdfToImages = async () => {
    if (!pdfFile || !pdfjs || !pdfJsLoaded) return;

    setProcessing(true);
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

        let pagesToProcess = [];
        if (conversionSettings.pageRange === "all") {
          pagesToProcess = Array.from(
            { length: pdf.numPages },
            (_, i) => i + 1
          );
        } else {
          // Parse range like "1-5, 7, 9-10"
          const ranges = conversionSettings.pageRange
            .split(",")
            .map((r) => r.trim());
          for (const range of ranges) {
            if (range.includes("-")) {
              const [start, end] = range
                .split("-")
                .map((n) => parseInt(n.trim()));
              for (let i = start; i <= end; i++) {
                if (i > 0 && i <= pdf.numPages) pagesToProcess.push(i);
              }
            } else {
              const pageNum = parseInt(range);
              if (pageNum > 0 && pageNum <= pdf.numPages)
                pagesToProcess.push(pageNum);
            }
          }
        }

        // Create a zip file for multiple images
        const zip = new JSZip();

        for (let i = 0; i < pagesToProcess.length; i++) {
          const pageNumber = pagesToProcess[i];
          const page = await pdf.getPage(pageNumber);

          // Set viewport using scale factor for higher quality
          const viewport = page.getViewport({
            scale: conversionSettings.scale,
          });

          // Create canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page to canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Convert canvas to image data
          const imgType =
            conversionSettings.format === "jpg" ? "image/jpeg" : "image/png";
          const imageData = canvas.toDataURL(
            imgType,
            conversionSettings.quality / 100
          );

          // Add to zip file
          const imgData = imageData.split(",")[1];
          zip.file(
            `${fileName}_page_${pageNumber}.${conversionSettings.format}`,
            imgData,
            { base64: true }
          );

          // Update progress
          setProgress(Math.round(((i + 1) / pagesToProcess.length) * 100));
        }

        // Generate and download zip file
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${fileName}_images.zip`);

        setProcessing(false);
      };

      reader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("Error converting PDF:", error);
      alert("Error during conversion. Please try again with another file.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>PDF to JPG Converter</title>
        <meta
          name="description"
          content="Convert PDF to high-quality JPG images easily"
        />
      </Head>

      <main className="container mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto border border-gray-100">
          <h1 className="text-2xl font-bold mb-5 text-center text-gray-800 flex items-center justify-center">
            <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              🖼️
            </span>
            PDF to JPG Converter
          </h1>

          <div className="space-y-5">
            {/* File Upload Section */}
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />

              {!pdfFile ? (
                <div className="py-4">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-lg font-medium text-gray-700">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum file size: 50MB
                  </p>
                  {!pdfJsLoaded && (
                    <p className="text-sm text-orange-500 mt-2">
                      Loading converter... please wait
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  <div className="text-3xl mb-1">📄</div>
                  <p
                    className="text-lg font-medium text-blue-600 truncate max-w-sm mx-auto"
                    title={pdfFile.name}
                  >
                    {pdfFile.name}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <p className="text-sm text-gray-500">
                      {pageCount} {pageCount === 1 ? "page" : "pages"}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500">
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings and Convert Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Output Quality: {conversionSettings.quality}%
                  </label>
                  <input
                    type="range"
                    name="quality"
                    min="10"
                    max="100"
                    value={conversionSettings.quality}
                    onChange={handleSettingsChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale: {conversionSettings.scale}x
                  </label>
                  <input
                    type="range"
                    name="scale"
                    min="1"
                    max="3"
                    step="0.1"
                    value={conversionSettings.scale}
                    onChange={handleSettingsChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Range
                  </label>
                  <input
                    type="text"
                    name="pageRange"
                    value={conversionSettings.pageRange}
                    onChange={handleSettingsChange}
                    placeholder="e.g. all, 1-3, 5, 7-9"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    name="format"
                    value={conversionSettings.format}
                    onChange={handleSettingsChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    <option value="jpg">JPG (smaller files)</option>
                    <option value="png">PNG (better quality)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  logGAEvent(
                    applicationNamesForGA.pdfToImageConvert,
                    "_click_convert",
                    {
                      type: conversionSettings.format.toUpperCase(),
                    }
                  );
                  convertPdfToImages();
                }}
                disabled={!pdfFile || processing || !pdfJsLoaded}
                className={`w-full md:w-2/3 py-3 px-6 rounded-lg shadow-md font-medium text-white text-lg transition-all transform hover:scale-[1.02] ${
                  !pdfFile || processing || !pdfJsLoaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Converting... {progress}%
                  </span>
                ) : !pdfJsLoaded ? (
                  "Loading converter..."
                ) : (
                  ` 📥  Convert to ${conversionSettings.format.toUpperCase()}`
                )}
              </button>

              {processing && (
                <div className="w-full md:w-2/3 mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
