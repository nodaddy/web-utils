"use client";

import { useState } from "react";
import Head from "next/head";

export default function UppercaseToLowercase() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConversion = () => {
    setOutputText(inputText.toLowerCase());
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-6">
      <Head>
        <title>Uppercase to Lowercase Converter</title>
        <meta
          name="description"
          content="Convert uppercase text to lowercase easily"
        />
      </Head>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">
              Uppercase to Lowercase Converter
            </h1>
            <p className="text-blue-100">
              Convert your uppercase text to lowercase instantly
            </p>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label
                htmlFor="inputText"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter text to convert:
              </label>
              <textarea
                id="inputText"
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your UPPERCASE text here..."
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={handleConversion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Convert to lowercase
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>

            {outputText && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="outputText"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Result:
                  </label>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </button>
                </div>
                <textarea
                  id="outputText"
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50"
                  value={outputText}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <p className="text-gray-700 mb-3">
            This simple tool converts uppercase text to lowercase. It's useful
            for:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
            <li>Fixing text that was accidentally typed with CAPS LOCK on</li>
            <li>Converting title or heading text to sentence case</li>
            <li>Preparing text for systems that are case-sensitive</li>
            <li>Standardizing text formatting in documents</li>
          </ul>
          <p className="text-gray-700">
            All conversion happens directly in your browser - no data is sent to
            any server, ensuring your text remains private.
          </p>
        </div>
      </main>
    </div>
  );
}
