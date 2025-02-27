"use client";
// pages/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { useAppContext } from "@/Context/AppContext";

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const [recentPasswords, setRecentPasswords] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const { setTool } = useAppContext();

  // Generate password on component mount and when options change
  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  // Calculate password strength
  useEffect(() => {
    setTool("Secure Password Generator");
    let score = 0;

    // Length factor
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    // Character types factor
    if (includeUppercase) score += 1;
    if (includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;

    // Variety factor (simple estimation)
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const typesUsed = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
      Boolean
    ).length;
    score += typesUsed;

    setStrength(Math.min(Math.floor(score / 2), 4));
  }, [
    password,
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  // Check for dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

      // Load saved passwords from localStorage
      const saved = localStorage.getItem("recentPasswords");
      if (saved) {
        setRecentPasswords(JSON.parse(saved));
      }
    }
  }, []);

  // Save recent passwords to localStorage
  useEffect(() => {
    if (recentPasswords.length > 0) {
      localStorage.setItem("recentPasswords", JSON.stringify(recentPasswords));
    }
  }, [recentPasswords]);

  const generatePassword = () => {
    let charset = "";
    let newPassword = "";

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_-+=<>?";

    if (charset === "") {
      // Default to lowercase if nothing selected
      charset = "abcdefghijklmnopqrstuvwxyz";
      setIncludeLowercase(true);
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Add to recent passwords
      if (!recentPasswords.includes(password)) {
        const updatedPasswords = [password, ...recentPasswords.slice(0, 4)];
        setRecentPasswords(updatedPasswords);
      }
    });
  };

  const getStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
    return labels[strength];
  };

  const getStrengthColor = () => {
    const colors = ["#ff4d4d", "#ffaa00", "#ffdd00", "#00cc44", "#00aaff"];
    return colors[strength];
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-4 py-32 text-gray-300 ${
        // darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        ""
      }`}
    >
      <main className="w-full max-w-md">
        <div
          className={`p-6 rounded-xl shadow-xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🛡️</span>
              <h1 className="text-xl font-bold">Password Generator</h1>
            </div>
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </button> */}
          </div>

          {/* Password Display */}
          <div
            className={`relative p-4 rounded-lg mb-6 flex items-center justify-between ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <div className="font-mono text-lg break-all flex-grow mr-2 bg-white text-gray-800 pl-2">
              {password}
            </div>
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-md transition-colors ${
                darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
              }`}
              aria-label="Copy password"
            >
              {copied ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-gray-200">copy</span>
              )}
            </button>
          </div>

          {/* Strength Indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Password Strength</span>
              <span
                className="text-sm font-semibold"
                style={{ color: getStrengthColor() }}
              >
                {getStrengthLabel()}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(strength + 1) * 20}%`,
                  backgroundColor: getStrengthColor(),
                }}
              ></div>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center mb-8">
            <button
              onClick={generatePassword}
              className="flex-grow flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <span className="mr-2">🔄</span>
              Generate New Password
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`ml-3 p-3 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-gray-500">⚙️</span>
            </button>
          </div>

          {/* Settings */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showSettings ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Password Length: {length}
              </label>
              <div className="flex items-center">
                <span className="text-xs mr-2">8</span>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="flex-grow h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
                />
                <span className="text-xs ml-2">32</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="uppercase" className="ml-2 text-sm">
                  Include Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="lowercase"
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="lowercase" className="ml-2 text-sm">
                  Include Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="numbers"
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="numbers" className="ml-2 text-sm">
                  Include Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="symbols"
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="symbols" className="ml-2 text-sm">
                  Include Symbols (!@#$%^&*)
                </label>
              </div>
            </div>
          </div>

          {/* Recent Passwords */}
          {recentPasswords.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <h3 className="text-sm font-medium">Recent Passwords</h3>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                  {recentPasswords.length}
                </span>
              </div>
              <div
                className={`space-y-2 p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {recentPasswords.map((pwd, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="font-mono text-xs truncate max-w-xs">
                      {pwd}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pwd);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`p-1 rounded-md transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-gray-500">📋</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Premium Incentive */}
        <div
          className={`mt-6 p-4 rounded-lg flex items-center ${
            darkMode ? "bg-indigo-900" : "bg-indigo-50"
          }`}
        >
          <span className="text-indigo-500 mr-3 flex-shrink-0">✨</span>
          <div className="text-sm">
            <p
              className={`font-medium ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              Bookmark this tool for easy access
            </p>
            <p
              className={`${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
            >
              We don't store your passwords or track your usage
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© Nexonware. All rights reserved.</p>
          <p className="mt-1">We value your security and privacy.</p>
        </footer>
      </main>
    </div>
  );
}
