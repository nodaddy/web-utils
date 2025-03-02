"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function JsonXmlConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionType, setConversionType] = useState("xml-to-json");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [xmlOptions, setXmlOptions] = useState({
    indentSize: 2,
    rootElement: "root",
    includeDeclaration: true,
  });
  const { setTool } = useAppContext();

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setTool("XML JSON Converter");
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        setInput(content);
        setError("");
      } catch (err) {
        setError("Error reading file. Please try again.");
      }
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        setInput(content);
        setError("");
      } catch (err) {
        setError("Error reading file. Please try again.");
      }
    };

    reader.readAsText(file);
  };

  const handleConversionTypeChange = (type) => {
    setConversionType(type);
    setError("");
  };

  const handleXmlOptionChange = (option, value) => {
    setXmlOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const jsonToXml = (json, options) => {
    try {
      const obj = JSON.parse(json);
      let xml = options.includeDeclaration
        ? '<?xml version="1.0" encoding="UTF-8"?>\n'
        : "";

      // Start with root element
      xml += `<${options.rootElement}>\n`;

      // Convert object to XML
      xml += convertToXml(obj, options.indentSize, 1);

      // Close root element
      xml += `</${options.rootElement}>`;
      return xml;
    } catch (err) {
      throw new Error(
        "Invalid JSON format. Please check your input: " + err.message
      );
    }
  };

  const convertToXml = (obj, indentSize, level) => {
    const indent = " ".repeat(indentSize * level);
    const childIndent = " ".repeat(indentSize * (level + 1));
    let xml = "";

    if (obj === null || obj === undefined) {
      return indent + "<null/>\n";
    }

    if (typeof obj === "boolean" || typeof obj === "number") {
      return `${obj}`;
    }

    if (typeof obj === "string") {
      // Escape XML special characters
      return escapeXml(obj);
    }

    if (Array.isArray(obj)) {
      // For arrays, create an "item" element for each entry
      for (const item of obj) {
        if (typeof item === "object" && item !== null) {
          // For objects in arrays, use a generic 'item' tag
          xml += `${indent}<item>\n`;
          xml += convertToXml(item, indentSize, level + 1);
          xml += `${indent}</item>\n`;
        } else {
          // For primitive values in arrays
          xml += `${indent}<item>${convertToXml(item, indentSize, 0)}</item>\n`;
        }
      }
      return xml;
    }

    // Regular object
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        // Skip if value is undefined
        if (value === undefined) continue;

        // Create valid XML element name from key (replace invalid chars)
        const elementName = makeValidXmlName(key);

        if (value === null) {
          xml += `${indent}<${elementName}/>\n`;
        } else if (typeof value === "object") {
          if (Object.keys(value).length === 0) {
            // Empty object or array
            if (Array.isArray(value)) {
              xml += `${indent}<${elementName}/>\n`;
            } else {
              xml += `${indent}<${elementName}/>\n`;
            }
          } else {
            // Complex object
            xml += `${indent}<${elementName}>\n`;
            xml += convertToXml(value, indentSize, level + 1);
            xml += `${indent}</${elementName}>\n`;
          }
        } else {
          // Simple value
          xml += `${indent}<${elementName}>${convertToXml(
            value,
            indentSize,
            0
          )}</${elementName}>\n`;
        }
      }
    }

    return xml;
  };

  const makeValidXmlName = (name) => {
    // XML elements must start with a letter or underscore, not a number or other char
    let validName = name.replace(/[^a-zA-Z0-9_]/g, "_");

    // If first character is a number, prepend an underscore
    if (/^[0-9]/.test(validName)) {
      validName = "_" + validName;
    }

    return validName;
  };

  const escapeXml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const xmlToJson = (xml) => {
    try {
      // Create a DOM parser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("XML parsing error: " + parseError[0].textContent);
      }

      // Convert XML to JSON
      const result = xmlNodeToJson(xmlDoc.documentElement);
      return JSON.stringify(result, null, 2);
    } catch (err) {
      throw new Error(
        "Invalid XML format. Please check your input: " + err.message
      );
    }
  };

  const xmlNodeToJson = (node) => {
    // Create an object to hold our result
    let obj = {};

    // Process attributes
    if (node.attributes && node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj[`@${attr.nodeName}`] = attr.nodeValue;
      }
    }

    // Process child nodes
    if (node.hasChildNodes()) {
      const childNodes = node.childNodes;

      // Check if node has only one text child
      if (
        childNodes.length === 1 &&
        childNodes[0].nodeType === Node.TEXT_NODE
      ) {
        // If there are attributes, add text content as a special property
        if (Object.keys(obj).length > 0) {
          obj["#text"] = childNodes[0].nodeValue.trim();
        } else {
          // Return just the text value
          return childNodes[0].nodeValue.trim();
        }
      } else {
        // Process complex children
        for (let i = 0; i < childNodes.length; i++) {
          const child = childNodes[i];

          // Skip text nodes that are just whitespace
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.nodeValue.trim();
            if (text) {
              obj["#text"] = text;
            }
            continue;
          }

          // Process element nodes
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childName = child.nodeName;

            // Convert child to JSON
            const childJson = xmlNodeToJson(child);

            // Check if we already have this property
            if (obj[childName]) {
              // If the property exists but isn't an array, make it one
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }

              // Add the new value
              obj[childName].push(childJson);
            } else {
              // Create the property
              obj[childName] = childJson;
            }
          }
        }
      }
    }

    // If we have an empty object and there were no attributes,
    // return null instead of an empty object
    if (Object.keys(obj).length === 0) {
      return null;
    }

    return obj;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please enter some input or upload a file.");
      return;
    }

    try {
      let result;
      if (conversionType === "json-to-xml") {
        result = jsonToXml(input, xmlOptions);

        // Validate XML by trying to parse it
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(result, "text/xml");
          const parseError = xmlDoc.getElementsByTagName("parsererror");
          if (parseError.length > 0) {
            throw new Error("Generated XML validation failed");
          }
        } catch (e) {
          throw new Error(
            "Generated XML validation failed. Please check your JSON input."
          );
        }
      } else {
        result = xmlToJson(input);

        // Validate JSON by trying to parse it
        try {
          JSON.parse(result);
        } catch (e) {
          throw new Error(
            "Generated JSON validation failed. Please check your XML input."
          );
        }
      }
      setOutput(result);
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setFileName("");
  };

  const handleDownload = () => {
    if (!output) return;

    const extension = conversionType === "json-to-xml" ? "xml" : "json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const container = containerRef.current;
      if (container.requestFullscreen) {
        container.requestFullscreen();
        setIsFullScreen(true);
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
        setIsFullScreen(true);
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
        setIsFullScreen(true);
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        setIsFullScreen(false);
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        setIsFullScreen(false);
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl ${
        isFullScreen ? "fullscreen-mode" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl  ">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                conversionType === "xml-to-json"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.xmlJSONConverter + "click_xml_to_json"
                );
                handleConversionTypeChange("xml-to-json");
              }}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">XML to JSON</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                conversionType === "json-to-xml"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.xmlJSONConverter + "click_json_to_xml"
                );
                handleConversionTypeChange("json-to-xml");
              }}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">JSON to XML</span>
              </div>
            </button>
            <button
              className={`py-3 px-4 rounded-lg transition-all bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center`}
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.xmlJSONConverter + "toggle_fullscreen"
                );
                toggleFullScreen();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {isFullScreen ? (
                  <path
                    fillRule="evenodd"
                    d="M5 10a1 1 0 011-1h3a1 1 0 01-1-1V5a1 1 0 112 0v3a1 1 0 01-1 1h3a1 1 0 110 2H9a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 01-1-1H5a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span className="font-medium">
                {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
              </span>
            </button>
          </div>

          {/* XML Options (only show for JSON to XML) */}
          {conversionType === "json-to-xml" && (
            <div className="mb-6 bg-gray-750 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-medium mb-3">XML Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Root Element Name
                  </label>
                  <input
                    type="text"
                    value={xmlOptions.rootElement}
                    onChange={(e) =>
                      handleXmlOptionChange("rootElement", e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="root"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Indent Size
                  </label>
                  <select
                    value={xmlOptions.indentSize}
                    onChange={(e) =>
                      handleXmlOptionChange(
                        "indentSize",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={xmlOptions.includeDeclaration}
                      onChange={(e) =>
                        handleXmlOptionChange(
                          "includeDeclaration",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-400">
                      Include XML Declaration
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Input</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Clear
                  </button>
                </div>
              </div>

              <div
                className={`relative border ${
                  isDragging
                    ? "border-emerald-500 bg-gray-700/50"
                    : "border-gray-600"
                } rounded-lg transition-all h-80`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <textarea
                  className="w-full h-full p-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-sm"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    conversionType === "json-to-xml"
                      ? "Paste your JSON here..."
                      : "Paste your XML here..."
                  }
                ></textarea>

                {isDragging && (
                  <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-lg">
                    <div className="text-emerald-400 flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                      <p>Drop file here</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".json,.xml,.txt"
              />

              {fileName && (
                <div className="text-sm text-gray-400 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {fileName}
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Output</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className={`p-2 text-sm rounded-lg flex items-center ${
                      output
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-700/50 cursor-not-allowed"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                          <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className={`p-2 text-sm rounded-lg flex items-center ${
                      output
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-700/50 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              </div>

              <div className="border border-gray-600 rounded-lg h-80">
                <textarea
                  className="w-full h-full p-4 bg-gray-800 rounded-lg focus:outline-none resize-none font-mono text-sm text-emerald-400"
                  value={output}
                  readOnly
                  placeholder={`Converted ${
                    conversionType === "json-to-xml" ? "XML" : "JSON"
                  } will appear here...`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-600 rounded-lg">
              <p className="text-red-400 text-sm flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Convert button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                logGAEvent(
                  applicationNamesForGA.xmlJSONConverter + "click_convert"
                );
                handleConvert();
              }}
              className={`px-8 py-3 rounded-lg bg-gradient-to-r ${
                conversionType === "json-to-xml"
                  ? "from-emerald-600 to-emerald-700"
                  : "from-teal-600 to-teal-700"
              } hover:shadow-lg transition-all text-white font-medium`}
            >
              Convert
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-medium mb-4">How to use:</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                1
              </span>
              <span>
                Choose the conversion type (JSON to XML or XML to JSON)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                2
              </span>
              <span>
                Configure XML options if needed (for JSON to XML conversion)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                3
              </span>
              <span>
                Enter your input text or upload a file (drag and drop also
                supported)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                4
              </span>
              <span>Click the "Convert" button to process your data</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                5
              </span>
              <span>Copy or download the converted output</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                6
              </span>
              <span>Use the fullscreen button for a distraction-free view</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>JSON ↔ XML Converter • Premium Web Utility</p>
        </div>
      </div>
    </div>
  );
}
