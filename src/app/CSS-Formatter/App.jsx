'use client'

import { useState } from 'react'

export default function CSSFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [showNotification, setShowNotification] = useState(false)

  const formatCSS = () => {
    if (!input.trim()) {
      return
    }

    try {
      // Remove comments
      let css = input.replace(/\/\*[\s\S]*?\*\//g, '')
      
      // Remove existing whitespace
      css = css.replace(/\s+/g, ' ')
      
      // Add newline after each closing brace and semicolon
      css = css.replace(/;/g, ';\n')
      css = css.replace(/}/g, '}\n')
      
      // Add newline after each opening brace
      css = css.replace(/{/g, '{\n')
      
      // Split into lines
      let lines = css.split('\n')
      
      // Process each line to add indentation
      let formattedLines = []
      let indentLevel = 0
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        
        if (!line) continue
        
        // Decrease indent for closing brace
        if (line === '}') {
          indentLevel--
        }
        
        // Add current line with proper indentation
        if (line) {
          formattedLines.push(' '.repeat(indentLevel * indentSize) + line)
        }
        
        // Increase indent for opening brace
        if (line.includes('{')) {
          indentLevel++
        }
      }
      
      // Join lines and set output
      setOutput(formattedLines.join('\n'))
    } catch (error) {
      setOutput('Error formatting CSS. Please check your input.')
    }
  }

  const copyToClipboard = () => {
    if (!output) return
    
    navigator.clipboard.writeText(output)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            ✨ CSS Formatter ✨
          </h1>
          <p className="text-gray-600 mt-2">
            Beautify your CSS code with proper indentation and spacing 🎨
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="input" className="text-gray-700 font-medium">
                📝 Input CSS
              </label>
              <div className="flex items-center">
                <label htmlFor="indentSize" className="text-sm text-gray-600 mr-2">
                  Indent Size:
                </label>
                <select
                  id="indentSize"
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>
            </div>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your unformatted CSS here..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={formatCSS}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Format CSS 🔍
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Clear All 🧹
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="output" className="text-gray-700 font-medium">
                🖼️ Formatted CSS
              </label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span>Copy to clipboard</span> 📋
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                id="output"
                value={output}
                readOnly
                className="w-full h-64 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                placeholder="Formatted CSS will appear here..."
              />
              {showNotification && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
                  Copied! ✅
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Made with 💖 for web developers</p>
        </footer>
      </div>
    </div>
  )
}