"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import "jsoneditor/dist/jsoneditor.min.css";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

const JsonFormatter = () => {
  const sourceContainerRef = useRef(null);
  const resultContainerRef = useRef(null);
  const sourceEditorRef = useRef(null);
  const resultEditorRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info"); // "info", "success", "error"
  const [indentSize, setIndentSize] = useState(2);
  const [showIndentOptions, setShowIndentOptions] = useState(false);
  const [resultMode, setResultMode] = useState("code");
  const { setTool } = useAppContext();
  const [JSONEditor, setJSONEditor] = useState(null);

  useEffect(() => {
    import("jsoneditor").then((mod) => setJSONEditor(() => mod.default));
  }, []);

  const [fileType, setFileType] = useState("json");

  const editorHeight = "calc(100vh - 300px)";

  const validateJson = useCallback(() => {
    try {
      const json = sourceEditorRef.current.get();
      resultEditorRef.current.set(json);
      setStatusMessage("JSON is valid");
      setStatusType("success");
      return true;
    } catch (error) {
      resultEditorRef.current.set({ "Invalid JSON:": error.message });
      setStatusType("error");
      return false;
    }
  }, []);

  const beautifyJson = useCallback(
    (spaces) => {
      if (validateJson()) {
        const json = sourceEditorRef.current.get();
        const beautified = JSON.stringify(json, null, spaces);
        resultEditorRef.current.setText(beautified);
        setStatusMessage(`JSON formatted with ${spaces} space indent`);
        setStatusType("success");
        setShowIndentOptions(false);
      }
    },
    [validateJson]
  );

  const minifyJson = useCallback(() => {
    if (validateJson()) {
      const json = sourceEditorRef.current.get();
      const minified = JSON.stringify(json);
      resultEditorRef.current.setText(minified);
      setStatusMessage("JSON minified successfully");
      setStatusType("success");
    }
  }, [validateJson]);

  const cleanXML = (xmlString) => {
    return (
      "<document>" +
      xmlString
        .trim() // Remove leading/trailing spaces and quotes if present
        .replace(/^"(.*)"$/, "$1") // Remove quotes at the start and end if present
        .replace(/\\n/g, "") // Remove all `\n`
        .replace(/\\t/g, "") // Remove any `\t` (tab characters)
        .replace(/\\"/g, '"') // Fix escaped double quotes if any
        .replace(" ", "") +
      "</document>"
    );
  };

  const cleanYAML = (yamlString) => {
    return yamlString
      .trim() // Remove leading/trailing spaces and quotes if present
      .replace(/^"(.*)"$/, "$1") // Remove quotes at the start and end if present
      .replace(/\\n/g, "\n") // Convert `\n` back to actual newlines
      .replace(/\\t/g, "\t") // Convert `\t` back to actual tabs
      .replace(/\\'/g, "'") // Fix escaped single quotes if any
      .replace(/\\"/g, '"'); // Fix escaped double quotes if any
  };

  const cleanCSV = (csvString) => {
    return csvString
      .trim() // Remove leading/trailing spaces and quotes if present
      .replace(/^"(.*)"$/, "$1") // Remove quotes at the start and end if present
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\\"/g, '"'); // Fix escaped double quotes if any
  };

  const cleanJSON = (jsonString) => {
    return jsonString
      .trim() // Remove leading/trailing spaces and quotes if present
      .replace(/^"(.*)"$/, "$1") // Remove quotes at the start and end if present
      .replace(/\\n/g, "") // Remove `\n`
      .replace(/\\t/g, "") // Remove `\t`
      .replace(/\\"/g, '"'); // Fix escaped double quotes
  };

  const downloadAsFile = useCallback(() => {
    try {
      const json = resultEditorRef.current.getText();
      // remove front and last quotes
      let jsonString = JSON.stringify(json, null, indentSize);

      if (fileType === "xml") {
        jsonString = cleanXML(jsonString);
      } else if (fileType === "yaml") {
        jsonString = cleanYAML(jsonString);
      } else if (fileType === "csv") {
        jsonString = cleanCSV(jsonString);
      } else if (fileType === "json") {
        jsonString = cleanJSON(jsonString);
      }

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `result.${fileType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage("File downloaded successfully");
      setStatusType("success");
    } catch (error) {
      setStatusMessage(`Download failed: ${error.message}`);
      setStatusType("error");
    }
  }, [indentSize, fileType]);

  const convertJson = async (format) => {
    try {
      const json = sourceEditorRef.current.get(); // Get JSON input

      if (format === "yaml") {
        const yaml = (await import("js-yaml")).default;
        resultEditorRef.current.setText(yaml.dump(json));
      } else if (format === "csv") {
        const Papa = (await import("papaparse")).default;

        // Function to flatten the JSON object
        const flattenObject = (obj, prefix = "") => {
          return Object.keys(obj).reduce((acc, key) => {
            const propName = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
              Object.assign(acc, flattenObject(obj[key], propName));
            } else {
              acc[propName] = Array.isArray(obj[key])
                ? obj[key].join(", ")
                : obj[key];
            }
            return acc;
          }, {});
        };

        const json = sourceEditorRef.current.get();
        const flattenedJson = Array.isArray(json)
          ? json.map((item) => flattenObject(item))
          : [flattenObject(json)]; // Ensure it's an array

        const csv = Papa.unparse(flattenedJson);
        resultEditorRef.current.setText(csv);
      } else if (format === "xml") {
        const xmljs = (await import("xml-js")).default;
        const xml = xmljs.json2xml(json, { compact: true, spaces: 2 });
        resultEditorRef.current.setText(xml);
      }

      setStatusMessage(`Converted to ${format.toUpperCase()}`);
      setStatusType("success");
    } catch (error) {
      console.log(`Conversion error: ${error.message}`);
      setStatusType("error");
    }
  };

  const copyToClipboard = useCallback((editor, type) => {
    try {
      const jsonString = editor.getText();
      navigator.clipboard
        .writeText(jsonString)
        .then(() => {
          setStatusMessage(`${type} copied to clipboard`);
          setStatusType("success");
        })
        .catch((error) => {
          setStatusMessage(`Clipboard error: ${error.message}`);
          setStatusType("error");
        });
    } catch (error) {
      setStatusMessage(`Clipboard error: ${error.message}`);
      setStatusType("error");
    }
  }, []);

  const copyResultToClipboard = useCallback(() => {
    copyToClipboard(resultEditorRef.current, "Result");
  }, [copyToClipboard]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          sourceEditorRef.current.setText(content);
          setStatusMessage("File uploaded successfully");
          setStatusType("success");
        } catch (error) {
          setStatusMessage(`File upload error: ${error.message}`);
          setStatusType("error");
        }
      };
      reader.readAsText(file);
      // send size of the file to google analytics
      logGAEvent(applicationNamesForGA.jsonFormatterViewer + "_file_uploaded", {
        file_size: file.size,
      });
    }
  }, []);

  useEffect(() => {
    if (JSONEditor) {
      setTool("JSON Formatter");
      if (sourceContainerRef.current && resultContainerRef.current) {
        // Create source editor
        sourceEditorRef.current = new JSONEditor(sourceContainerRef.current, {
          mode: "code",
          onChange: () => {
            setStatusMessage("");
          },
        });

        // Create result editor (read-only to start)
        resultEditorRef.current = new JSONEditor(resultContainerRef.current, {
          mode: "code",
          onValidationError: (errors) => {
            if (errors.length) {
              setStatusMessage("Invalid JSON in result editor");
              setStatusType("error");
            }
          },
        });

        // Initialize with empty objects
        sourceEditorRef.current.set({});
        resultEditorRef.current.set({});
      }
    }

    return () => {
      setTool(null);
      if (sourceEditorRef.current) {
        sourceEditorRef.current.destroy();
      }
      if (resultEditorRef.current) {
        resultEditorRef.current.destroy();
      }
    };
  }, [setTool, JSONEditor]);

  useEffect(() => {
    let timeout;
    if (JSONEditor) {
      // Set focus to source editor after a short delay
      timeout = setTimeout(() => {
        if (sourceEditorRef.current) {
          try {
            // Force text mode to avoid null display
            sourceEditorRef.current.aceEditor.session.setMode("ace/mode/text");
            sourceEditorRef.current.aceEditor.setValue("");
            // Set focus and move cursor to beginning
            sourceEditorRef.current.aceEditor.focus();
            sourceEditorRef.current.aceEditor.gotoLine(1, 0);

            // Add event listener to switch to code mode on first input
            sourceEditorRef.current.aceEditor.on(
              "change",
              function onFirstChange() {
                sourceEditorRef.current.aceEditor.session.setMode(
                  "ace/mode/json"
                );
                // Remove this event listener after first change to avoid redundant mode switching
                sourceEditorRef.current.aceEditor.off("change", onFirstChange);
              }
            );
          } catch (e) {
            console.error("Failed to set focus:", e);
          }
        }
      }, 10);
    }

    return () => clearTimeout(timeout);
  }, [JSONEditor]);

  useEffect(() => {
    if (JSONEditor) {
      if (resultEditorRef.current) {
        try {
          const currentJson = resultEditorRef.current.get(); // Get current content

          resultEditorRef.current.destroy(); // Destroy the existing editor

          resultEditorRef.current = new JSONEditor(resultContainerRef.current, {
            mode: resultMode, // Set the new mode ('tree' or 'code')
          });

          resultEditorRef.current.set(currentJson); // Restore previous content
        } catch (error) {
          setStatusMessage(
            `Only valid JSON can be converted to tree view: ${error.message}`,
            error
          );
          setStatusType("error");
        }
      }
    }
  }, [resultMode, JSONEditor]);

  useEffect(() => {
    let timeout;
    if (statusMessage) {
      timeout = setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const indentOptions = useMemo(
    () => [
      { spaces: 2, label: "2-Space Indent" },
      { spaces: 3, label: "3-Space Indent" },
      { spaces: 4, label: "4-Space Indent" },
    ],
    []
  );

  return (
    <div className="text-black font-[family-name:var(--font-monospace)]">
      {/* Status message */}
      {statusMessage && (
        <div
          align="center"
          style={{
            top: "5rem",
            right: "2rem",
          }}
          className={`absolute  border mb-4 p-2 rounded-md ${
            statusType === "success"
              ? "bg-green-100 text-green-800 border-green-500"
              : statusType === "error"
              ? "bg-red-100 text-red-800 border-red-500"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 p-6 pt-2">
        {/* Source Editor */}
        <div className="flex-1">
          <div className="flex justify-start items-center mb-2 gap-6">
            <h2 className="text-lg font-semibold">Input JSON</h2>
            <div>Or</div>
            <div className="text-transparent rounded flex items-center w-20">
              <input
                type="file"
                accept=".json"
                onClick={() =>
                  logGAEvent(
                    applicationNamesForGA.jsonFormatterViewer +
                      "_click_file_upload"
                  )
                }
                onChange={handleFileUpload}
                className="rounded text-sm"
              />
            </div>
          </div>
          <div ref={sourceContainerRef} style={{ height: editorHeight }} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-start gap-3">
          <br />
          <br />

          <button
            onClick={() => {
              validateJson();
              setFileType("json");
              logGAEvent(
                applicationNamesForGA.jsonFormatterViewer + "_click_validate"
              );
            }}
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-4 py-2 rounded"
          >
            Validate / Format →
          </button>

          {/* Format dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowIndentOptions(!showIndentOptions);
                setFileType("json");
                logGAEvent(
                  applicationNamesForGA.jsonFormatterViewer +
                    "_click_space_indent"
                );
              }}
              className="bg-purple-500 font-bold hover:bg-purple-600 text-white px-4 py-2 rounded w-full flex justify-around items-center"
            >
              <span>{indentSize} Space Indent</span>
              <span>{showIndentOptions ? "▲" : "▼"}</span>
            </button>

            {showIndentOptions && (
              <div className="absolute text-white mt-1 w-full bg-black border rounded shadow-lg z-10">
                {indentOptions.map((option) => (
                  <button
                    key={option.spaces}
                    onClick={() => {
                      setIndentSize(option.spaces);
                      beautifyJson(option.spaces);
                    }}
                    className="block w-full text-left px-4 py-2"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              minifyJson();
              setFileType("json");
              logGAEvent(
                applicationNamesForGA.jsonFormatterViewer + "_click_minify"
              );
            }}
            className="font-bold bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Minify / Compact →
          </button>
          <br />
          <div align="center" className="text-sm">
            Convert JSON
          </div>
          <button
            onClick={() => {
              convertJson("yaml");
              setFileType("yaml");
              logGAEvent(
                applicationNamesForGA.jsonFormatterViewer +
                  "_click_convert_yaml"
              );
            }}
            className="font-bold hover:bg-gray-600 text-sm hover:text-white bg-white border text-gray-600 px-4 py-2 rounded"
          >
            to YAML →
          </button>
          <button
            onClick={() => {
              convertJson("xml");
              setFileType("xml");
              logGAEvent(
                applicationNamesForGA.jsonFormatterViewer + "_click_convert_xml"
              );
            }}
            className="font-bold hover:bg-gray-600 text-sm hover:text-white bg-white border text-gray-600 px-4 py-2 rounded"
          >
            to XML →
          </button>
          <button
            onClick={() => {
              convertJson("csv");
              setFileType("csv");
              logGAEvent(
                applicationNamesForGA.jsonFormatterViewer + "_click_convert_csv"
              );
            }}
            className="font-bold hover:bg-gray-600 text-sm hover:text-white bg-white border text-gray-600 px-4 py-2 rounded"
          >
            to CSV →
          </button>
        </div>

        {/* Result Editor */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Result JSON</h2>
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  downloadAsFile();
                  logGAEvent(
                    applicationNamesForGA.jsonFormatterViewer +
                      "_click_download"
                  );
                }}
                className="font-bold bg-blue-500 hover:bg-gray-600 text-sm text-white px-3 py-1 rounded flex items-center gap-1"
              >
                Download ↓
              </button>
              &nbsp; &nbsp;
              <button
                onClick={() => {
                  copyResultToClipboard();
                  logGAEvent(
                    applicationNamesForGA.jsonFormatterViewer + "_click_copy"
                  );
                }}
                className="bg-blue-500 hover:bg-gray-600 text-sm text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <span>📋</span> Copy
              </button>
            </div>
          </div>

          <div
            ref={resultContainerRef}
            style={{ height: editorHeight, position: "relative", zIndex: 0 }}
          >
            <select
              onChange={(event) => {
                setResultMode(event.target.value);
                logGAEvent(
                  applicationNamesForGA.jsonFormatterViewer +
                    "_change_result_mode",
                  {
                    mode: event.target.value,
                  }
                );
              }}
              className="absolute top-1 outline-0 right-4 bg-transparent text-sm text-white px-3 py-1 rounded z-10"
            >
              <option value="code">Code view</option>
              <option value="view">Tree view</option>
              <option value="text">Text view</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
