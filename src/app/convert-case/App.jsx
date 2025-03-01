"use client";
import { useAppContext } from "@/Context/AppContext";
import React, { useEffect, useState } from "react";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "@/Applications";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("Convert Case");
  }, [setTool]);

  // Update counts when text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    setWordCount(
      newText.trim() === "" ? 0 : newText.trim().split(/\s+/).length
    );
  };

  // Case conversion functions
  const convertCase = (type) => {
    logGAEvent(applicationNamesForGA.convertCase + "_convert", {
      type,
    });
    switch (type) {
      case "lower":
        setText(text.toLowerCase());
        break;
      case "upper":
        setText(text.toUpperCase());
        break;
      case "capitalize":
        setText(
          text
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
        break;
      case "sentence":
        setText(
          text
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase())
        );
        break;
      case "alternating":
        setText(
          [...text]
            .map((char, i) =>
              i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
            )
            .join("")
        );
        break;
      case "title":
        setText(
          text
            .toLowerCase()
            .split(" ")
            .map((word) => {
              // Don't capitalize certain small words unless they're the first or last word
              const smallWords = [
                "a",
                "an",
                "the",
                "in",
                "on",
                "at",
                "for",
                "with",
                "and",
                "but",
                "or",
              ];
              return smallWords.includes(word)
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ")
            // Always capitalize first and last word
            .replace(/^\w/, (match) => match.toUpperCase())
            .replace(/\s\w+$/, (match) => match.toUpperCase())
        );
        break;
      case "inverse":
        setText(
          [...text]
            .map((char) =>
              char === char.toUpperCase()
                ? char.toLowerCase()
                : char.toUpperCase()
            )
            .join("")
        );
        break;
      case "camel":
        setText(
          text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
            .replace(/^[A-Z]/, (match) => match.toLowerCase())
        );
        break;
      case "pascal":
        setText(
          text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
            .replace(/^[a-z]/, (match) => match.toUpperCase())
        );
        break;
      case "snake":
        setText(
          text
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "")
        );
        break;
      case "kebab":
        setText(
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-]/g, "")
        );
        break;
      default:
        break;
    }
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear text
  const clearText = () => {
    setText("");
    setCharCount(0);
    setWordCount(0);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-200 px-6 py-8 mt-5 rounded-xl mx-auto">
      {/* Input area */}
      <div className="w-full mb-2">
        <textarea
          className="w-full h-32 p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter or paste your text here..."
          value={text}
          onChange={handleTextChange}
        />

        {/* Character and word count */}
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => convertCase("sentence")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Sentence case
        </button>
        <button
          onClick={() => convertCase("lower")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          lowercase
        </button>
        <button
          onClick={() => convertCase("upper")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => convertCase("capitalize")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Capitalize Each Word
        </button>

        <button
          onClick={() => convertCase("title")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Title Case
        </button>
        <button
          onClick={() => convertCase("alternating")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          AlTeRnAtInG cAsE
        </button>
        <button
          onClick={() => convertCase("inverse")}
          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Inverse Case
        </button>
      </div>

      {/* Developer formats */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">
          Developer Formats
        </h2>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => convertCase("camel")}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            camelCase
          </button>
          <button
            onClick={() => convertCase("pascal")}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            PascalCase
          </button>
          <button
            onClick={() => convertCase("snake")}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            snake_case
          </button>
          <button
            onClick={() => convertCase("kebab")}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            kebab-case
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
        </button>
        <button
          onClick={clearText}
          className="flex items-center px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          🔄 Clear Text
        </button>
      </div>
    </div>
  );
};

export default CaseConverter;
