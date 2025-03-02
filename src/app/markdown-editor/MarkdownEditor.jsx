"use client";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../Context/AppContext";
import { jsPDF } from "jspdf";
import { logGAEvent } from "../../app/googleAnalytics/gaEvents";
import MarkdownToolbar from "./MarkdownToolbar";
import MarkdownPreview from "./MarkdownPreview";

// Default markdown content for new users
const DEFAULT_MARKDOWN = `# Welcome to Nexonware Markdown Editor

## Getting Started

This is a **markdown** editor with _live preview_. Start typing in the editor on the left, and see the rendered markdown on the right.

### Basic Markdown Syntax

- **Bold Text**: Wrap text with double asterisks: \`**bold text**\`
- *Italic Text*: Wrap text with single asterisks: \`*italic text*\`
- [Links](https://nexonware.com): \`[Link text](URL)\`
- Images: \`![alt text](image URL)\`
- \`Inline code\`: Wrap with backticks: \`\`\`code\`\`\`
- Lists: Start lines with \`-\` or \`1.\`

### Code Blocks

\`\`\`javascript
// This is a code block
function greet() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

Enjoy using the Nexonware Markdown Editor!
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState("split"); // split, editor, preview
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const { setTool } = useAppContext();

  // Set the tool name in the app context
  useEffect(() => {
    setTool("Markdown Editor");

    // Try to load saved markdown from localStorage
    const savedMarkdown = localStorage.getItem("nexonware-markdown");
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    // Log page view
    logGAEvent("view_markdown_editor");

    return () => {
      // Save markdown to localStorage when component unmounts
      localStorage.setItem("nexonware-markdown", markdown);
    };
  }, [setTool]);

  // Save markdown to localStorage when it changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem("nexonware-markdown", markdown);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [markdown]);

  // Handle editor changes
  const handleEditorChange = (e) => {
    setMarkdown(e.target.value);
  };

  // Insert text at cursor position
  const insertTextAtCursor = (textBefore, textAfter = "") => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText =
      markdown.substring(0, start) +
      textBefore +
      selectedText +
      textAfter +
      markdown.substring(end);

    setMarkdown(newText);

    // Set cursor position after the operation
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(
        start + textBefore.length,
        start + textBefore.length + selectedText.length
      );
    }, 0);
  };

  // Export as HTML
  const exportAsHTML = () => {
    // Create a blob with the HTML content
    const htmlContent = document.querySelector(".markdown-preview").innerHTML;
    const blob = new Blob(
      [
        `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Markdown Export</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
          code { font-family: 'Courier New', Courier, monospace; }
          table { border-collapse: collapse; width: 100%; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        ${htmlContent}
        <footer style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #777;">
          Created with <a href="https://nexonware.com/markdown-editor">Nexonware Markdown Editor</a>
        </footer>
      </body>
      </html>`,
      ],
      { type: "text/html" }
    );

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logGAEvent("export_markdown_html");
  };

  // Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    const previewElement = document.querySelector(".markdown-preview");

    // Set PDF properties
    doc.setProperties({
      title: "Markdown Export",
      subject: "Exported from Nexonware Markdown Editor",
      creator: "Nexonware",
    });

    // Add content to PDF
    doc.html(previewElement, {
      callback: function (pdf) {
        pdf.save("markdown-export.pdf");
      },
      x: 15,
      y: 15,
      width: 170,
      windowWidth: 650,
    });

    logGAEvent("export_markdown_pdf");
  };

  // Export as Markdown
  const exportAsMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logGAEvent("export_markdown_md");
  };

  // Clear editor content
  const clearEditor = () => {
    if (
      confirm(
        "Are you sure you want to clear the editor? This action cannot be undone."
      )
    ) {
      setMarkdown("");
      logGAEvent("clear_markdown_editor");
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Font size classes
  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Toolbar */}
      <MarkdownToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        insertTextAtCursor={insertTextAtCursor}
        exportAsHTML={exportAsHTML}
        exportAsPDF={exportAsPDF}
        exportAsMarkdown={exportAsMarkdown}
        clearEditor={clearEditor}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      {/* Editor and Preview */}
      <div
        className={`flex ${
          viewMode === "split" ? "flex-col md:flex-row" : "flex-col"
        }`}
      >
        {/* Editor */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div
            className={`${
              viewMode === "split" ? "md:w-1/2" : "w-full"
            } border-r border-gray-200`}
          >
            <div className="p-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Editor</h3>
            </div>
            <textarea
              ref={editorRef}
              value={markdown}
              onChange={handleEditorChange}
              className={`w-full p-4 font-mono ${
                fontSizeClasses[fontSize]
              } focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-900 text-gray-100"
                  : "bg-white text-gray-800"
              }`}
              style={{
                minHeight: "500px",
                height: isFullscreen ? "calc(100vh - 120px)" : "500px",
                resize: "vertical",
              }}
              spellCheck="false"
            ></textarea>
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`${viewMode === "split" ? "md:w-1/2" : "w-full"}`}>
            <div className="p-2 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Preview</h3>
            </div>
            <div
              className={`p-4 overflow-auto ${fontSizeClasses[fontSize]} ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-800"
              }`}
              style={{
                minHeight: "500px",
                height: isFullscreen ? "calc(100vh - 120px)" : "500px",
              }}
            >
              <MarkdownPreview markdown={markdown} />
            </div>
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="p-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
        <span>{markdown.length} characters</span>
        <span>{markdown.split(/\s+/).filter(Boolean).length} words</span>
        <span>{markdown.split(/\n+/).filter(Boolean).length} lines</span>
      </div>
    </div>
  );
}
