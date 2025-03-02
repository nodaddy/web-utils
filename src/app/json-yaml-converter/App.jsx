"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function JsonYamlConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [conversionType, setConversionType] = useState("json-to-yaml");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("JSON YAML Converter");
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

  const yamlToJson = (yaml) => {
    try {
      // Improved YAML to JSON conversion
      const lines = yaml.split("\n");
      let jsonObj = {};
      let currentObj = jsonObj;
      let parentStack = [];
      let indentStack = [];
      let keyStack = [];
      let lastIndent = 0;
      let inArray = false;
      let arrayStack = [];
      let currentArrayPath = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith("#")) continue;

        // Calculate indentation
        const indent = line.search(/\S/);
        if (indent === -1) continue;

        // Check if line is an array item
        const isArrayItem = line.trim().startsWith("- ");

        if (isArrayItem) {
          const content = line.trim().substring(2);

          // Handle the indentation change
          if (indent > lastIndent) {
            // Going deeper - new array
            parentStack.push(currentObj);
            indentStack.push(lastIndent);
            const lastKey = keyStack[keyStack.length - 1];
            currentObj[lastKey] = [];
            arrayStack.push(true);
            currentArrayPath = lastKey;
          } else if (indent < lastIndent) {
            // Going back up
            while (
              indentStack.length &&
              indent <= indentStack[indentStack.length - 1]
            ) {
              currentObj = parentStack.pop();
              indentStack.pop();
              arrayStack.pop();
              if (keyStack.length) keyStack.pop();
            }

            if (arrayStack.length) {
              currentArrayPath = keyStack[keyStack.length - 1];
            } else {
              currentArrayPath = null;
            }
          }

          // We're in an array context
          inArray = true;

          if (content.includes(":")) {
            // Complex object in array
            const newObj = {};
            currentObj[currentArrayPath].push(newObj);

            // Set up to process this object in the next lines
            parentStack.push(currentObj);
            currentObj = newObj;
            indentStack.push(indent);
            arrayStack.push(false);
            inArray = false;
          } else if (content) {
            // Simple value in array
            let parsedValue = parseYamlValue(content);
            currentObj[currentArrayPath].push(parsedValue);
          } else {
            // Empty object in array - look ahead to see if it's a complex object
            const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
            if (nextLine && nextLine.search(/\S/) > indent) {
              // New nested object in the array
              const newObj = {};
              currentObj[currentArrayPath].push(newObj);

              parentStack.push(currentObj);
              currentObj = newObj;
              indentStack.push(indent);
              arrayStack.push(false);
              inArray = false;
            } else {
              // Empty value in array
              currentObj[currentArrayPath].push({});
            }
          }
        } else {
          // Regular key-value pair
          const colonIndex = line.indexOf(":");
          if (colonIndex === -1) continue; // Invalid line

          const key = line.substring(indent, colonIndex).trim();
          // Handle quoted keys
          const unquotedKey = key.replace(/^["'](.*)["']$/, "$1");

          let value =
            colonIndex + 1 < line.length
              ? line.substring(colonIndex + 1).trim()
              : "";

          // Handle indentation changes
          if (indent > lastIndent) {
            // Going deeper in the hierarchy
            if (!inArray) {
              parentStack.push(currentObj);
              indentStack.push(lastIndent);
              const lastKey = keyStack[keyStack.length - 1];
              if (
                typeof currentObj[lastKey] !== "object" ||
                currentObj[lastKey] === null
              ) {
                currentObj[lastKey] = {};
              }
              currentObj = currentObj[lastKey];
            }
            inArray = false;
          } else if (indent < lastIndent) {
            // Going back up in the hierarchy
            while (
              indentStack.length &&
              indent <= indentStack[indentStack.length - 1]
            ) {
              currentObj = parentStack.pop();
              indentStack.pop();
              if (arrayStack.length && arrayStack.pop()) {
                inArray = false;
              }
              if (keyStack.length) keyStack.pop();
            }
            inArray = arrayStack.length && arrayStack[arrayStack.length - 1];
          } else if (inArray && indent === lastIndent) {
            // Same level, but we're in an array, so we need to move back to parent
            currentObj = parentStack[parentStack.length - 1];
            inArray = false;
          }

          // Store the current key
          keyStack.push(unquotedKey);

          if (value) {
            // Regular inline value
            currentObj[unquotedKey] = parseYamlValue(value);
          } else {
            // Check if next line has greater indentation (object) or is array item
            const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
            if (nextLine && nextLine.search(/\S/) > indent) {
              // Object or array coming up
              if (nextLine.trim().startsWith("- ")) {
                // Initialize as empty array, will be filled in subsequent lines
                currentObj[unquotedKey] = [];
                currentArrayPath = unquotedKey;
              } else {
                // Initialize as empty object
                currentObj[unquotedKey] = {};
              }
            } else {
              // Empty value
              currentObj[unquotedKey] = null;
            }
          }
        }

        lastIndent = indent;
      }

      return JSON.stringify(jsonObj, null, 2);
    } catch (err) {
      throw new Error(
        "Invalid YAML format. Please check your input: " + err.message
      );
    }
  };

  const parseYamlValue = (value) => {
    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.substring(1, value.length - 1);
    }

    // Handle boolean and null values
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null" || value === "~") return null;

    // Handle numbers
    if (/^-?\d+$/.test(value)) return parseInt(value, 10);
    if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

    // Handle arrays
    if (value === "[]") return [];
    if (value === "{}") return {};

    // Otherwise it's a string
    return value;
  };

  const jsonToYaml = (json) => {
    try {
      const obj = JSON.parse(json);
      return convertToYaml(obj, 0);
    } catch (err) {
      throw new Error("Invalid JSON format. Please check your input.");
    }
  };

  const validateYaml = (yaml) => {
    try {
      // Simple validation approach - try to parse YAML back to JSON
      return yamlToJson(yaml);
    } catch (err) {
      return false;
    }
  };

  const convertToYaml = (obj, indent = 0) => {
    const indentSpaces = " ".repeat(indent);
    let yaml = "";

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        yaml += "[]";
      } else {
        for (const item of obj) {
          yaml += `${indentSpaces}- `;
          if (typeof item === "object" && item !== null) {
            if (Object.keys(item).length === 0) {
              yaml += "{}\n";
            } else {
              yaml += "\n";
              const itemYaml = convertToYaml(item, indent + 2);
              yaml +=
                itemYaml
                  .split("\n")
                  .map((line) => `${indentSpaces}  ${line}`)
                  .join("\n") + "\n";
            }
          } else {
            yaml += `${formatScalarValue(item)}\n`;
          }
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        yaml += "{}\n";
      } else {
        for (const key of keys) {
          const value = obj[key];
          yaml += `${indentSpaces}${escapeYamlKey(key)}: `;

          if (value === null) {
            yaml += "null\n";
          } else if (typeof value === "object") {
            if (Array.isArray(value) && value.length === 0) {
              yaml += "[]\n";
            } else if (
              !Array.isArray(value) &&
              Object.keys(value).length === 0
            ) {
              yaml += "{}\n";
            } else {
              yaml += "\n" + convertToYaml(value, indent + 2);
            }
          } else {
            yaml += `${formatScalarValue(value)}\n`;
          }
        }
      }
    } else {
      yaml += formatScalarValue(obj) + "\n";
    }

    return yaml;
  };

  const escapeYamlKey = (key) => {
    // Escape keys that need quotes
    if (
      key.includes(":") ||
      key.includes(" ") ||
      key.includes("-") ||
      key.includes("#") ||
      /^[0-9]/.test(key) ||
      key === "" ||
      ["true", "false", "yes", "no", "null", "on", "off"].includes(
        key.toLowerCase()
      )
    ) {
      return `"${key.replace(/"/g, '\\"')}"`;
    }
    return key;
  };

  const formatScalarValue = (value) => {
    if (value === null) return "null";
    if (value === undefined) return "~";
    if (typeof value === "string") {
      // Handle multiline strings
      if (value.includes("\n")) {
        return (
          "|\n" +
          value
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n")
        );
      }

      // Add quotes if the string contains special characters
      if (
        value.includes(":") ||
        value.includes("#") ||
        value.includes(" ") ||
        /^[0-9]/.test(value) ||
        value === "" ||
        ["true", "false", "yes", "no", "null", "on", "off"].includes(
          value.toLowerCase()
        )
      ) {
        // Escape any existing quotes
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError("Please enter some input or upload a file.");
      return;
    }

    try {
      let result;
      if (conversionType === "json-to-yaml") {
        result = jsonToYaml(input);

        // Validate the YAML output
        const validationCheck = validateYaml(result);
        if (validationCheck === false) {
          throw new Error(
            "Generated YAML validation failed. Please check your JSON input."
          );
        }
      } else {
        result = yamlToJson(input);

        // Validate the JSON output
        try {
          JSON.parse(result);
        } catch (e) {
          throw new Error(
            "Generated JSON validation failed. Please check your YAML input."
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

    const extension = conversionType === "json-to-yaml" ? "yaml" : "json";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-xl ">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                conversionType === "json-to-yaml"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => handleConversionTypeChange("json-to-yaml")}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">JSON to YAML</span>
              </div>
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                conversionType === "yaml-to-json"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => handleConversionTypeChange("yaml-to-json")}
            >
              <div className="flex items-center justify-center">
                <span className="font-medium">YAML to JSON</span>
              </div>
            </button>
          </div>

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
                    ? "border-blue-500 bg-gray-700/50"
                    : "border-gray-600"
                } rounded-lg transition-all h-80`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <textarea
                  className="w-full h-full p-4 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    conversionType === "json-to-yaml"
                      ? "Paste your JSON here..."
                      : "Paste your YAML here..."
                  }
                ></textarea>

                {isDragging && (
                  <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center rounded-lg">
                    <div className="text-blue-400 flex flex-col items-center">
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
                accept=".json,.yaml,.yml,.txt"
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
                  className="w-full h-full p-4 bg-gray-800 rounded-lg focus:outline-none resize-none font-mono text-sm text-green-400"
                  value={output}
                  readOnly
                  placeholder={`Converted ${
                    conversionType === "json-to-yaml" ? "YAML" : "JSON"
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
                  applicationNamesForGA.jsonYamlConverter,
                  "_click_convert"
                );
                handleConvert();
              }}
              className={`px-8 py-3 rounded-lg bg-gradient-to-r ${
                conversionType === "json-to-yaml"
                  ? "from-blue-600 to-blue-700"
                  : "from-purple-600 to-purple-700"
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
                Choose the conversion type (JSON to YAML or YAML to JSON)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                2
              </span>
              <span>
                Enter your input text or upload a file (drag and drop also
                supported)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                3
              </span>
              <span>Click the "Convert" button to process your data</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm mr-2">
                4
              </span>
              <span>Copy or download the converted output</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>JSON ↔ YAML Converter • Premium Web Utility</p>
        </div>
      </div>
    </div>
  );
}
