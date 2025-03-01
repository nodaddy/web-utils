"use client";
import { useAppContext } from "../../Context/AppContext";
import { useEffect, useState } from "react";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";
import CopyButton from "./CopyButton";

// More extensive lorem ipsum text in different languages
const loremIpsumText = {
  en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  es: "El veloz zorro marrón salta sobre el perro perezoso. Una frase utilizada en español para contener todas las letras del alfabeto. Los curiosos pingüinos nadaban felizmente en el agua cristalina del zoológico. El chef preparó exquisitos manjares para la celebración del aniversario real. para la celebración del aniversario real para la celebración del aniversario real",
  fr: "Portez ce vieux whisky au juge blond qui fume. Le cœur déçu mais l'âme plutôt naïve, Louÿs rêva de crapaüter en canoë au delà des naïve, Louÿs rêva de crapaüter en canoë au delà des naïve, Louÿs rêva de crapaüter en canoë au delà desnaïve, Louÿs rêva de crapaüter en canoë au delà desnaïve, Louÿs rêva de crapaüter en canoë au delà des îles, près du mälström où brûlent les novæ.",
  de: "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen SylterTaxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Vogel Quax zwickt Johnys Pferd Bim.Vogel Quax zwickt Johnys Pferd Bim.",
  it: "Ma la volpe, col suo balzo, ha raggiunto il quieto Fido. Quel vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja! vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja! vituperabile xenofobo zelante assaggia ilraggiunto il quieto Fido. Quel vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja! vituperabile xenofobo zelante assaggia il whisky ed esclama: whisky ed esclama: alleluja!",
};

// Available font options
const fontOptions = [
  { value: "font-serif", label: "Serif" },
  { value: "font-sans", label: "Sans-Serif" },
  { value: "font-mono", label: "Monospace" },
];

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(2);
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("'Montserrat', sans-serif");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { setTool } = useAppContext();

  const generateText = () => {
    setIsGenerating(true);
    setCopied(false);

    // Simulate loading for premium feel
    setTimeout(() => {
      const result = [];
      const baseParagraph = loremIpsumText[language];

      for (let i = 0; i < paragraphs; i++) {
        // Vary paragraph lengths slightly for more natural text
        const paragraphText =
          baseParagraph
            .split(". ")
            .slice(0, Math.floor(Math.random() * 3) + 5)
            .join(". ") + "...";

        result.push(paragraphText);
      }

      setGeneratedText(result.join(" "));
      setIsGenerating(false);
    }, 400);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  // Function to format paragraphs with proper HTML instead of using whitespace-pre-wrap
  const formatParagraphs = () => {
    if (!generatedText) return null;

    return generatedText.split(".").map((sentence, index) => {
      if (sentence.trim() === "") return null;

      // Add period back except for the last empty item
      const fullSentence =
        sentence + (index < generatedText.split(".").length - 1 ? "." : "");

      return <span key={index}>{fullSentence}</span>;
    });
  };

  useEffect(() => {
    setTool("Lorem Ipsum");
  }, []);

  return (
    <div className="min-h-screen text-gray-700 px-6 py-4 mt-4">
      <div className=" min-w-[42rem] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 text-white">
          <h1 className="text-2xl font-bold tracking-tight">
            Generate Custom Dummy Text
          </h1>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of paragraphs
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setParagraphs(Math.max(1, paragraphs - 1))}
                  className="px-3 py-1.5 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={paragraphs}
                  onChange={(e) =>
                    setParagraphs(Math.max(1, Number(e.target.value)))
                  }
                  min="1"
                  max="10"
                  className="border border-gray-400 w-16 text-center py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                <button
                  onClick={() => setParagraphs(Math.min(10, paragraphs + 1))}
                  className="px-3 py-1.5 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="14px">Small (14px)</option>
                <option value="16px">Medium (16px)</option>
                <option value="18px">Large (18px)</option>
                <option value="20px">Extra Large (20px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              logGAEvent(
                `${applicationNamesForGA.textGenerator}_click_generate_text`,
                {
                  paragraphs,
                  language,
                  fontSize,
                  fontFamily,
                }
              );
              generateText();
            }}
            disabled={isGenerating}
            className={` py-2 px-6 rounded-md text-white font-medium transition-all ${
              isGenerating
                ? "bg-blue-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-lg"
            }`}
          >
            {isGenerating ? "Generating..." : "Generate Text"}
          </button>
        </div>
      </div>

      {generatedText && !isGenerating && (
        <div className="min-w-[42rem] max-w-2xl mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-medium text-gray-800">
              Generated Text
            </h2>
            <CopyButton content={generatedText} id={""} />
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: generatedText
                .split(" ") // Split the string into words
                .map((word) => word) // Shuffle letters in each word
                .join(" "),
            }}
            className={`p-6 text-gray-700 ${fontFamily}`}
            style={{ fontSize }}
          ></div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>Lorem Ipsum Generator • by Nexonware</p>
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;
