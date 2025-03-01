import Base64EncoderDecoder from "./app/base64-encode-decode/App";
import URLEncoderDecoder from "./app/url-encode-decode/App";

const applicationNamesForGA = {
  jsonFormatterViewer: "json-formatter",
  textGenerator: "text-generator",
  passwordGenerator: "password-Generator",
  colorPalette: "color-palette",
  convertCase: "convert-case",
  URLEncoderDecoder: "url-encode-decode",
  Base64EncoderDecoder: "base64-encode-decode",
};

export const allUtilities = {
  "File Conversion": [],
  "Data Tools": [
    {
      id: "lorem-ipsum",
      title: "Lorem Ipsum",
      description: "Generate random text",
      icon: "Aa",
    },
    {
      id: "json-formatter",
      title: "JSON Formatter",
      description: "Format and validate JSON data",
      icon: "📜",
    },
    {
      id: "color-palette",
      title: "Color palette",
      description: "Create color schemes",
      icon: "🎨",
    },
  ],
  "Developer Tools": [
    {
      id: "url-encode-decode",
      title: "Encode Decode URL",
      description: "Encode or Decode Urls",
      icon: "🎯",
    },
  ],
  Productivity: [],
  Lifestyle: [
    {
      id: "password-generator",
      title: "Secure Password Generator",
      description: "Generate strong passwords",
      icon: "🔒",
    },
  ],
  "Text Tools": [
    {
      id: "convert-case",
      title: "Case converter",
      description: "Instanly Convert Text Case",
      icon: "🔡",
    },
    {
      id: "base64-encode-decode",
      title: "Base64 Encode Decode",
      description: "Encode and decode base64 strings",
      icon: "🤖",
    },
  ],
};

export default applicationNamesForGA;
