"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState("");

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("Base64 Encode/Decode");
  }, []);

  useEffect(() => {
    handleConversion();
  }, [input, mode]);

  const handleConversion = () => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        // For encoding strings to Base64
        const encodedText = btoa(unescape(encodeURIComponent(input)));
        setOutput(encodedText);
      } else {
        // For decoding Base64 to string
        const decodedText = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decodedText);
      }
    } catch (e) {
      console.error(e);
      setError(
        mode === "encode"
          ? "Error encoding text to Base64"
          : "Error decoding Base64. Please check if the input is valid Base64."
      );
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setFileContent(null);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Add to history
      if (!history.some((item) => item.input === input && item.mode === mode)) {
        const newHistoryItem = {
          id: Date.now(),
          input: input,
          output: output,
          mode: mode,
          timestamp: new Date().toLocaleString(),
        };
        setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10)); // Keep only last 10 items
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (mode === "encode") {
      reader.onload = (event) => {
        const result = event.target.result;
        const base64 = result.split(",")[1]; // Get base64 part from data URL
        setInput(base64);
        setFileContent(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        const text = event.target.result;
        setInput(text);
        setFileContent(file.name);
      };
      reader.readAsText(file);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    // Optionally swap input/output when switching modes
    setInput(output);
    setFileContent(null);
    setError("");
  };

  const loadFromHistory = (item) => {
    setInput(item.input);
    setMode(item.mode);
    setOutput(item.output);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-2 max-w-4xl">
        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-500">
            Base64 Encoder/Decoder
          </h1>
        </div>
        <br />

        {/* Main card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          {/* Mode switcher */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors duration-200 
                ${
                  mode === "encode"
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.Base64EncoderDecoder + "_click_encode"
                );
                setMode("encode");
              }}
            >
              Encode to Base64
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors duration-200
                ${
                  mode === "decode"
                    ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.Base64EncoderDecoder + "_click_decode"
                );
                setMode("decode");
              }}
            >
              Decode from Base64
            </button>
          </div>

          <div className="p-5">
            {/* Input section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="input"
                  className="block text-sm font-medium text-gray-700"
                >
                  {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
                </label>
                <div className="flex space-x-2">
                  <label
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200"
                    htmlFor="fileInput"
                  >
                    {/* Upload icon */}
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    Upload
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    {/* Clear icon */}
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    Clear
                  </button>
                </div>
              </div>

              {fileContent && (
                <div className="mb-2 text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  File: {fileContent}
                </div>
              )}

              <textarea
                id="input"
                value={input}
                onChange={(e) => {
                  logGAEvent(
                    applicationNamesForGA.Base64EncoderDecoder + "_change_input"
                  );
                  setInput(e.target.value);
                }}
                placeholder={
                  mode === "encode"
                    ? "Enter text to convert to Base64..."
                    : "Enter Base64 string to decode..."
                }
                className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors text-base leading-relaxed font-normal"
              ></textarea>
            </div>

            {/* Conversion arrow */}
            <div className="flex justify-center items-center my-3 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <button
                onClick={switchMode}
                className="relative z-10 flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Output section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="output"
                  className="block text-sm font-medium text-gray-700"
                >
                  {mode === "encode" ? "Base64 Result" : "Decoded Result"}
                </label>
                <button
                  onClick={() => {
                    logGAEvent(
                      applicationNamesForGA.Base64EncoderDecoder + "_click_copy"
                    );
                    handleCopy();
                  }}
                  disabled={!output}
                  className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors border ${
                    copied
                      ? "bg-green-50 text-green-700 border-green-200"
                      : output
                      ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {copied ? (
                    <>
                      {/* Check icon */}
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Copied!
                    </>
                  ) : (
                    <>
                      {/* Copy icon */}
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        ></path>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="output"
                value={output}
                readOnly
                placeholder={
                  mode === "encode"
                    ? "Base64 output will appear here..."
                    : "Decoded text will appear here..."
                }
                className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none transition-colors font-mono text-base"
              ></textarea>

              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History section - Collapsible */}
        {history.length > 0 && (
          <div className="mt-5 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div
              className="px-5 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => setShowHistory(!showHistory)}
            >
              <h2 className="text-lg font-medium text-gray-800">
                Recent Conversions
              </h2>
              <button className="text-gray-600">
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    showHistory ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            {showHistory && (
              <div className="divide-y divide-gray-200">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              item.mode === "encode"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {item.mode === "encode" ? "Encoded" : "Decoded"}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 font-mono truncate max-w-lg">
                          {item.input.length > 50
                            ? `${item.input.substring(0, 50)}...`
                            : item.input}
                        </div>
                      </div>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Reuse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            Base64 is a group of binary-to-text encoding schemes that represent
            binary data in ASCII string format. This utility works entirely in
            your browser. No data is sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
