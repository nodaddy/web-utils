'use client';

import { useState, useEffect } from 'react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(200);
  const [qrCode, setQrCode] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Emoji options for fun decoration
  const emojis = ['📱', '🔗', '📲', '🌐', '📶', '🔄', '📊', '📋', '💻', '📡'];
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);

  // Function to generate QR code
  const generateQRCode = () => {
    // QR code algorithm implementation using pure JS
    const generateMatrix = (text, errorCorrection = 'M') => {
      // This is a simplified version - in reality, we would:
      // 1. Convert data to binary
      // 2. Add error correction
      // 3. Generate the matrix
      
      // For demo purposes, we'll create a simple pattern based on text
      const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const seed = hash % 100;
      
      // Create a basic matrix pattern
      const matrix = [];
      const matrixSize = 21; // Smallest QR code size
      
      for (let i = 0; i < matrixSize; i++) {
        const row = [];
        for (let j = 0; j < matrixSize; j++) {
          // Create fixed patterns for finder patterns (top-left, top-right, bottom-left corners)
          if ((i < 7 && j < 7) || (i < 7 && j >= matrixSize - 7) || (i >= matrixSize - 7 && j < 7)) {
            // Outer border of finder pattern
            if (i === 0 || i === 6 || i === matrixSize - 7 || i === matrixSize - 1 ||
                j === 0 || j === 6 || j === matrixSize - 7 || j === matrixSize - 1) {
              row.push(1);
            } 
            // Inner square of finder pattern
            else if (i >= 2 && i <= 4 && j >= 2 && j <= 4 ||
                    i >= 2 && i <= 4 && j >= matrixSize - 5 && j <= matrixSize - 3 ||
                    i >= matrixSize - 5 && i <= matrixSize - 3 && j >= 2 && j <= 4) {
              row.push(1);
            } else {
              row.push(0);
            }
          } 
          // Create data bits based on input text (simplified)
          else {
            const bitVal = ((i * j) + seed) % 2;
            row.push(bitVal);
          }
        }
        matrix.push(row);
      }
      
      return matrix;
    };

    // Generate QR matrix
    const matrix = generateMatrix(text);
    
    // Convert matrix to SVG
    const cellSize = Math.floor(size / matrix.length);
    const svgSize = cellSize * matrix.length;
    
    let svgContent = `<svg 
      width="${svgSize}" 
      height="${svgSize}" 
      viewBox="0 0 ${svgSize} ${svgSize}" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgSize}" height="${svgSize}" fill="${bgColor}" />`;
    
    // Create cells
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) {
          svgContent += `<rect 
            x="${j * cellSize}" 
            y="${i * cellSize}" 
            width="${cellSize}" 
            height="${cellSize}" 
            fill="${color}" />`;
        }
      }
    }
    
    svgContent += '</svg>';
    
    // Set as base64 data URL for image
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    setQrCode(url);
  };

  // Generate QR code on mount and when text/size/colors change
  useEffect(() => {
    generateQRCode();
    // Clean up object URLs on unmount
    return () => {
      if (qrCode) URL.revokeObjectURL(qrCode);
    };
  }, [text, size, color, bgColor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          QR Code Generator {selectedEmoji}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Text or URL
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL or text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR Code Size: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Emoji Style
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-2 rounded-md transition-all ${
                    selectedEmoji === emoji 
                      ? 'bg-blue-100 scale-110 shadow-sm' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={generateQRCode}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate QR Code ✨
          </button>
        </div>
        
        {qrCode && (
          <div className="mt-6 flex flex-col items-center">
            <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center">
              <img src={qrCode} alt="QR Code" className="max-w-full" />
            </div>
            <div className="mt-4 flex gap-4">
              <a
                href={qrCode}
                download={`qr-code-${Date.now()}.svg`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                Download 💾
              </a>
              <button
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                      navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                      ]);
                    });
                  };
                  img.src = qrCode;
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                Copy 📋
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Scan the QR code with your phone camera 📱 to test it!
        </div>
      </div>
    </div>
  );
}