"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { useAppContext } from "../../Context/AppContext";
import applicationNamesForGA from "../../Applications";

export default function ExcelToPdfConverter() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef(null);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("Excel to PDF Converter");
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

      // Check if file is an Excel document
      const validTypes = [
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
        "text/csv", // .csv
      ];

      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.match(/\.(xlsx|xls|csv|ods)$/i)
      ) {
        setFile(selectedFile);
      } else {
        setError(
          "Please upload a valid Excel file (.xlsx, .xls, .ods, or .csv)"
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

  const generateTableFromSheet = (worksheet) => {
    // Get the range of data
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    let html =
      '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">';

    // Generate header row if possible
    html += "<thead><tr>";
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
      let cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : "";
      html += `<th style="background-color: #f2f2f2; font-weight: bold;">${cellValue}</th>`;
    }
    html += "</tr></thead><tbody>";

    // Generate data rows
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      html += "<tr>";
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        let cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : "";
        html += `<td>${cellValue}</td>`;
      }
      html += "</tr>";
    }

    html += "</tbody></table>";
    return html;
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
              margin: 2cm;
              color: #333;
            }
            h1 {
              color: #444;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background-color: #f2f2f2;
              text-align: left;
              padding: 8px;
              border: 1px solid #ddd;
            }
            td {
              padding: 8px;
              border: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            @media print {
              body {
                margin: 0;
                padding: 1cm;
              }
              @page {
                size: landscape;
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          <h1>${fileName}</h1>
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

    try {
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

      // Read the file
      const arrayBuffer = await file.arrayBuffer();

      // Parse the Excel file
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellStyles: true,
        cellDates: true,
      });

      setProgress(50);

      // Generate HTML for each sheet
      const sheetNames = workbook.SheetNames;
      let allSheetsHtml = "";

      for (let i = 0; i < sheetNames.length; i++) {
        const sheetName = sheetNames[i];
        const worksheet = workbook.Sheets[sheetName];

        allSheetsHtml += `<h2>Sheet: ${sheetName}</h2>`;
        allSheetsHtml += generateTableFromSheet(worksheet);
        allSheetsHtml += '<div style="page-break-after: always;"></div>';

        setProgress(50 + Math.floor(((i + 1) / sheetNames.length) * 40));
      }

      setProgress(95);

      // Convert to PDF
      const fileName = file.name.replace(/\.(xlsx|xls|csv|ods)$/i, "");
      const success = await convertToPdf(allSheetsHtml, fileName);

      clearInterval(progressInterval);
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
    <div className="min-h-screen flex flex-col items-center  ">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 bg-green-600 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">📊</span>
            Excel to PDF Converter
          </h1>
          <p className="text-green-100 mt-1">
            Convert your Excel spreadsheets to PDF right in your browser
          </p>
        </div>

        <div className="p-8">
          {/* File Upload Area */}
          <div
            ref={dropAreaRef}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-50 ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-slate-300 hover:border-green-400"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="text-4xl block mb-3">
              {isDragging ? "📥" : "📊"}
            </span>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              {file
                ? file.name
                : isDragging
                ? "Drop your Excel file here"
                : "Drop your Excel file here or click to browse"}
            </h3>
            <p className="text-sm text-slate-500">
              Supports .xlsx, .xls, .csv, and .ods files
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv,.ods,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.oasis.opendocument.spreadsheet"
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
                  className="bg-green-600 rounded-full h-2 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {progress < 30
                  ? "Reading Excel file..."
                  : progress < 70
                  ? "Converting spreadsheets..."
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
              logGAEvent(`${applicationNamesForGA.excelToPdf}_click_convert`);
              handleConversion();
            }}
            disabled={!file || isConverting}
            className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              !file || isConverting
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
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
              <span className="text-xl block mb-1">📑</span>
              <h3 className="text-sm font-medium text-slate-800">
                Multi-sheet Support
              </h3>
              <p className="text-xs text-slate-500">Converts all worksheets</p>
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
          Excel files to PDF. When you click "Convert to PDF", a print dialog
          will open where you can save as PDF.
        </p>

        {/* Tips Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
          <h3 className="text-sm font-bold text-blue-800 flex items-center">
            <span className="mr-2">💡</span> Tips for Better Conversion
          </h3>
          <ul className="text-xs text-blue-700 mt-1 ml-5 list-disc">
            <li>
              For complex spreadsheets, select "Landscape" orientation in the
              print dialog
            </li>
            <li>
              Adjust margins in the print dialog if your spreadsheet is getting
              cut off
            </li>
            <li>
              If your spreadsheet has many columns, you may need to adjust the
              scale in the print dialog
            </li>
            <li>
              For large datasets, try splitting your Excel file into multiple
              smaller files
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
