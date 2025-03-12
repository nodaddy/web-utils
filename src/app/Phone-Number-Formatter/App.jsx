'use client';

import { useState } from 'react';

export default function PhoneFormatter() {
  const [inputValue, setInputValue] = useState('');
  const [formattedNumber, setFormattedNumber] = useState('');
  const [formatType, setFormatType] = useState('us');
  const [copied, setCopied] = useState(false);

  const formatPhoneNumber = (value, type) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    let formatted = '';
    
    switch (type) {
      case 'us': // (XXX) XXX-XXXX
        if (cleaned.length > 0) {
          formatted = cleaned.length > 3 ? `(${cleaned.slice(0, 3)})` : `(${cleaned.slice(0, 3)}`;
          
          if (cleaned.length > 3) {
            formatted += ` ${cleaned.slice(3, 6)}`;
          }
          
          if (cleaned.length > 6) {
            formatted += `-${cleaned.slice(6, 10)}`;
          }
        }
        break;
        
      case 'intl': // +X XXX XXX XXXX
        if (cleaned.length > 0) {
          formatted = `+${cleaned.slice(0, 1)}`;
          
          if (cleaned.length > 1) {
            formatted += ` ${cleaned.slice(1, 4)}`;
          }
          
          if (cleaned.length > 4) {
            formatted += ` ${cleaned.slice(4, 7)}`;
          }
          
          if (cleaned.length > 7) {
            formatted += ` ${cleaned.slice(7, 11)}`;
          }
        }
        break;
        
      case 'simple': // XXX-XXX-XXXX
        if (cleaned.length > 0) {
          formatted = cleaned.slice(0, 3);
          
          if (cleaned.length > 3) {
            formatted += `-${cleaned.slice(3, 6)}`;
          }
          
          if (cleaned.length > 6) {
            formatted += `-${cleaned.slice(6, 10)}`;
          }
        }
        break;
        
      default:
        formatted = cleaned;
    }
    
    return formatted;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFormattedNumber(formatPhoneNumber(value, formatType));
  };

  const handleFormatChange = (e) => {
    const type = e.target.value;
    setFormatType(type);
    setFormattedNumber(formatPhoneNumber(inputValue, type));
  };

  const copyToClipboard = () => {
    if (formattedNumber) {
      navigator.clipboard.writeText(formattedNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearInput = () => {
    setInputValue('');
    setFormattedNumber('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">📱 Phone Number Formatter</h1>
          </div>
          
          <div className="mb-6">
            <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="phone-input"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter phone number"
                value={inputValue}
                onChange={handleInputChange}
              />
              {inputValue && (
                <button
                  onClick={clearInput}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ❌
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-1">
              Format Type
            </label>
            <select
              id="format-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formatType}
              onChange={handleFormatChange}
            >
              <option value="us">US Format (XXX) XXX-XXXX</option>
              <option value="intl">International +X XXX XXX XXXX</option>
              <option value="simple">Simple XXX-XXX-XXXX</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formatted Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-4 py-3 sm:text-sm border-gray-300 bg-gray-50"
                  value={formattedNumber}
                  readOnly
                  placeholder="Formatted number will appear here"
                />
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">ℹ️ How It Works</h3>
            <p className="text-xs text-indigo-700">
              Enter any phone number and select your preferred format. The app will automatically format it according to your selection. You can then copy the formatted number to your clipboard with one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}