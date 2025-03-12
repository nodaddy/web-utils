'use client'

import { useState, useRef } from 'react'

export default function SVGOptimizer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState({ originalSize: 0, optimizedSize: 0 })
  const [activeTab, setActiveTab] = useState('paste')
  const [loading, setLoading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef(null)

  const optimizeSVG = (svg) => {
    if (!svg) return ''
    
    // Store original size
    const originalSize = new Blob([svg]).size
    
    // Basic SVG optimization
    let optimized = svg
      // Remove comments
      .replace(/<!--(.*?)-->/g, '')
      // Remove empty attributes
      .replace(/\s[a-zA-Z0-9-]+="\s*"/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove unnecessary whitespace in attributes
      .replace(/\s{2,}/g, ' ')
      // Remove unnecessary decimals
      .replace(/(\d+)\.0+([^\d])/g, '$1$2')
      // Simplify colors
      .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/i, '#$1$2$3')
      // Trim
      .trim()

    // Calculate optimized size
    const optimizedSize = new Blob([optimized]).size
    
    // Update stats
    setStats({
      originalSize,
      optimizedSize,
      savings: originalSize - optimizedSize,
      percentage: ((1 - optimizedSize / originalSize) * 100).toFixed(2)
    })
    
    return optimized
  }

  const handlePastedInput = (e) => {
    const value = e.target.value
    setInput(value)
    if (value) {
      setOutput(optimizeSVG(value))
    } else {
      setOutput('')
      setStats({ originalSize: 0, optimizedSize: 0 })
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLoading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result
        setInput(content)
        setOutput(optimizeSVG(content))
        setLoading(false)
      }
      reader.readAsText(file)
    }
  }

  const handleUrlInput = async () => {
    if (!urlInput) return
    
    try {
      setLoading(true)
      const response = await fetch(urlInput)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const svgText = await response.text()
      if (!svgText.trim().startsWith('<svg') && !svgText.includes('<svg')) {
        throw new Error('URL did not return valid SVG content')
      }
      
      setInput(svgText)
      setOutput(optimizeSVG(svgText))
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!')
      })
      .catch(err => {
        alert('Failed to copy: ' + err)
      })
  }

  const downloadSVG = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'optimized.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SVG Optimizer ✨</h1>
          <p className="text-gray-600 mt-2">Optimize your SVG files to reduce file size</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setActiveTab('paste')}
              className={`py-2 px-4 ${activeTab === 'paste' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              📋 Paste SVG
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              📤 Upload File
            </button>
            <button 
              onClick={() => setActiveTab('url')}
              className={`py-2 px-4 ${activeTab === 'url' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              🔗 From URL
            </button>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Input</h2>
            
            {activeTab === 'paste' && (
              <textarea
                className="w-full h-48 p-3 border border-gray-300 rounded-md"
                placeholder="Paste your SVG code here..."
                value={input}
                onChange={handlePastedInput}
              ></textarea>
            )}
            
            {activeTab === 'upload' && (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <input 
                  type="file" 
                  accept=".svg" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  ref={fileInputRef}
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  📁 Choose SVG File
                </button>
                {loading && <p className="mt-2 text-gray-600">Loading...</p>}
              </div>
            )}
            
            {activeTab === 'url' && (
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.svg"
                  className="flex-grow p-3 border border-gray-300 rounded-md"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <button 
                  onClick={handleUrlInput}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md whitespace-nowrap"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : '📥 Fetch SVG'}
                </button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          {stats.originalSize > 0 && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-2">Optimization Results 📊</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Original Size</p>
                  <p className="font-bold">{(stats.originalSize / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Optimized Size</p>
                  <p className="font-bold">{(stats.optimizedSize / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Saved</p>
                  <p className="font-bold">{(stats.savings / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-sm text-gray-500">Reduction</p>
                  <p className="font-bold text-green-600">{stats.percentage}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Output Section */}
          {output && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Optimized SVG</h2>
                <div className="space-x-2">
                  <button 
                    onClick={() => copyToClipboard(output)}
                    className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded-md text-sm"
                  >
                    📋 Copy
                  </button>
                  <button 
                    onClick={downloadSVG}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm"
                  >
                    💾 Download
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-48 p-3 border border-gray-300 rounded-md bg-gray-50"
                value={output}
                readOnly
              ></textarea>
            </div>
          )}

          {/* Preview Section */}
          {output && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Preview</h2>
              <div className="border border-gray-300 rounded-md p-4 bg-white flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: output }} className="max-w-full max-h-64"></div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>✨ SVG Optimizer Tool &copy; {new Date().getFullYear()} ✨</p>
        </footer>
      </div>
    </div>
  )
}