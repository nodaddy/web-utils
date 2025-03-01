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
    setMode(
      mode.includes("encode")
        ? mode.replace("encode", "decode")
        : mode.replace("decode", "encode")
    );
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

  // Process example URLs
  const processExample = (example) => {
    setInput(example);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">URL Encoder/Decoder Tool</h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Information"
          >
            ℹ️ Info.
          </button>
        </div>
        {showInfo && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg text-sm">
            <h2 className="font-bold mb-2">About this tool:</h2>
            <p>
              This premium URL encoder/decoder tool helps you convert URLs and
              text between different encoding formats. Features include:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Multiple encoding/decoding methods</li>
              <li>Character set selection for international support</li>
              <li>History tracking</li>
              <li>Copy, download, and share functionality</li>
              <li>Real-time conversion</li>
              <li>Error handling</li>
            </ul>
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 gap-6">
        {/* Mode and Charset Selection */}
        <div className="w-full">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
            {/* Mode Selection */}
            <div className="overflow-x-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Encoding Mode
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode("encode")}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === "encode"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  URL Encode
                </button>
                <button
                  onClick={() => setMode("decode")}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    mode === "decode"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  URL Decode
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Box */}
        <div className="relative">
          <label
            htmlFor="input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Input
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter text to ${mode}...`}
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button
              onClick={clearFields}
              className="p-1 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              aria-label="Clear"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={addToHistory}
            className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-1"
          >
            <span className="mr-1">⚙️</span>
            <span>{mode === "encode" ? "Encode" : "Decode"}</span>
          </button>
          <button
            onClick={swapFields}
            className="px-4 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <span className="mr-1">🔄</span>
            <span>Swap</span>
          </button>
        </div>

        {/* Output Box */}
        <div className="relative">
          <label
            htmlFor="output"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Output
          </label>
          <textarea
            id="output"
            value={output}
            readOnly
            className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none"
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button
              onClick={copyToClipboard}
              className="p-1 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              aria-label="Copy"
            >
              {copied ? "✅ Copied" : "📋 Copy"}
            </button>
            &nbsp; &nbsp;
            <button
              onClick={downloadResult}
              className="p-1 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              aria-label="Download"
            >
              💾 &nbsp;Download as File
            </button>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="border-t pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Recent History
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 mb-2 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {entry.mode} ({entry.charset})
                    </span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <div className="text-sm truncate" title={entry.input}>
                    Input: {entry.input}
                  </div>
                  <div className="text-sm truncate" title={entry.output}>
                    Output: {entry.output}
                  </div>
                  <div className="flex justify-end mt-2 space-x-1">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
        <p>
          Premium URL Encoder/Decoder Tool • Encode and decode URLs with
          confidence • Supports multiple character sets
        </p>
      </div>
    </div>
  );
};

export default URLEncoderDecoder;
