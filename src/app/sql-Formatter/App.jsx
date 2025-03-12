'use client';

import React, { useState, useEffect } from 'react';

export default function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);

  // Format SQL function
  const formatSQL = (sql) => {
    if (!sql.trim()) return '';
    
    // Simple SQL formatter
    try {
      // Replace multiple spaces with single space
      let formatted = sql.replace(/\s+/g, ' ').trim();
      
      // List of SQL keywords to format
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
        'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
        'ALTER TABLE', 'DROP TABLE', 'AND', 'OR', 'AS', 'CASE', 'WHEN', 'THEN',
        'ELSE', 'END', 'UNION', 'ALL', 'BETWEEN', 'IN', 'IS NULL', 'IS NOT NULL',
        'EXISTS', 'NOT', 'LIKE'
      ];
      
      // Convert keywords to uppercase if option is selected
      let keywordsToUse = keywords;
      if (uppercaseKeywords) {
        keywordsToUse = keywords.map(k => k.toUpperCase());
      } else {
        keywordsToUse = keywords.map(k => k.toLowerCase());
      }
      
      // Create indent string based on user selection
      const indent = ' '.repeat(indentSize);
      
      // Replace keywords with newlines and indentation
      keywordsToUse.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, (match) => {
          // Keep original case if not uppercase option
          const replacement = uppercaseKeywords ? keyword : match;
          
          // For these keywords, we add a newline before
          if (['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
               'INNER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT'].includes(keyword.toUpperCase())) {
            return `\n${replacement}`;
          }
          // For AND and OR, add newline and additional indent
          else if (['AND', 'OR'].includes(keyword.toUpperCase())) {
            return `\n${indent}${replacement}`;
          }
          return replacement;
        });
      });
      
      // Format commas - add newline after comma in SELECT statements
      formatted = formatted.replace(/,\s*/g, ',\n' + indent);
      
      // Add additional formatting for parentheses
      let indentLevel = 0;
      let result = '';
      
      for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i];
        
        if (char === '(') {
          indentLevel++;
          result += char + '\n' + indent.repeat(indentLevel);
        } 
        else if (char === ')') {
          indentLevel = Math.max(0, indentLevel - 1);
          result += '\n' + indent.repeat(indentLevel) + char;
        } 
        else {
          result += char;
        }
      }
      
      // Clean up multiple newlines
      result = result.replace(/\n\s*\n/g, '\n');
      
      return result;
    } catch (err) {
      setError('Error formatting SQL: ' + err.message);
      return sql;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!sqlInput.trim()) {
      setError('Please enter SQL to format');
      return;
    }
    setFormattedSql(formatSQL(sqlInput));
  };

  // Fetch SQL from URL
  const fetchFromUrl = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      setSqlInput(text);
      setFormattedSql(formatSQL(text));
    } catch (err) {
      setError(`Error fetching from URL: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy formatted SQL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSql)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        setError('Failed to copy: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                📝 SQL Formatter
              </h1>
            </div>
            
            <p className="text-center text-gray-500 mb-8">
              Format your SQL queries for better readability
            </p>
            
            {/* Formatting Options */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">⚙️ Formatting Options</h2>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indent Size
                  </label>
                  <select 
                    value={indentSize} 
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="uppercaseKeywords" 
                      checked={uppercaseKeywords}
                      onChange={(e) => setUppercaseKeywords(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="uppercaseKeywords" className="ml-2 block text-sm text-gray-700">
                      Uppercase Keywords
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SQL Input Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="sqlInput" className="block text-sm font-medium text-gray-700 mb-1">
                  SQL Query 📋
                </label>
                <textarea
                  id="sqlInput"
                  rows="6"
                  value={sqlInput}
                  onChange={(e) => setSqlInput(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Format SQL 🪄
              </button>
            </form>
            
            {/* URL Input Form */}
            <form onSubmit={fetchFromUrl} className="mb-6">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-grow">
                  <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700 mb-1">
                    Import SQL from URL 🔗
                  </label>
                  <input
                    id="urlInput"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/query.sql"
                    className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:self-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 md:mt-0 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Fetch SQL 📥'}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ {error}
              </div>
            )}
            
            {/* Formatted SQL Output */}
            {formattedSql && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Formatted SQL ✨</h2>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-green-400 whitespace-pre-wrap break-words font-mono text-sm">
                    {formattedSql}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
              Made with ❤️ for SQL developers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}