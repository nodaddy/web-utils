'use client'

import { useState, useRef } from 'react'

export default function ZipCreator() {
  const [files, setFiles] = useState([])
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLink] = useState('')
  const [zipName, setZipName] = useState('my-archive')
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      setMessage(`Added ${newFiles.length} file(s)`)
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAddLink = () => {
    if (currentLink.trim()) {
      setLinks(prevLinks => [...prevLinks, currentLink.trim()])
      setCurrentLink('')
      setMessage(`Added link: ${currentLink.trim()}`)
    }
  }

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    setMessage('File removed')
  }

  const handleRemoveLink = (index) => {
    setLinks(prevLinks => prevLinks.filter((_, i) => i !== index))
    setMessage('Link removed')
  }

  const createZip = async () => {
    if (files.length === 0 && links.length === 0) {
      setMessage('Please add at least one file or link')
      return
    }

    setIsCreating(true)
    setMessage('Creating zip file...')

    try {
      // Use the JSZip library that we'll load dynamically
      const JSZip = await import('jszip').then(module => module.default)
      const zip = new JSZip()
      
      // Add files to zip
      files.forEach(file => {
        zip.file(file.name, file)
      })
      
      // Add links as text files
      if (links.length > 0) {
        const linksContent = links.join('\n')
        zip.file('links.txt', linksContent)
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' })
      
      // Create download link
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${zipName || 'my-archive'}.zip`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
      
      setMessage('Zip file created successfully! ✅')
    } catch (error) {
      console.error('Error creating zip:', error)
      setMessage(`Error creating zip: ${error.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          📦 Zip File Creator
        </h1>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="zipName" className="block text-sm font-medium text-gray-700 mb-1">
            Zip File Name
          </label>
          <div className="flex">
            <input
              id="zipName"
              type="text"
              value={zipName}
              onChange={(e) => setZipName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter zip file name"
            />
            <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md border border-l-0 border-gray-300">
              .zip
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              📁 Files
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Add Files 📂
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {files.length > 0 ? (
            <ul className="border border-gray-200 rounded-md divide-y">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center py-2 px-3">
                  <span className="text-sm truncate flex-1">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No files added yet</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              🔗 Links
            </label>
          </div>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={currentLink}
              onChange={(e) => setCurrentLink(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a link URL"
            />
            <button
              onClick={handleAddLink}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          {links.length > 0 ? (
            <ul className="border border-gray-200 rounded-md divide-y">
              {links.map((link, index) => (
                <li key={index} className="flex justify-between items-center py-2 px-3">
                  <span className="text-sm truncate flex-1">
                    {link}
                  </span>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Remove link"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No links added yet</p>
          )}
        </div>
        
        <div className="text-center">
          <button
            onClick={createZip}
            disabled={isCreating || (files.length === 0 && links.length === 0)}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isCreating || (files.length === 0 && links.length === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCreating ? 'Creating...' : '📦 Create Zip File'}
          </button>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 text-center">
          Files will be compressed into a downloadable zip archive.
          Links will be saved in a text file inside the archive.
        </p>
      </div>
    </div>
  )
}