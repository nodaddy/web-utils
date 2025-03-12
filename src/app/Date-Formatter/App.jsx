'use client';

import { useState } from 'react';

export default function DateFormatter() {
  const [date, setDate] = useState('');
  const [format, setFormat] = useState('short');
  const [formattedDate, setFormattedDate] = useState('');
  const [error, setError] = useState('');

  const formatOptions = {
    short: { day: 'numeric', month: 'numeric', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    time: { hour: 'numeric', minute: 'numeric', hour12: true },
    fullDateTime: { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  };

  const formatDate = () => {
    setError('');
    if (!date) {
      setError('Please select a date');
      return;
    }

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }

      const formatted = new Intl.DateTimeFormat('en-US', formatOptions[format]).format(dateObj);
      setFormattedDate(formatted);
    } catch (err) {
      setError('Invalid date format');
      setFormattedDate('');
    }
  };

  const copyToClipboard = () => {
    if (formattedDate) {
      navigator.clipboard.writeText(formattedDate);
      const originalText = document.getElementById('copyBtn').innerText;
      document.getElementById('copyBtn').innerText = 'Copied! ✅';
      setTimeout(() => {
        document.getElementById('copyBtn').innerText = originalText;
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-bold text-center text-indigo-600">
              <span role="img" aria-label="Calendar">📅</span> Date Formatter
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span role="img" aria-label="Date">📆</span> Select Date
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span role="img" aria-label="Format">🔧</span> Select Format
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="short">Short (MM/DD/YYYY)</option>
                <option value="medium">Medium (MMM DD, YYYY)</option>
                <option value="long">Long (Weekday, Month DD, YYYY)</option>
                <option value="time">Time Only (HH:MM AM/PM)</option>
                <option value="fullDateTime">Full Date & Time</option>
              </select>
            </div>

            <button
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={formatDate}
            >
              <span role="img" aria-label="Magic">✨</span> Format Date
            </button>

            {error && (
              <div className="text-red-500 text-sm mt-2 flex items-center">
                <span role="img" aria-label="Error" className="mr-1">⚠️</span> {error}
              </div>
            )}

            {formattedDate && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span role="img" aria-label="Result">🎯</span> Formatted Result
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formattedDate}
                    readOnly
                  />
                  <button
                    id="copyBtn"
                    className="bg-indigo-600 text-white px-3 rounded-r-md hover:bg-indigo-700 focus:outline-none"
                    onClick={copyToClipboard}
                  >
                    <span role="img" aria-label="Copy">📋</span> Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}