"use client";
import { useState } from "react";

export default function JsonFormatterPage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="mx-auto pt-8 text-center text-gray-500">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold mb-4">
        Free JSON Formatter & Viewer Online
      </h1>

      {/* Know More Button */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="px-4 text-black font-medium rounded-md transition-all"
      >
        {showMore ? "Hide Details ▲" : "Know More ▼"}
      </button>

      {/* Hidden Know More Section */}
      <div
        className={`flex flex-wrap gap-2 justify-center items-center mt-4 transition-all duration-300 ${
          showMore
            ? "opacity-100 max-h-screen"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <h2 className="text-xl font-semibold mt-2">
          Format & Beautify JSON Instantly
        </h2>
        {"|"}
        <h2 className="text-xl font-semibold mt-2">
          Validate JSON Online for Free
        </h2>
        {"|"}

        <h2 className="text-xl font-semibold mt-2">
          Convert JSON String to JSON File
        </h2>
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          showMore ? "pb-8" : ""
        } justify-center items-center mt-4 transition-all duration-300 ${
          showMore
            ? "opacity-100 max-h-screen"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <h3 className="text-lg font-medium mt-2">To Parse JSON Online!</h3>
        {"|"}

        <h3 className="text-lg font-medium mt-2">
          Check if Your JSON is Valid Instantly
        </h3>
        {"|"}

        <h3 className="text-lg font-medium mt-2">
          Best JSON File Viewer & Converter
        </h3>
      </div>
    </div>
  );
}
