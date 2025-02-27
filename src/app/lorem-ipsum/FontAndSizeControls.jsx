"use client";

import { useEffect, useState } from "react";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "@/Applications";

const FontAndSizeControls = () => {
  const [selectedFont, setSelectedFont] = useState("font-serif");
  const [selectedSize, setSelectedSize] = useState("text-base");

  // Available font options
  const fontOptions = [
    { value: "font-serif", label: "Serif" },
    { value: "font-sans", label: "Sans-Serif" },
    { value: "font-mono", label: "Monospace" },
  ];

  // Available size options
  const sizeOptions = [
    { value: "text-sm", label: "Small" },
    { value: "text-base", label: "Medium" },
    { value: "text-lg", label: "Large" },
    { value: "text-xl", label: "Extra Large" },
  ];

  useEffect(() => {
    const elements = document.getElementsByClassName("sample-text-paragraph");

    // Convert to an array and update classes properly
    Array.from(elements).forEach((el) => {
      // Remove previously applied font classes
      el.classList.forEach((className) => {
        if (className.startsWith("font-") || className.startsWith("text-")) {
          el.classList.remove(className);
        }
      });

      // Add new font and size classes
      el.classList.add(selectedFont);
      el.classList.add(selectedSize);
    });
  }, [selectedFont, selectedSize]);

  return (
    <div className="mb-6 p-4  ">
      <div className="flex flex-wrap gap-4">
        <div align="left" className="space-y-2">
          <label className="block text-sm font-medium">Font Family:</label>
          <span className="flex gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  logGAEvent(
                    `${applicationNamesForGA.textGenerator}_click_font_family_sample`,
                    {
                      fontFamily: font.value,
                    }
                  );
                  setSelectedFont(font.value);
                }}
                className={`px-3 py-1 rounded text-sm ${
                  selectedFont === font.value
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {font.label}
              </button>
            ))}
          </span>
        </div>
        <div align="left" className={`space-y-2`}>
          <label className="block text-sm font-medium">Font Size:</label>
          <div className="flex gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  logGAEvent(
                    `${applicationNamesForGA.textGenerator}_click_font_size_sample`,
                    {
                      fontSize: size.value,
                    }
                  );
                  setSelectedSize(size.value);
                }}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSize === size.value
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FontAndSizeControls;
