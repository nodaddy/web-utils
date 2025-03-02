const applicationNamesForGA = {
  jsonFormatterViewer: "json-formatter",
  textGenerator: "text-generator",
  passwordGenerator: "password-Generator",
  colorPalette: "color-palette",
  convertCase: "convert-case",
  URLEncoderDecoder: "url-encode-decode",
  Base64EncoderDecoder: "base64-encode-decode",
  jsonYamlConverter: "json-yaml-converter",
  xmlJSONConverter: "xml-json-converter",
  jsonCsvConverter: "json-csv-converter",
  sampleDataGenerator: "sample-data-generator",
  metaTagsGenerator: "meta-tags-generator",
};

export const allUtilities = {
  "File Conversion": [],
  "Data Tools": [
    {
      id: "sample-data-generator",
      title: "Sample Data Generator",
      description: "Sample/Mock data",
      icon: "📱",
    },
    {
      id: "lorem-ipsum",
      title: "Lorem Ipsum",
      description: "Generate random text",
      icon: "Aa",
    },
    {
      id: "json-formatter-viewer",
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
    {
      id: "json-yaml-converter",
      title: "JSON YAML Converter",
      description: "JSON - YAML ",
      icon: "🔥",
    },
    {
      id: "json-csv-converter",
      title: "JSON CSV Converter",
      description: "JSON - CSV",
      icon: "⚡",
    },
    {
      id: "xml-json-converter",
      title: "XML JSON Converter",
      description: "XML - JSON ",
      icon: "🤖",
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
  Miscellaneous: [
    {
      id: "meta-tags",
      title: "Meta Tags",
      description: "Boost SEO with Meta Tags",
      icon: "💻",
    },
  ],
};

export default applicationNamesForGA;
