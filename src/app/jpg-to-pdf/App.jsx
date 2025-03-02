"use client";
// pages/image-to-pdf/index.js
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useAppContext } from "../../Context/AppContext";
import { jsPDF } from "jspdf";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function Home() {
  // Context for app name
  const { setTool } = useAppContext();

  // State variables
  const [imageFiles, setImageFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [pdfSettings, setPdfSettings] = useState({
    pageSize: "a4",
    orientation: "portrait",
    margin: 10,
    quality: 0.9,
    fitToPage: true,
  });

  const fileInputRef = useRef(null);

  // Set tool name on component mount
  useEffect(() => {
    setTool("JPG to PDF Converter");
  }, [setTool]);

  // Handle file input change
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelection(Array.from(files));
    }
  };

  // Handle image file selection
  const handleImageSelection = async (files) => {
    // Filter for image files only
    const validImageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImageFiles.length === 0) {
      alert("Please select valid image files (JPG, PNG, GIF, etc.)");
      return;
    }

    // Sort files by name for consistent ordering
    validImageFiles.sort((a, b) => a.name.localeCompare(b.name));

    // Reset states
    setImageFiles((prevFiles) => [...prevFiles, ...validImageFiles]);
    setProgress(0);
    setDownloadComplete(false);
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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageSelection(Array.from(files));
    }
  };

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setPdfSettings((prev) => ({
      ...prev,
      [name]:
        name === "margin" || name === "quality"
          ? parseFloat(value)
          : name === "fitToPage"
          ? e.target.checked
          : value,
    }));
  };

  // Remove image from selection
  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadComplete(false);
  };

  // Move image up in the order
  const moveImageUp = (index) => {
    if (index === 0) return;
    const newFiles = [...imageFiles];
    [newFiles[index], newFiles[index - 1]] = [
      newFiles[index - 1],
      newFiles[index],
    ];
    setImageFiles(newFiles);
    setDownloadComplete(false);
  };

  // Move image down in the order
  const moveImageDown = (index) => {
    if (index === imageFiles.length - 1) return;
    const newFiles = [...imageFiles];
    [newFiles[index], newFiles[index + 1]] = [
      newFiles[index + 1],
      newFiles[index],
    ];
    setImageFiles(newFiles);
    setDownloadComplete(false);
  };

  // Convert images to PDF
  const convertImagesToPdf = async () => {
    if (imageFiles.length === 0) return;

    setProcessing(true);
    setProgress(0);
    setDownloadComplete(false);

    try {
      // Create PDF document with selected page size and orientation
      const pdf = new jsPDF({
        orientation: pdfSettings.orientation,
        unit: "mm",
        format: pdfSettings.pageSize,
      });

      // Get page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = pdfSettings.margin;

      // Process each image
      for (let i = 0; i < imageFiles.length; i++) {
        // Add new page for all images except the first one
        if (i > 0) {
          pdf.addPage();
        }

        const file = imageFiles[i];

        // Create an object URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Load image to get dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        // Calculate dimensions to fit within page margins
        let imgWidth = img.width;
        let imgHeight = img.height;

        if (pdfSettings.fitToPage) {
          // Calculate available space
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;

          // Scale image to fit page while maintaining aspect ratio
          if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const widthRatio = maxWidth / imgWidth;
            const heightRatio = maxHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);

            imgWidth *= ratio;
            imgHeight *= ratio;
          }
        }

        // Calculate position to center image
        const x = margin + (pageWidth - margin * 2 - imgWidth) / 2;
        const y = margin + (pageHeight - margin * 2 - imgHeight) / 2;

        // Add image to PDF
        pdf.addImage(
          img,
          "JPEG",
          x,
          y,
          imgWidth,
          imgHeight,
          `image-${i}`,
          "FAST",
          0
        );

        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);

        // Update progress
        setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
      }

      // Generate filename from first image
      const baseFileName = imageFiles[0].name.split(".")[0];
      const fileName = `${baseFileName}${
        imageFiles.length > 1 ? "_and_more" : ""
      }.pdf`;

      // Save the PDF
      pdf.save(fileName);

      // Show download complete message
      setDownloadComplete(true);

      // Reset processing state
      setProcessing(false);
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      alert("Error during conversion. Please try again with different images.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto border border-gray-100">
          <h1 className="text-2xl font-bold mb-5 text-center text-gray-800 flex items-center justify-center">
            <span className="bg-purple-600 text-white p-2 rounded-lg mr-3">
              📄
            </span>
            JPG to PDF Converter
          </h1>

          <div className="space-y-5">
            {/* File Upload Section */}
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400"
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
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="py-4">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-lg font-medium text-gray-700">
                  Drop your images here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPG, PNG, GIF, BMP, WebP, etc.
                </p>
              </div>
            </div>

            {/* Image List */}
            {imageFiles.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-64 overflow-y-auto">
                <h2 className="text-sm font-semibold mb-2 text-gray-700">
                  {imageFiles.length}{" "}
                  {imageFiles.length === 1 ? "Image" : "Images"} Selected
                </h2>
                <ul className="space-y-2">
                  {imageFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {index + 1}. {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImageUp(index);
                          }}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="Move up"
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImageDown(index);
                          }}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="Move down"
                          disabled={index === imageFiles.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Settings Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Size
                  </label>
                  <select
                    name="pageSize"
                    value={pdfSettings.pageSize}
                    onChange={handleSettingsChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                  >
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="a5">A5</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    name="orientation"
                    value={pdfSettings.orientation}
                    onChange={handleSettingsChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margin: {pdfSettings.margin}mm
                  </label>
                  <input
                    type="range"
                    name="margin"
                    min="0"
                    max="30"
                    step="1"
                    value={pdfSettings.margin}
                    onChange={handleSettingsChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Quality: {Math.round(pdfSettings.quality * 100)}%
                  </label>
                  <input
                    type="range"
                    name="quality"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={pdfSettings.quality}
                    onChange={handleSettingsChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="fitToPage"
                    checked={pdfSettings.fitToPage}
                    onChange={handleSettingsChange}
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Fit images to page
                  </span>
                </label>
              </div>
            </div>

            {/* Convert Button & Download Status */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  logGAEvent(
                    applicationNamesForGA.jpgToPdf + "_click_convert",
                    {
                      number_of_images: imageFiles.length,
                    }
                  );
                  convertImagesToPdf();
                }}
                disabled={imageFiles.length === 0 || processing}
                className={`w-full md:w-2/3 py-3 px-6 rounded-lg shadow-md font-medium text-white text-lg transition-all transform hover:scale-[1.02] ${
                  imageFiles.length === 0 || processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
                    Processing... {progress}%
                  </span>
                ) : (
                  `Convert ${imageFiles.length} ${
                    imageFiles.length === 1 ? "Image" : "Images"
                  } to PDF`
                )}
              </button>

              {processing && (
                <div className="w-full md:w-2/3 mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {downloadComplete && (
                <div className="mt-4 text-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 w-full md:w-2/3">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    PDF has been downloaded successfully!
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
