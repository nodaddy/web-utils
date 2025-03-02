"use client";
// pages/index.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function Home() {
  const [activeTab, setActiveTab] = useState("json2csv");
  const [jsonInput, setJsonInput] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [fileName, setFileName] = useState("converted");
  const [delimiter, setDelimiter] = useState(",");
  const [header, setHeader] = useState(true);
  const [quoteChar, setQuoteChar] = useState('"');
  const [jsonSpaces, setJsonSpaces] = useState(2);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentConversions, setRecentConversions] = useState([]);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("JSON CSV Converter");
  }, []);

  const jsonFileRef = useRef(null);
  const csvFileRef = useRef(null);

  // Clear messages after 5 seconds
  const showMessage = (type, message) => {
    if (type === "error") {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 5000);
    } else {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };

  // Convert JSON to CSV
  const handleJsonToCsv = () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Try to parse the JSON input
      const jsonData = JSON.parse(jsonInput);

      // Check if it's an array of objects
      if (!Array.isArray(jsonData)) {
        throw new Error("Input must be an array of objects");
      }

      // Convert to CSV using PapaParse
      const csvString = Papa.unparse(jsonData, {
        delimiter: delimiter,
        header: header,
        quotes: quoteChar !== "none",
        quoteChar: quoteChar === "none" ? "" : quoteChar,
      });

      setCsvOutput(csvString);

      // Add to recent conversions
      addToRecentConversions("JSON to CSV", fileName);

      showMessage("success", "✅ JSON successfully converted to CSV!");
    } catch (error) {
      showMessage("error", `❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert CSV to JSON
  const handleCsvToJson = () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Parse CSV to JSON
      Papa.parse(csvInput, {
        header: header,
        delimiter: delimiter,
        quoteChar: quoteChar === "none" ? "" : quoteChar,
        complete: (results) => {
          if (results.errors.length > 0) {
            showMessage("error", `❌ Error: ${results.errors[0].message}`);
            setIsLoading(false);
            return;
          }

          // Format JSON with specified spacing
          const jsonString = JSON.stringify(
            results.data,
            null,
            Number(jsonSpaces)
          );
          setJsonOutput(jsonString);

          // Add to recent conversions
          addToRecentConversions("CSV to JSON", fileName);

          showMessage("success", "✅ CSV successfully converted to JSON!");
          setIsLoading(false);
        },
        error: (error) => {
          showMessage("error", `❌ Error: ${error.message}`);
          setIsLoading(false);
        },
      });
    } catch (error) {
      showMessage("error", `❌ Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Download the converted file
  const handleDownload = () => {
    try {
      const isJsonTab = activeTab === "csv2json";
      const content = isJsonTab ? jsonOutput : csvOutput;
      const fileType = isJsonTab ? "application/json" : "text/csv";
      const fileExtension = isJsonTab ? ".json" : ".csv";

      const blob = new Blob([content], { type: fileType });
      saveAs(blob, `${fileName}${fileExtension}`);

      showMessage(
        "success",
        `✅ File "${fileName}${fileExtension}" downloaded successfully!`
      );
    } catch (error) {
      showMessage("error", `❌ Download failed: ${error.message}`);
    }
  };

  // Handle file upload
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;

      if (type === "json") {
        setJsonInput(content);
        setFileName(file.name.replace(".json", ""));
      } else {
        setCsvInput(content);
        setFileName(file.name.replace(".csv", ""));
      }

      showMessage("success", `✅ File "${file.name}" loaded successfully!`);
    };

    reader.onerror = () => {
      showMessage("error", "❌ Error reading file");
    };

    reader.readAsText(file);
  };

  // Add to recent conversions list
  const addToRecentConversions = (type, name) => {
    const newConversion = {
      id: Date.now(),
      type,
      name,
      date: new Date().toLocaleString(),
    };

    setRecentConversions((prev) => [newConversion, ...prev].slice(0, 5));
  };

  // Clear inputs and outputs
  const handleClear = (type) => {
    if (type === "json") {
      setJsonInput("");
      setCsvOutput("");
    } else {
      setCsvInput("");
      setJsonOutput("");
    }

    setErrorMsg("");
    setSuccessMsg("");
  };

  // Sample data templates
  const loadSampleData = (type) => {
    if (type === "json") {
      const sampleJson = JSON.stringify(
        [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
          { id: 3, name: "Mike Johnson", email: "mike@example.com" },
        ],
        null,
        2
      );

      setJsonInput(sampleJson);
    } else {
      const sampleCsv = `id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com
3,Mike Johnson,mike@example.com`;

      setCsvInput(sampleCsv);
    }
  };

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4">
        {/* Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-black-700 rounded shadow-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700  rounded shadow-sm">
            {successMsg}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("json2csv")}
              className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors duration-200 ${
                activeTab === "json2csv"
                  ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              JSON to CSV 📄
            </button>
            <button
              onClick={() => setActiveTab("csv2json")}
              className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors duration-200 ${
                activeTab === "csv2json"
                  ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              CSV to JSON 🔄
            </button>
          </div>

          <div className="p-6">
            {/* JSON to CSV */}
            {activeTab === "json2csv" && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Input Section */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800 text-white">
                        JSON Input 📥
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadSampleData("json")}
                          className="text-xs text-yellow-300 py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Load Sample
                        </button>
                        <button
                          onClick={() => jsonFileRef.current.click()}
                          className="text-xs text-white  py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Upload File
                        </button>
                        <input
                          type="file"
                          accept=".json"
                          ref={jsonFileRef}
                          onChange={(e) => handleFileUpload(e, "json")}
                          className="hidden"
                        />
                        <button
                          onClick={() => handleClear("json")}
                          className="text-xs text-white  py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder="Paste your JSON array here..."
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    />
                  </div>

                  {/* Output Section */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        CSV Output 📤
                      </h3>
                      <button
                        onClick={handleDownload}
                        disabled={!csvOutput}
                        className={`text-xs py-1 px-2 rounded ${
                          csvOutput
                            ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        }`}
                      >
                        Download
                      </button>
                    </div>
                    <textarea
                      value={csvOutput}
                      readOnly
                      placeholder="CSV output will appear here..."
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Options and Convert Button */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full  px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Delimiter
                      </label>
                      <select
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="\t">Tab</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quote Character
                      </label>
                      <select
                        value={quoteChar}
                        onChange={(e) => setQuoteChar(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value='"'>Double Quote (")</option>
                        <option value="'">Single Quote (')</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="header"
                      checked={header}
                      onChange={(e) => setHeader(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="header"
                      className="ml-2 block text-xs text-gray-700 dark:text-gray-300"
                    >
                      Include header row
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      logGAEvent(
                        applicationNamesForGA.jsonCsvConverter +
                          "_click_convert_json_to_csv"
                      );
                      handleJsonToCsv();
                    }}
                    disabled={isLoading || !jsonInput.trim()}
                    className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isLoading || !jsonInput.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Converting...
                      </span>
                    ) : (
                      "Convert JSON to CSV 🔄"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* CSV to JSON */}
            {activeTab === "csv2json" && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Input Section */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        CSV Input 📥
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadSampleData("csv")}
                          className="text-xs text-yellow-300 py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Load Sample
                        </button>
                        <button
                          onClick={() => csvFileRef.current.click()}
                          className="text-xs text-white py-1 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Upload File
                        </button>
                        <input
                          type="file"
                          accept=".csv"
                          ref={csvFileRef}
                          onChange={(e) => handleFileUpload(e, "csv")}
                          className="hidden"
                        />
                        <button
                          onClick={() => handleClear("csv")}
                          className="text-xs py-1 text-white px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Paste your CSV data here..."
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    />
                  </div>

                  {/* Output Section */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        JSON Output 📤
                      </h3>
                      <button
                        onClick={handleDownload}
                        disabled={!jsonOutput}
                        className={`text-xs py-1 px-2 rounded ${
                          jsonOutput
                            ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        }`}
                      >
                        Download
                      </button>
                    </div>
                    <textarea
                      value={jsonOutput}
                      readOnly
                      placeholder="JSON output will appear here..."
                      className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Options and Convert Button */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Delimiter
                      </label>
                      <select
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="\t">Tab</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quote Character
                      </label>
                      <select
                        value={quoteChar}
                        onChange={(e) => setQuoteChar(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value='"'>Double Quote (")</option>
                        <option value="'">Single Quote (')</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        JSON Indentation
                      </label>
                      <select
                        value={jsonSpaces}
                        onChange={(e) => setJsonSpaces(e.target.value)}
                        className="w-full px-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value="0">None</option>
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="csvHeader"
                      checked={header}
                      onChange={(e) => setHeader(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="csvHeader"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      CSV has header row
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      logGAEvent(
                        applicationNamesForGA.jsonCsvConverter +
                          "_click_convert_csv_to_json"
                      );

                      handleCsvToJson();
                    }}
                    disabled={isLoading || !csvInput.trim()}
                    className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isLoading || !csvInput.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Converting...
                      </span>
                    ) : (
                      "Convert CSV to JSON 🔄"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Fast & Reliable
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Efficiently handle large datasets with our optimized parsing
              engine powered by PapaParse.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Customizable Options
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Configure delimiters, quote characters, headers, and more to meet
              your exact requirements.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Privacy Focused
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All conversions happen locally in your browser. Your data never
              leaves your computer.
            </p>
          </div>
        </div>

        {/* Recent Conversions */}
        {recentConversions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-4">
              Recent Conversions 📋
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentConversions.map((conversion) => (
                    <tr
                      key={conversion.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {conversion.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {conversion.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {conversion.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl">
          <h3 className="text-xl font-medium text-indigo-800 mb-3">
            Tips & Tricks 💡
          </h3>
          <ul className="space-y-2 text-indigo-700 ">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Make sure your JSON is an array of objects with consistent
                properties.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                For CSV to JSON, ensure your CSV has a header row for best
                results.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Use the appropriate delimiter based on your data (comma is most
                common).
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Consider downloading a backup of your original file before
                converting.
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
