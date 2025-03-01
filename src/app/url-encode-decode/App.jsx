"use client";
import React, { useState, useEffect } from "react";

const URLEncoderDecoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [charset, setCharset] = useState("UTF-8");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Process the URL based on the selected mode and charset
  useEffect(() => {
    try {
      if (input) {
        if (mode === "encode") {
          setOutput(encodeURIComponent(input));
        } else if (mode === "decode") {
          setOutput(decodeURIComponent(input));
        }
      } else {
        setOutput("");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }, [input, mode, charset]);

  // Add current conversion to history
  const addToHistory = () => {
    if (input && output) {
      const newEntry = {
        id: Date.now(),
        input,
        output,
        mode,
        charset,
        timestamp: new Date().toLocaleString(),
      };
      setHistory([newEntry, ...history]);
    }
  };

  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear input and output
  const clearFields = () => {
    setInput("");
    setOutput("");
  };

  // Swap input and output
  const swapFields = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  // Download result as txt file
  const downloadResult = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `url-${mode}-${charset}-result.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Compact Header with Toggle Info Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">URL Encoder/Decoder Tool</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1 px-2 text-xs rounded bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Information"
            >
              ℹ️
            </button>
          </div>
        </div>

        {/* Collapsible Info Panel */}
        {showInfo && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg text-xs">
            <p>
              This tool converts text between different encoding formats with
              support for multiple character sets.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 gap-3">
        {/* Main Controls - Horizontally Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column: Mode Selection */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Mode
            </label>
            <div className="flex space-x-1">
              <button
                onClick={() => setMode("encode")}
                className={`px-2 py-1 text-xs rounded-md ${
                  mode === "encode"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode("decode")}
                className={`px-2 py-1 text-xs rounded-md ${
                  mode === "decode"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          {/* Right Column: Action Buttons */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Actions
            </label>
            <div className="flex space-x-1">
              <button
                onClick={swapFields}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                🔄 Swap
              </button>
              <button
                onClick={clearFields}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Input/Output Section - Side by Side on Larger Screens */}
        <div className="grid mt-4 grid-cols-1 md:grid-cols-2 gap-3">
          {/* Input Box */}
          <div className="relative">
            <label
              htmlFor="input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Input
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to ${mode}...`}
              className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Output Box */}
          <div className="relative">
            <label
              htmlFor="output"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Output
            </label>
            <textarea
              id="output"
              value={output}
              readOnly
              className="w-full h-24 p-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none"
            />
            <div className="absolute bottom-1 right-1 flex space-x-1">
              <button
                onClick={copyToClipboard}
                className="p-1 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                {copied ? "✅" : "📋"}
              </button>
              <button
                onClick={downloadResult}
                className="p-1 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                💾
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible History Section */}
        {showHistory && history.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-1 text-left">Time</th>
                    <th className="p-1 text-left">Mode</th>
                    <th className="p-1 text-left">Input</th>
                    <th className="p-1 text-left">Output</th>
                    <th className="p-1 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-1">{entry.timestamp.split(", ")[1]}</td>
                      <td className="p-1">{entry.mode}</td>
                      <td
                        className="p-1 truncate max-w-[100px]"
                        title={entry.input}
                      >
                        {entry.input}
                      </td>
                      <td
                        className="p-1 truncate max-w-[100px]"
                        title={entry.output}
                      >
                        {entry.output}
                      </td>
                      <td className="p-1">
                        <button
                          onClick={() => {
                            setInput(entry.input);
                            setMode(entry.mode);
                            setCharset(entry.charset);
                          }}
                          className="p-1 text-xs text-blue-500 hover:text-blue-700"
                        >
                          Reuse
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div className="bg-gray-50 p-2 text-center text-xs text-gray-500 border-t">
        URL Encoder/Decoder Tool • {charset} • {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default URLEncoderDecoder;
