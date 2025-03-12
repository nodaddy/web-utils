'use client';

import { useState } from 'react';

export default function XMLFormatter() {
  const [inputXML, setInputXML] = useState('');
  const [formattedXML, setFormattedXML] = useState('');
  const [error, setError] = useState('');

  // Function to format XML
  const formatXML = (xml) => {
    try {
      // Reset any previous errors
      setError('');
      
      // Parse the XML document
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML');
      }
      
      // Format the XML with indentation
      const serializer = new XMLSerializer();
      let formatted = '';
      let indent = 0;
      const tab = '  '; // 2 spaces for indentation
      
      // Recursive function to process nodes
      function processNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Element node
          const hasChildren = node.childNodes.length > 0;
          const hasTextOnly = hasChildren && 
                             node.childNodes.length === 1 && 
                             node.childNodes[0].nodeType === Node.TEXT_NODE;
          
          // Open tag
          formatted += '\n' + tab.repeat(indent) + '<' + node.nodeName;
          
          // Add attributes
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            formatted += ' ' + attr.name + '="' + attr.value + '"';
          }
          
          if (!hasChildren) {
            // Self-closing tag
            formatted += '/>';
          } else if (hasTextOnly) {
            // Tag with text only
            formatted += '>' + node.childNodes[0].nodeValue + '</' + node.nodeName + '>';
          } else {
            // Tag with children
            formatted += '>';
            indent++;
            
            // Process child nodes
            for (let i = 0; i < node.childNodes.length; i++) {
              processNode(node.childNodes[i]);
            }
            
            indent--;
            formatted += '\n' + tab.repeat(indent) + '</' + node.nodeName + '>';
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Text node (ignore whitespace-only nodes when formatting)
          const text = node.nodeValue.trim();
          if (text) {
            formatted += '\n' + tab.repeat(indent) + text;
          }
        } else if (node.nodeType === Node.COMMENT_NODE) {
          // Comment node
          formatted += '\n' + tab.repeat(indent) + '<!--' + node.nodeValue + '-->';
        } else if (node.nodeType === Node.DOCUMENT_NODE) {
          // Document node
          formatted += '<?xml version="1.0" encoding="UTF-8"?>';
          
          // Process child nodes
          for (let i = 0; i < node.childNodes.length; i++) {
            processNode(node.childNodes[i]);
          }
        }
      }
      
      // Start processing from the document
      processNode(xmlDoc);
      
      return formatted.trim();
    } catch (err) {
      throw new Error('Error formatting XML: ' + err.message);
    }
  };

  // Handle the format button click
  const handleFormat = () => {
    try {
      if (!inputXML.trim()) {
        setError('Please enter XML to format');
        return;
      }
      
      const formatted = formatXML(inputXML);
      setFormattedXML(formatted);
    } catch (err) {
      setError(err.message);
      setFormattedXML('');
    }
  };

  // Handle the copy button click
  const handleCopy = () => {
    if (formattedXML) {
      navigator.clipboard.writeText(formattedXML)
        .then(() => {
          alert('Formatted XML copied to clipboard! 📋');
        })
        .catch(err => {
          setError('Failed to copy: ' + err.message);
        });
    }
  };

  // Handle the clear button click
  const handleClear = () => {
    setInputXML('');
    setFormattedXML('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            XML Formatter 🧩
          </h1>
          <p className="text-gray-600 mt-2">
            Beautify and format your XML documents with ease
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-4">
              <label 
                htmlFor="input-xml" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Input XML 📝
              </label>
              <textarea
                id="input-xml"
                className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Paste your XML here..."
                value={inputXML}
                onChange={(e) => setInputXML(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleFormat}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <span className="mr-1">✨</span> Format XML
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <span className="mr-1">🧹</span> Clear
              </button>
              {formattedXML && (
                <button
                  onClick={handleCopy}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
                >
                  <span className="mr-1">📋</span> Copy Formatted XML
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                <span className="mr-1">❌</span> {error}
              </div>
            )}

            {formattedXML && (
              <div className="mb-4">
                <label 
                  htmlFor="output-xml" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Formatted XML 🎉
                </label>
                <pre
                  id="output-xml"
                  className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-auto font-mono text-sm"
                >{formattedXML}</pre>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Made with ❤️ by XML Formatter</p>
          <p className="mt-1">Format your XML documents online with ease</p>
        </footer>
      </div>
    </div>
  );
}