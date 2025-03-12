'use client'

import { useState, useRef } from 'react'

export default function XMLToCSVConverter() {
  const [xmlInput, setXmlInput] = useState('')
  const [xmlUrl, setXmlUrl] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const convertXmlToCsv = (xmlString) => {
    try {
      setLoading(true)
      setError('')
      
      // Parse XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror')
      if (parseError) {
        throw new Error('Invalid XML format')
      }
      
      // Get all elements at the first level under root
      const rootElement = xmlDoc.documentElement
      const itemElements = Array.from(rootElement.children)
      
      if (itemElements.length === 0) {
        throw new Error('No elements found in XML')
      }
      
      // Get all unique property names across all items
      const allProperties = new Set()
      itemElements.forEach(item => {
        Array.from(item.children).forEach(prop => {
          allProperties.add(prop.tagName)
        })
      })
      
      const headers = Array.from(allProperties)
      
      // Create CSV header row
      let csv = headers.join(',') + '\n'
      
      // Create CSV data rows
      itemElements.forEach(item => {
        const row = headers.map(header => {
          const element = item.querySelector(header)
          if (element) {
            // Escape quotes and handle commas in cell values
            return `"${element.textContent.replace(/"/g, '""')}"`
          }
          return '""' // Empty value if property doesn't exist for this item
        })
        csv += row.join(',') + '\n'
      })
      
      setCsvOutput(csv)
      setLoading(false)
      return csv
    } catch (err) {
      setError(err.message || 'Error converting XML to CSV')
      setCsvOutput('')
      setLoading(false)
      return null
    }
  }

  const handleInputChange = (e) => {
    setXmlInput(e.target.value)
    setError('')
    setCsvOutput('')
  }

  const handleUrlChange = (e) => {
    setXmlUrl(e.target.value)
    setError('')
    setCsvOutput('')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setXmlInput(event.target.result)
    }
    reader.onerror = () => {
      setError('Error reading file')
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    if (xmlInput.trim()) {
      convertXmlToCsv(xmlInput)
    } else if (xmlUrl.trim()) {
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch(xmlUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch XML: ${response.status} ${response.statusText}`)
        }
        
        const xmlString = await response.text()
        setXmlInput(xmlString)
        convertXmlToCsv(xmlString)
      } catch (err) {
        setError(err.message || 'Error fetching XML from URL')
        setCsvOutput('')
        setLoading(false)
      }
    } else {
      setError('Please provide XML input or URL')
    }
  }

  const downloadCsv = () => {
    if (!csvOutput) return
    
    const blob = new Blob([csvOutput], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setXmlInput('')
    setXmlUrl('')
    setCsvOutput('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          XML to CSV Converter 📊
        </h1>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center mb-2">
            <h2 className="text-lg font-semibold mb-2 sm:mb-0 sm:mr-4">Input XML</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <span className="mr-1">📁</span> Upload File
              </button>
              <input 
                type="file" 
                accept=".xml" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button 
                onClick={clearAll}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <span className="mr-1">🗑️</span> Clear All
              </button>
            </div>
          </div>
          
          <textarea 
            className="w-full h-48 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste your XML here..."
            value={xmlInput}
            onChange={handleInputChange}
          />
          
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Or enter XML URL:</p>
            <div className="flex">
              <input 
                type="url"
                className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/data.xml"
                value={xmlUrl}
                onChange={handleUrlChange}
              />
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r flex items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 
                  <span>⏳ Processing...</span> : 
                  <span>🔄 Convert</span>
                }
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </p>
          </div>
        )}
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">CSV Output</h2>
            {csvOutput && (
              <button 
                onClick={downloadCsv}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <span className="mr-1">⬇️</span> Download CSV
              </button>
            )}
          </div>
          <textarea 
            className="w-full h-48 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
            placeholder="CSV will appear here after conversion..."
            value={csvOutput}
            readOnly
          />
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            This converter works with local files or URLs. For complex XML structures, 
            it will extract the first level of elements under the root node.
          </p>
        </div>
      </div>
    </div>
  )
}