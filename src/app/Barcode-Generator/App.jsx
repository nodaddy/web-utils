'use client'

import { useState, useRef } from 'react'

export default function BarcodeGenerator() {
  const [barcodeText, setBarcodeText] = useState('')
  const [barcodeType, setBarcodeType] = useState('code128')
  const [generatedBarcode, setGeneratedBarcode] = useState(null)
  const canvasRef = useRef(null)

  const generateBarcode = () => {
    if (!barcodeText) {
      alert('Please enter text for the barcode ⚠️')
      return
    }

    // Simple barcode generation for demonstration (Code 128 style)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear previous barcode
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Generate a simple visual representation
    const barWidth = 2
    let x = 20 // Starting position
    
    // Draw start guard
    ctx.fillStyle = 'black'
    
    // Draw barcode pattern based on text (simplified visualization)
    for (let i = 0; i < barcodeText.length; i++) {
      const charCode = barcodeText.charCodeAt(i)
      
      // Create alternating black/white bars with varying widths based on character code
      for (let j = 0; j < 6; j++) {
        const isBlack = (j % 2 === 0) ^ ((charCode >> (j % 3)) & 1)
        const width = barWidth * (1 + (charCode % 3))
        
        if (isBlack) {
          ctx.fillRect(x, 20, width, 80)
        }
        
        x += width + 1
      }
    }
    
    // Draw end guard
    ctx.fillRect(x, 20, barWidth * 3, 80)
    
    // Add text below barcode
    ctx.fillStyle = 'black'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(barcodeText, canvas.width / 2, 120)
    
    setGeneratedBarcode(canvas.toDataURL('image/png'))
  }

  const downloadBarcode = () => {
    if (!generatedBarcode) return
    
    const link = document.createElement('a')
    link.href = generatedBarcode
    link.download = `barcode-${barcodeText}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Barcode Generator 📊</h1>
          <p className="mt-2 text-gray-600">Generate and download barcode images</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="barcodeText" className="block text-sm font-medium text-gray-700">
              Enter Text/Number for Barcode 🔤
            </label>
            <input
              type="text"
              id="barcodeText"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter text for barcode"
            />
          </div>

          <div>
            <label htmlFor="barcodeType" className="block text-sm font-medium text-gray-700">
              Barcode Type 🏷️
            </label>
            <select
              id="barcodeType"
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="code128">Code 128</option>
              <option value="ean13">EAN-13</option>
              <option value="upc">UPC</option>
              <option value="qr">QR Code</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateBarcode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Barcode ✨
            </button>
          </div>

          <div className="mt-6">
            <div className="border border-gray-300 rounded-md p-4 flex justify-center">
              <canvas 
                ref={canvasRef} 
                width="320" 
                height="150" 
                className="bg-white"
              ></canvas>
            </div>
          </div>

          {generatedBarcode && (
            <div className="flex justify-center mt-4">
              <button
                onClick={downloadBarcode}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Barcode 💾
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Created with ❤️ | Use for any purpose
          </p>
        </div>
      </div>
    </div>
  )
}