// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
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
  title: "Best JSON Formatter and JSON Validator: Online JSON Formatter",
  description:
    "Online JSON Formatter / Beautifier and JSON Validator will format JSON data, and helps to validate, convert JSON to XML, JSON to CSV",
  openGraph: {
    title: "Online JSON Formatter & Validator",
    description:
      "Format, validate, and beautify JSON online with Nexonware's easy-to-use JSON editor.",
    url: "https://nexonware.com/json-editor",
    type: "website",
  },
  keywords: [
    "JSON Formatter",
    "Online JSON Validator",
    "Minify JSON",
    "Beautify JSON",
    "Free JSON Editor",
  ],
};

export default function JsonEditorPage() {
  return (
    <div className="h-screen bg-[#f5f5f5]">
      <br />
      <br />
      <br />
      <h1 className="text-black ">
        &nbsp;&nbsp; &nbsp;&nbsp;Quick JSON Formatter & Validator
      </h1>

      {<JsonFormatterApp />}
    </div>
  );
}
