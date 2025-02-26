// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
import JsonFormatterPage from "./KnowMore";
import FAQSection from "./FAQSection";
// import JsonFormatter from "./JsonFormatter";

//  Dynamically import the client component
const JsonFormatterApp = dynamic(() => import("./JsonFormatter"), {
  loading: () => (
    <p className="text-center text-xl text-gray-300">
      <br />
      <br />
      <br />
      <br />
      Loading your app...
    </p>
  ),
});

export const metadata = {
  title: "Free JSON Formatter & Viewer Online | Validate & Beautify JSON",
  description:
    "Use our free JSON Formatter & Viewer to format, beautify, validate, and parse JSON online. Convert JSON string to JSON, YAML, XML, CSV with ease. Try now!",
  openGraph: {
    title: "Free JSON Formatter & Viewer Online",
    description:
      "Quickly format, validate, and beautify JSON with our free online JSON tool.",
    type: "website",
    url: "https://nexonware.com/json-formatter",
    images: [
      {
        url: "https://nexonware.com/assets/json-formatter-preview.png",
        width: 1200,
        height: 630,
        alt: "JSON Formatter and JSON Viewer Preview",
      },
    ],
  },
  keywords: [
    // Primary Keywords (High Volume)
    "JSON Formatter",
    "JSON Viewer",

    // Secondary Keywords (Medium Volume, Low Competition)
    "JSON Formatter Online",
    "JSON Vali",
    "JSON Formatter Validator",
    "JSON Beautifier",
    "JSON Editor Online",
    "JSON Viewer Online",

    // Long-Tail Keywords (Highly Specific, Low Competition)
    "String to JSON Online",
    "Validate JSON Online",
    "Parse JSON Online",
    "JSON File Viewer",
    "JSON to JSON Converter",
    "JSON Formatter on Line",
    "Check Valid JSON Online",
    "JSON Verification",
    "JSON Verify",
    "Convert JSON String to JSON",
  ],
};

export default function JsonEditorPage() {
  return (
    <div className="bg-[#f5f5f5] overflow:auto">
      <br />
      <br />
      <JsonFormatterPage />

      {<JsonFormatterApp />}
      <FAQSection />
    </div>
  );
}
