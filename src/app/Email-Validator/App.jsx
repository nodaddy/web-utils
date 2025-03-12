'use client';
import { useState } from 'react';

export default function EmailValidator() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [message, setMessage] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setIsValid(false);
      setMessage('Please enter an email address ❌');
      return;
    }

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (emailRegex.test(email)) {
      setIsValid(true);
      setMessage('Valid email address! ✅');
    } else {
      setIsValid(false);
      setMessage('Invalid email format ❌');
    }
  };

  const clearForm = () => {
    setEmail('');
    setIsValid(null);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Email Validator ✉️
          </h1>
          <p className="text-gray-600">
            Check if your email is properly formatted 🔍
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={validateEmail}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Validate ✓
            </button>
            <button
              onClick={clearForm}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Clear 🗑️
            </button>
          </div>
        </div>

        {message && (
          <div 
            className={`mt-4 p-3 rounded-md ${
              isValid 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <p className="text-center font-medium">{message}</p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Email Tips 💡</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Must contain @ symbol</li>
            <li>• Must have domain name (e.g., gmail.com)</li>
            <li>• Cannot contain spaces</li>
            <li>• Valid characters include letters, numbers, dots, underscores</li>
          </ul>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        Made with Next.js and Tailwind CSS 🚀
      </p>
    </div>
  );
}