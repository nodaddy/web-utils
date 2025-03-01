"use client";

import { useState } from "react";

export default function MarkdownToolbar({
  viewMode,
  setViewMode,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  insertTextAtCursor,
  exportAsHTML,
  exportAsPDF,
  exportAsMarkdown,
  clearEditor,
  toggleFullscreen,
  isFullscreen
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Toolbar button style
  const buttonStyle = "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded";
  
  // Format handlers
  const handleBold = () => insertTextAtCursor("**", "**");
  const handleItalic = () => insertTextAtCursor("*", "*");
  const handleHeading = (level) => {
    const prefix = "#".repeat(level) + " ";
    insertTextAtCursor(prefix);
  };
  const handleLink = () => insertTextAtCursor("[", "](https://)");
  const handleImage = () => insertTextAtCursor("![Alt text](", ")");
  const handleCode = () => insertTextAtCursor("`", "`");
  const handleCodeBlock = () => insertTextAtCursor("```\n", "\n```");
  const handleBlockquote = () => insertTextAtCursor("> ");
  const handleUnorderedList = () => insertTextAtCursor("- ");
  const handleOrderedList = () => insertTextAtCursor("1. ");
  const handleHorizontalRule = () => insertTextAtCursor("\n---\n");
  const handleTable = () => {
    insertTextAtCursor(
      "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n"
    );
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Main toolbar */}
      <div className="flex flex-wrap items-center p-2 gap-1">
        {/* View mode toggles */}
        <div className="flex border rounded overflow-hidden mr-2">
          <button
            className={`px-3 py-1 text-xs font-medium ${
              viewMode === "split" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setViewMode("split")}
            title="Split View"
          >
            Split
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium ${
              viewMode === "editor" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setViewMode("editor")}
            title="Editor Only"
          >
            Editor
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium ${
              viewMode === "preview" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setViewMode("preview")}
            title="Preview Only"
          >
            Preview
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 border-l border-gray-300 mx-1"></div>

        {/* Text formatting */}
        <button className={buttonStyle} onClick={handleBold} title="Bold">
          <strong>B</strong>
        </button>
        <button className={buttonStyle} onClick={handleItalic} title="Italic">
          <em>I</em>
        </button>
        <button className={buttonStyle} onClick={() => handleHeading(1)} title="Heading 1">
          H1
        </button>
        <button className={buttonStyle} onClick={() => handleHeading(2)} title="Heading 2">
          H2
        </button>
        <button className={buttonStyle} onClick={() => handleHeading(3)} title="Heading 3">
          H3
        </button>

        {/* Separator */}
        <div className="h-6 border-l border-gray-300 mx-1"></div>

        {/* Lists and blocks */}
        <button className={buttonStyle} onClick={handleUnorderedList} title="Bullet List">
          • List
        </button>
        <button className={buttonStyle} onClick={handleOrderedList} title="Numbered List">
          1. List
        </button>
        <button className={buttonStyle} onClick={handleBlockquote} title="Blockquote">
          "Quote"
        </button>
        <button className={buttonStyle} onClick={handleCode} title="Inline Code">
          {`<code>`}
        </button>
        <button className={buttonStyle} onClick={handleCodeBlock} title="Code Block">
          {`<pre>`}
        </button>

        {/* Separator */}
        <div className="h-6 border-l border-gray-300 mx-1 hidden md:block"></div>

        {/* Links and media */}
        <button 
          className={`${buttonStyle} hidden md:block`} 
          onClick={handleLink} 
          title="Link"
        >
          🔗 Link
        </button>
        <button 
          className={`${buttonStyle} hidden md:block`} 
          onClick={handleImage} 
          title="Image"
        >
          🖼️ Image
        </button>
        <button 
          className={`${buttonStyle} hidden md:block`} 
          onClick={handleTable} 
          title="Table"
        >
          📊 Table
        </button>
        <button 
          className={`${buttonStyle} hidden md:block`} 
          onClick={handleHorizontalRule} 
          title="Horizontal Rule"
        >
          ― HR
        </button>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Export dropdown */}
        <div className="relative">
          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            Export <span className="ml-1">▼</span>
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    exportAsHTML();
                    setShowExportMenu(false);
                  }}
                >
                  Export as HTML
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    exportAsPDF();
                    setShowExportMenu(false);
                  }}
                >
                  Export as PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    exportAsMarkdown();
                    setShowExportMenu(false);
                  }}
                >
                  Export as Markdown
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings dropdown */}
        <div className="relative ml-2">
          <button
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            title="Settings"
          >
            ⚙️
          </button>
          {showSettingsMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                {/* Theme toggle */}
                <div className="px-4 py-2">
                  <label className="block text-sm text-gray-700 mb-1">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                {/* Font size */}
                <div className="px-4 py-2">
                  <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      clearEditor();
                      setShowSettingsMenu(false);
                    }}
                  >
                    Clear Editor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen toggle */}
        <button
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded ml-1"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? "⊖" : "⊕"}
        </button>
      </div>
    </div>
  );
} 