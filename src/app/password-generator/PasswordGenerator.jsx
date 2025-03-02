"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const { setTool } = useAppContext();

  // Generate password on initial load and when settings change
  useEffect(() => {
    setTool("Password Generator");
    generatePassword();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (password) {
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;

    // Length check
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // Pattern checks
    if (!/(.)\1{2,}/.test(pwd)) score += 1; // No character repeats 3+ times

    // Return strength label based on score
    if (score >= 6) return "Strong";
    if (score >= 4) return "Medium";
    return "Weak";
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Weak":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const generatePassword = () => {
    setError("");
    setIsCopied(false);

    // Validate that at least one character type is selected
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setError("Please select at least one character type");
      return;
    }

    setIsGenerating(true);

    try {
      setTimeout(() => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

        let allowedChars = "";
        if (includeUppercase) allowedChars += uppercaseChars;
        if (includeLowercase) allowedChars += lowercaseChars;
        if (includeNumbers) allowedChars += numberChars;
        if (includeSymbols) allowedChars += symbolChars;

        // Ensure at least one character from each selected type
        let newPassword = "";

        if (includeUppercase) {
          newPassword += uppercaseChars.charAt(
            Math.floor(Math.random() * uppercaseChars.length)
          );
        }

        if (includeLowercase) {
          newPassword += lowercaseChars.charAt(
            Math.floor(Math.random() * lowercaseChars.length)
          );
        }

        if (includeNumbers) {
          newPassword += numberChars.charAt(
            Math.floor(Math.random() * numberChars.length)
          );
        }

        if (includeSymbols) {
          newPassword += symbolChars.charAt(
            Math.floor(Math.random() * symbolChars.length)
          );
        }

        // Fill the rest of the password
        for (let i = newPassword.length; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * allowedChars.length);
          newPassword += allowedChars[randomIndex];
        }

        // Shuffle the password to randomize the guaranteed characters
        newPassword = newPassword
          .split("")
          .sort(() => Math.random() - 0.5)
          .join("");

        setPassword(newPassword);

        // Add to history (limiting to 5 items)
        setHistory((prev) => [newPassword, ...prev].slice(0, 5));

        setIsGenerating(false);
      }, 500); // Simulate processing time for UI feedback
    } catch (err) {
      setError("Failed to generate password. Please try again.");
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy password. Please try manually.");
    }
  };

  const usePassword = (pwd) => {
    setPassword(pwd);
    setIsCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-start pt-28 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span role="img" aria-label="lock" className="text-2xl">
              🔐
            </span>
            <h1 className="text-2xl font-bold text-center">
              Secure Password Generator
            </h1>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
              <p className="flex items-center">
                <span role="img" aria-label="warning" className="mr-2">
                  ⚠️
                </span>
                {error}
              </p>
            </div>
          )}

          <div className="relative bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full bg-transparent border-none text-white text-lg font-mono focus:outline-none"
                aria-label="Generated password"
              />
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="text-gray-300 hover:text-white  p-2 rounded transition-colors text-xs"
                  aria-label="Copy to clipboard"
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <span
                      role="img"
                      aria-label="copied"
                      className="text-green-400 "
                    >
                      ✅
                    </span>
                  ) : (
                    <span role="img" aria-label="copy">
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="text-sm">Strength:</div>
                <div
                  className={`px-2 py-1 rounded text-xs ${getStrengthColor()}`}
                >
                  {passwordStrength || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="length"
                className="block text-sm font-medium mb-1"
              >
                Password Length: {length}
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs">8</span>
                <input
                  id="length"
                  type="range"
                  min="8"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Password length slider"
                />
                <span className="text-xs">32</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  aria-label="Include uppercase letters"
                />
                <label htmlFor="uppercase" className="ml-2 text-sm">
                  Uppercase (A-Z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="lowercase"
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  aria-label="Include lowercase letters"
                />
                <label htmlFor="lowercase" className="ml-2 text-sm">
                  Lowercase (a-z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="numbers"
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  aria-label="Include numbers"
                />
                <label htmlFor="numbers" className="ml-2 text-sm">
                  Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="symbols"
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  aria-label="Include symbols"
                />
                <label htmlFor="symbols" className="ml-2 text-sm">
                  Symbols (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={generatePassword}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            aria-label="Generate password button"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Password"
            )}
          </button>

          {history.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center text-sm text-gray-300 hover:text-white"
              >
                <span className="mr-1">{showHistory ? "▼" : "▶"}</span>
                Recently Generated ({history.length})
              </button>

              {showHistory && (
                <div className="mt-2 bg-gray-700 rounded-lg p-2">
                  <ul className="space-y-2">
                    {history.map((pwd, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-600"
                      >
                        <span className="font-mono text-sm truncate max-w-xs">
                          {pwd}
                        </span>
                        <button
                          onClick={() => usePassword(pwd)}
                          className="text-xs bg-gray-800 hover:bg-gray-900 px-2 py-1 rounded transition-colors"
                        >
                          Use
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-4">
          <div className="text-sm text-gray-400">
            <h3 className="font-medium mb-2">Password Tips:</h3>
            <ul className="list-disc space-y-1 pl-5 text-xs">
              <li>Use at least 12 characters for better security</li>
              <li>Mix uppercase, lowercase, numbers, and symbols</li>
              <li>Don't use personal information in your password</li>
              <li>Use different passwords for different accounts</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        <p>
          Your passwords are generated locally and never stored on any server
        </p>
      </div>
    </div>
  );
};

export default PasswordGenerator;
