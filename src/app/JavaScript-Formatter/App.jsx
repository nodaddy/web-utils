'use client';

import React, { useState } from 'react';

export default function JavaScriptFormatter() {
  const [code, setCode] = useState('');
  const [formattedCode, setFormattedCode] = useState('');
  const [error, setError] = useState('');
  const [spacesCount, setSpacesCount] = useState(2);
  const [isCopied, setIsCopied] = useState(false);

  const formatCode = () => {
    try {
      // Parse the code to check if it's valid JavaScript
      JSON.parse(`{"code": function() { ${code} }}`);
      
      // Use built-in JSON for formatting with indentation
      const formatted = js_beautify(code, {
        indent_size: spacesCount,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        brace_style: 'collapse',
        keep_array_indentation: false,
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_empty_lines: false,
        break_chained_methods: false,
        comma_first: false
      });
      
      setFormattedCode(formatted);
      setError('');
    } catch (err) {
      setError(`Error: ${err.message}. Please check your JavaScript syntax.`);
      setFormattedCode('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            JavaScript Formatter <span role="img" aria-label="sparkles">✨</span>
          </h1>
          <p className="text-lg text-gray-600">
            Beautify your JavaScript code with ease <span role="img" aria-label="rocket">🚀</span>
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Input Code <span role="img" aria-label="keyboard">⌨️</span>
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="spaces" className="text-sm text-gray-600 mr-2">
                    Spaces:
                  </label>
                  <select
                    id="spaces"
                    className="border rounded px-2 py-1 text-sm"
                    value={spacesCount}
                    onChange={(e) => setSpacesCount(Number(e.target.value))}
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </div>
                <button
                  onClick={formatCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-colors duration-200"
                >
                  Format <span role="img" aria-label="magic">✨</span>
                </button>
              </div>
            </div>

            <textarea
              className="w-full h-64 p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your JavaScript code here..."
            ></textarea>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <span role="img" aria-label="warning">⚠️</span> {error}
              </div>
            )}

            {formattedCode && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Formatted Code <span role="img" aria-label="sparkles">✨</span>
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow-sm transition-colors duration-200"
                  >
                    {isCopied ? (
                      <>
                        <span role="img" aria-label="check" className="mr-1">✅</span> Copied!
                      </>
                    ) : (
                      <>
                        <span role="img" aria-label="clipboard" className="mr-1">📋</span> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-50 border rounded-md p-4 overflow-x-auto font-mono text-sm">
                  {formattedCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>
            Made with <span role="img" aria-label="love">❤️</span> by your JavaScript Formatter
          </p>
        </div>
      </div>
    </div>
  );
}

// JavaScript Beautifier function (simplified version for demo)
// In a real app, you'd use a library like js-beautify
function js_beautify(js_source_text, options) {
  options = options || {};
  
  // Very simplified formatting logic
  // In a production app, use a proper library
  let indent_size = options.indent_size || 2;
  let indent_char = options.indent_char || ' ';
  
  // Basic indent management
  let indent_level = 0;
  let indent_string = '';
  
  // Create a formatted string
  let output = '';
  let lines = js_source_text.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Handle indentation based on braces
    if (line.includes('}') && !line.includes('{')) {
      indent_level = Math.max(0, indent_level - 1);
    }
    
    indent_string = indent_char.repeat(indent_level * indent_size);
    
    // Add indentation to the current line
    if (line.length > 0) {
      output += indent_string + line + '\n';
    } else {
      output += '\n';
    }
    
    // Adjust indentation level for the next line
    if (line.includes('{') && !line.includes('}')) {
      indent_level++;
    }
  }
  
  return output.trim();
}