'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';

export default function CSVValidator() {
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const validateCSV = (results) => {
    const errors = [];
    const data = results.data;
    
    // Check if file is empty
    if (data.length === 0) {
      errors.push("CSV file is empty");
      return errors;
    }

    // Extract headers
    const csvHeaders = data[0];
    setHeaders(csvHeaders);
    
    // Check for empty headers
    csvHeaders.forEach((header, index) => {
      if (!header || header.trim() === '') {
        errors.push(`Column ${index + 1} has an empty header`);
      }
    });

    // Check for duplicate headers
    const duplicateHeaders = csvHeaders.filter(
      (header, index) => csvHeaders.indexOf(header) !== index
    );
    if (duplicateHeaders.length > 0) {
      errors.push(`Duplicate headers found: ${duplicateHeaders.join(', ')}`);
    }

    // Check for rows with inconsistent column counts
    for (let i = 1; i < data.length; i++) {
      if (data[i].length !== csvHeaders.length) {
        errors.push(`Row ${i + 1} has ${data[i].length} columns, expected ${csvHeaders.length}`);
      }
    }

    // Check for empty rows
    for (let i = 1; i < data.length; i++) {
      const isEmpty = data[i].every(cell => !cell || cell.trim() === '');
      if (isEmpty) {
        errors.push(`Row ${i + 1} is empty`);
      }
    }

    return errors;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setValidationErrors([]);
    setIsValid(null);
    setCsvData(null);

    Papa.parse(file, {
      complete: (results) => {
        const errors = validateCSV(results);
        
        setCsvData(results.data);
        setValidationErrors(errors);
        setIsValid(errors.length === 0);
        setLoading(false);
      },
      error: (error) => {
        setValidationErrors([error.message]);
        setIsValid(false);
        setLoading(false);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileUpload({ target: { files: [file] } });
      } else {
        setValidationErrors(['Please upload a CSV file']);
        setIsValid(false);
      }
    }
  };

  const resetForm = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setCsvData(null);
    setHeaders([]);
    setValidationErrors([]);
    setIsValid(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            📊 CSV Validator
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
                id="fileInput"
              />
              <label 
                htmlFor="fileInput"
                className="cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    📁
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      Upload a CSV file
                    </span> or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">
                    CSV files only
                  </p>
                </div>
              </label>
            </div>

            {loading && (
              <div className="mt-6 text-center">
                <div className="text-indigo-600">
                  ⏳ Validating your CSV file...
                </div>
              </div>
            )}

            {isValid === true && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    ✅
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      CSV is valid!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your CSV has {csvData.length - 1} rows and {headers.length} columns.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isValid === false && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    ❌
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      CSV validation failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {csvData && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Preview:</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {headers.map((header, index) => (
                          <th 
                            key={index}
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header || <span className="text-red-500">Empty header</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.slice(1, 6).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td 
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {cell || <span className="text-gray-300">Empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 6 && (
                    <p className="mt-2 text-sm text-gray-500 text-right">
                      Showing 5 of {csvData.length - 1} rows
                    </p>
                  )}
                </div>
              </div>
            )}

            {(isValid === true || isValid === false) && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Validate Another File
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">ℹ️ About CSV Validator</h2>
            <p className="mt-2 text-gray-600">
              This tool helps you validate CSV files by checking for:
            </p>
            <ul className="mt-2 list-disc pl-5 text-gray-600">
              <li>Empty or missing headers</li>
              <li>Duplicate headers</li>
              <li>Inconsistent column counts</li>
              <li>Empty rows</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Upload your CSV file to get started. Your files are processed locally in your browser and are not uploaded to any server.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            CSV Validator · Built with Next.js and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}