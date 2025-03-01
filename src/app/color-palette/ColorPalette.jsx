"use client";
import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { useAppContext } from "@/Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "@/Applications";

export default function Colorpalette() {
  const [currentColor, setCurrentColor] = useState("#B2FFFF");
  const { setTool } = useAppContext();
  const [palette, setPalette] = useState([]);
  const [activeTab, setActiveTab] = useState("solid");
  const [gradientType, setGradientType] = useState("linear");
  const [gradientDirection, setGradientDirection] = useState("to right");
  const [gradientColors, setGradientColors] = useState(["#5E72E4", "#11CDEF"]);
  const [colorHistory, setColorHistory] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showExportModal, setShowExportModal] = useState(false);
  const [activePaletteTab, setActivePaletteTab] = useState("custom");

  // Pre-defined palettes
  const predefinedPalettes = {
    default: [],
    pastel: [
      "#FADADD", // Pastel Pink
      "#A7C7E7", // Pastel Blue
      "#C8A2C8", // Pastel Lavender
      "#C1E1C1", // Pastel Mint
      "#FAEBD7", // Pastel Yellow
      "#FFDBAC", // Pastel Peach
      "#D8BFD8", // Pastel Purple
      "#B2FFFF", // Pastel Cyan
      "#FDFD96", // Pastel Light Yellow
      "#FFB3BA", // Pastel Red
    ],
    purple: [
      "#E6E6FA", // Lavender
      "#D8BFD8", // Thistle
      "#DDA0DD", // Plum
      "#DA70D6", // Orchid
      "#BA55D3", // Medium Orchid
      "#9370DB", // Medium Purple
      "#8A2BE2", // Blue Violet
      "#9932CC", // Dark Orchid
      "#8B008B", // Dark Magenta
      "#4B0082", // Indigo
    ],
    orange: [
      "#FFE4B5", // Moccasin
      "#FFDAB9", // Peach Puff
      "#FAEBD7", // Antique White
      "#FFD700", // Gold
      "#FFA500", // Orange
      "#FF8C00", // Dark Orange
      "#FF7F50", // Coral
      "#FF6347", // Tomato
      "#FF4500", // Orange Red
      "#E9967A", // Dark Salmon
    ],
  };

  useEffect(() => {
    if (activePaletteTab) {
      logGAEvent(applicationNamesForGA.colorPalette + "_change_palette_tab", {
        activePaletteTab,
      });
    }
  }, [activePaletteTab]);

  // Load predefined palette when tab changes
  useEffect(() => {
    if (activePaletteTab !== "custom") {
      setPalette(
        predefinedPalettes[activePaletteTab] || predefinedPalettes.default
      );
    }
  }, [activePaletteTab]);

  useEffect(() => {
    setTool("Color Palette");
  }, []);

  const addToPalette = (color) => {
    // Switch to custom tab when adding colors
    setActivePaletteTab("custom");

    if (palette.includes(color)) return;
    if (palette.length >= 10) {
      setPalette([color, ...palette.slice(0, 9)]);
    } else {
      setPalette([color, ...palette]);
    }
    if (!colorHistory.includes(color)) {
      setColorHistory((prev) => [color, ...prev].slice(0, 20));
    }
  };

  const removePaletteColor = (colorToRemove) => {
    // Switch to custom tab when removing colors
    setActivePaletteTab("custom");
    setPalette(palette.filter((color) => color !== colorToRemove));
  };

  const copyToClipboard = (text, e) => {
    navigator.clipboard.writeText(text);
    setTooltipContent("Copied!");
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const getGradientString = () => {
    if (gradientType === "linear") {
      return `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`;
    } else {
      return `radial-gradient(circle, ${gradientColors[0]}, ${gradientColors[1]})`;
    }
  };

  const exportAsJSON = () => {
    const data = {
      palette,
      gradients: [
        {
          type: gradientType,
          direction: gradientDirection,
          colors: gradientColors,
        },
      ],
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "Nexonware-palette.json");
    setShowExportModal(false);
    setTooltipContent("JSON Exported!");
    setTooltipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const colorBoxSize = 30;
    const colorBoxSpacing = 10;

    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text("Color Palette", margin, margin);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Created: ${new Date().toLocaleDateString()}`,
      margin,
      margin + 10
    );

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);

    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Solid Colors", margin, margin + 30);

    let yPosition = margin + 40;
    let xPosition = margin;

    palette.forEach((color, index) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      doc.setFillColor(r, g, b);
      doc.rect(xPosition, yPosition, colorBoxSize, colorBoxSize, "F");

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(color, xPosition, yPosition + colorBoxSize + 10);

      xPosition += colorBoxSize + colorBoxSpacing + 20;
      if (xPosition > pageWidth - margin - colorBoxSize) {
        xPosition = margin;
        yPosition += colorBoxSize + 20;
      }
    });

    yPosition += colorBoxSize + 40;
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Gradient", margin, yPosition);

    yPosition += 15;
    doc.setFontSize(12);
    doc.text(`Type: ${gradientType}`, margin, yPosition);
    if (gradientType === "linear") {
      yPosition += 10;
      doc.text(`Direction: ${gradientDirection}`, margin, yPosition);
    }

    yPosition += 20;
    doc.text("Colors:", margin, yPosition);
    yPosition += 10;

    const r1 = parseInt(gradientColors[0].slice(1, 3), 16);
    const g1 = parseInt(gradientColors[0].slice(3, 5), 16);
    const b1 = parseInt(gradientColors[0].slice(5, 7), 16);
    doc.setFillColor(r1, g1, b1);
    doc.rect(margin, yPosition, colorBoxSize, colorBoxSize, "F");
    doc.text(gradientColors[0], margin, yPosition + colorBoxSize + 10);

    const r2 = parseInt(gradientColors[1].slice(1, 3), 16);
    const g2 = parseInt(gradientColors[1].slice(3, 5), 16);
    const b2 = parseInt(gradientColors[1].slice(5, 7), 16);
    doc.setFillColor(r2, g2, b2);
    doc.rect(
      margin + colorBoxSize + 40,
      yPosition,
      colorBoxSize,
      colorBoxSize,
      "F"
    );
    doc.text(
      gradientColors[1],
      margin + colorBoxSize + 40,
      yPosition + colorBoxSize + 10
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.save("Nexonware-palette.pdf");

    setShowExportModal(false);
    setTooltipContent("PDF Exported!");
    setTooltipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const generateComplementaryColors = () => {
    // Switch to custom tab when generating colors
    setActivePaletteTab("custom");

    const hex = currentColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const rComp = 255 - r;
    const gComp = 255 - g;
    const bComp = 255 - b;

    const complementary = `#${((1 << 24) + (rComp << 16) + (gComp << 8) + bComp)
      .toString(16)
      .slice(1)}`;

    const hsl = rgbToHsl(r, g, b);
    const h = hsl[0];
    const s = hsl[1];
    const l = hsl[2];

    const analogous1 = hslToHex((h + 30) % 360, s, l);
    const analogous2 = hslToHex((h + 330) % 360, s, l);

    setPalette([
      currentColor,
      complementary,
      analogous1,
      analogous2,
      ...palette.slice(0, 1),
    ]);
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s, l];
  };

  const hslToHex = (h, s, l) => {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div
      style={{
        widht: "auto",
      }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Panel - Color Picker */}
            <div className="md:w-1/3 p-6 border-r border-gray-200">
              <div className="mb-6">
                <h2 className="text-xs font-medium text-gray-900 mb-1">
                  Color Picker
                </h2>
                <div className="flex justify-center mb-6">
                  <ChromePicker
                    width={"100%"}
                    color={currentColor}
                    onChange={(color) => setCurrentColor(color.hex)}
                    disableAlpha={true}
                  />
                </div>
                {activePaletteTab == "custom" && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        logGAEvent(
                          applicationNamesForGA.colorPalette +
                            "_click_add_to_palette"
                        );
                        addToPalette(currentColor);
                      }}
                      className="
                    w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    >
                      Add to Palette
                    </button>
                    <button
                      onClick={() => {
                        logGAEvent(
                          applicationNamesForGA.colorPalette +
                            "_click_generate_harmony"
                        );
                        generateComplementaryColors();
                      }}
                      className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500"
                    >
                      ✨ Generate Harmony
                    </button>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {colorHistory?.length ? "Pick History" : ""}
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {colorHistory.map((color, index) => (
                    <div
                      key={`history-${index}`}
                      className="w-full aspect-square rounded-md cursor-pointer hover:scale-105 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Palette & Gradients */}
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "solid"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("solid")}
                  >
                    Solid Colors
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "gradient"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("gradient")}
                  >
                    Gradients
                  </button>
                </div>
              </div>

              {activeTab === "solid" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                      Your Palette
                    </h2>
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="inline-flex rounded-md items-center px-4 py-1.5 border border-transparent text-sm font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Export Palette &nbsp;↗
                    </button>
                  </div>

                  {/* Palette Type Selector */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`px-3 py-2 text-xs font-medium ${
                        activePaletteTab === "custom"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActivePaletteTab("custom")}
                    >
                      Your Selection
                    </button>
                    <button
                      className={`px-3 py-2 text-xs font-medium ${
                        activePaletteTab === "pastel"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActivePaletteTab("pastel")}
                    >
                      Pastel
                    </button>
                    <button
                      className={`px-3 py-2 text-xs font-medium ${
                        activePaletteTab === "purple"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActivePaletteTab("purple")}
                    >
                      Purple
                    </button>
                    <button
                      className={`px-3 py-2 text-xs font-medium ${
                        activePaletteTab === "orange"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActivePaletteTab("orange")}
                    >
                      Orange
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-6">
                    {palette.map((color, index) => {
                      return (
                        <div
                          key={`palette-${index}`}
                          className="relative group"
                        >
                          <div
                            className="w-full aspect-square rounded-md shadow-md group-hover:shadow-lg transition-shadow cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={(e) => copyToClipboard(color, e)}
                          ></div>
                          <div
                            style={{
                              top: "-21px",
                              fontSize: "8px",
                            }}
                            className="color-banner absolute inset-x-0 p-1 bg-opacity-70 rounded-t-lg group-hover:opacity-100 transition-opacity text-gray-700 font-mono"
                          >
                            <div className="flex justify-between items-center">
                              <span>{color}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePaletteColor(color);
                                }}
                                className="text-red-400 hover:text-red-300 focus:outline-none text-xs"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {palette.length < 1 && (
                      <div className="col-span-8 text-center text-gray-500 font-sm pt-10">
                        Your palette is empty. <br /> Pick colour from color
                        picker and click "Add to Palette" button.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Gradient Editor
                  </h2>
                  <div className="mb-4">
                    <div
                      className="w-full h-40 rounded-md shadow-md mb-4"
                      style={{ background: getGradientString() }}
                    ></div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gradient Type
                        </label>
                        <select
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      {gradientType === "linear" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Direction
                          </label>
                          <select
                            value={gradientDirection}
                            onChange={(e) =>
                              setGradientDirection(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="to right">→ To Right</option>
                            <option value="to left">← To Left</option>
                            <option value="to bottom">↓ To Bottom</option>
                            <option value="to top">↑ To Top</option>
                            <option value="to bottom right">
                              ↘ To Bottom Right
                            </option>
                            <option value="to bottom left">
                              ↙ To Bottom Left
                            </option>
                            <option value="to top right">↗ To Top Right</option>
                            <option value="to top left">↖ To Top Left</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Color
                        </label>
                        <div className="flex">
                          <div
                            className="w-10 h-10 rounded-l-md border border-gray-300"
                            style={{ backgroundColor: gradientColors[0] }}
                          ></div>
                          <input
                            type="text"
                            value={gradientColors[0]}
                            onChange={(e) =>
                              setGradientColors([
                                e.target.value,
                                gradientColors[1],
                              ])
                            }
                            className="flex-1 border border-l-0 border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Color
                        </label>
                        <div className="flex">
                          <div
                            className="w-10 h-10 rounded-l-md border border-gray-300"
                            style={{ backgroundColor: gradientColors[1] }}
                          ></div>
                          <input
                            type="text"
                            value={gradientColors[1]}
                            onChange={(e) =>
                              setGradientColors([
                                gradientColors[0],
                                e.target.value,
                              ])
                            }
                            className="flex-1 border border-l-0 border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => copyToClipboard(getGradientString(), e)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  >
                    Copy CSS Gradient
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-md px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Export Your Palette
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Choose the format you would like to export your color
                      palette in.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={exportAsPDF}
                >
                  Export as PDF
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={exportAsJSON}
                >
                  Export as JSON
                </button>
              </div>
              <div className="mt-5 text-center">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed bg-black text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            zIndex: 9999,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}
