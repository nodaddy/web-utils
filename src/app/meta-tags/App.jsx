"use client";
// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function Home() {
  // Context for app name
  const { setTool } = useAppContext();

  // Set tool name on component mount
  useEffect(() => {
    setTool("Meta Tag Generator");
  }, []);

  // State for meta tag input values
  const [metaData, setMetaData] = useState({
    // Basic SEO
    title: "My Amazing Website",
    description:
      "This is a description of my website that will appear in search results.",
    keywords: "website, SEO, meta tags, web development",
    canonical: "https://www.example.com",
    // Open Graph
    ogTitle: "My Amazing Website",
    ogDescription:
      "This is a description of my website that will appear when shared on social media.",
    ogUrl: "https://www.example.com",
    ogImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=websitepreview",
    ogType: "website",
    // Twitter Card
    twitterTitle: "My Amazing Website",
    twitterDescription:
      "This is a description of my website that will appear when shared on Twitter.",
    twitterImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=websitepreview",
    twitterCard: "summary_large_image",
    twitterSite: "@yourtwitter",
    // Additional
    author: "Your Name",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1.0",
    favicon: "https://api.dicebear.com/7.x/bottts/svg?seed=favicon",
  });

  // State for preview mode
  const [previewMode, setPreviewMode] = useState("google"); // google, facebook, twitter
  const [showCode, setShowCode] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetaData((prev) => ({
      ...prev,
      [name]: value,
      // Keep OG and Twitter fields in sync with basic SEO fields if they haven't been manually changed
      ...(name === "title"
        ? {
            ogTitle: metaData.ogTitle === prev.title ? value : metaData.ogTitle,
            twitterTitle:
              metaData.twitterTitle === prev.title
                ? value
                : metaData.twitterTitle,
          }
        : {}),
      ...(name === "description"
        ? {
            ogDescription:
              metaData.ogDescription === prev.description
                ? value
                : metaData.ogDescription,
            twitterDescription:
              metaData.twitterDescription === prev.description
                ? value
                : metaData.twitterDescription,
          }
        : {}),
      ...(name === "ogTitle" && metaData.twitterTitle === prev.ogTitle
        ? { twitterTitle: value }
        : {}),
      ...(name === "ogDescription" &&
      metaData.twitterDescription === prev.ogDescription
        ? { twitterDescription: value }
        : {}),
    }));
  };

  // Generate meta tags code
  const generateMetaTagsCode = () => {
    return `<!-- Basic SEO Meta Tags -->
<title>${metaData.title}</title>
<meta name="description" content="${metaData.description}" />
<meta name="keywords" content="${metaData.keywords}" />
<link rel="canonical" href="${metaData.canonical}" />
<meta name="author" content="${metaData.author}" />
<meta name="robots" content="${metaData.robots}" />
<meta name="viewport" content="${metaData.viewport}" />
<link rel="icon" href="${metaData.favicon}" />

<!-- Open Graph Meta Tags (Facebook, LinkedIn) -->
<meta property="og:title" content="${metaData.ogTitle}" />
<meta property="og:description" content="${metaData.ogDescription}" />
<meta property="og:url" content="${metaData.ogUrl}" />
<meta property="og:image" content="${metaData.ogImage}" />
<meta property="og:type" content="${metaData.ogType}" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="${metaData.twitterCard}" />
<meta name="twitter:site" content="${metaData.twitterSite}" />
<meta name="twitter:title" content="${metaData.twitterTitle}" />
<meta name="twitter:description" content="${metaData.twitterDescription}" />
<meta name="twitter:image" content="${metaData.twitterImage}" />`;
  };

  // Copy meta tags to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generateMetaTagsCode())
      .then(() => {
        alert("Meta tags copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Preview components
  const GooglePreview = () => (
    <div className="border rounded-lg p-4 bg-white shadow-sm w-full max-w-2xl">
      <div className="text-xl text-blue-800 font-medium truncate hover:underline cursor-pointer">
        {metaData.title}
      </div>
      <div className="text-green-700 text-sm my-1 truncate">
        {metaData.canonical}
      </div>
      <div className="text-gray-600 text-sm line-clamp-2">
        {metaData.description}
      </div>
    </div>
  );

  const FacebookPreview = () => (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm w-full max-w-md">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img
          src={metaData.ogImage}
          alt="Open Graph Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="text-gray-500 text-xs uppercase tracking-wide">
          {new URL(metaData.ogUrl || "https://example.com").hostname}
        </div>
        <div className="font-bold text-lg mt-1">{metaData.ogTitle}</div>
        <div className="text-gray-600 text-sm mt-1 line-clamp-3">
          {metaData.ogDescription}
        </div>
      </div>
    </div>
  );

  const TwitterPreview = () => (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm w-full max-w-md">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img
          src={metaData.twitterImage}
          alt="Twitter Card Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-bold">{metaData.twitterTitle}</div>
        <div className="text-gray-600 text-sm mt-1 line-clamp-2">
          {metaData.twitterDescription}
        </div>
        <div className="text-gray-500 text-xs mt-2 flex items-center">
          <span className="inline-block mr-1">🔗</span>
          {new URL(metaData.ogUrl || "https://example.com").hostname}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto  ">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Meta Tag Generator <span className="text-blue-500">📊</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic SEO Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🔍</span> Basic SEO
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Page Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={metaData.title}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="Your page title"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      name="canonical"
                      value={metaData.canonical}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="https://www.yourdomain.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    name="description"
                    value={metaData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Brief description of your page (150-160 characters recommended)"
                  ></textarea>
                  <div className="text-xs text-gray-500">
                    Character count: {metaData.description.length}
                    {metaData.description.length > 160 && (
                      <span className="text-red-500">
                        {" "}
                        (Recommended: 160 max)
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Keywords
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={metaData.keywords}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>

              {/* Open Graph Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">📱</span> Open Graph (Social Media)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      OG Title
                    </label>
                    <input
                      type="text"
                      name="ogTitle"
                      value={metaData.ogTitle}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      OG URL
                    </label>
                    <input
                      type="text"
                      name="ogUrl"
                      value={metaData.ogUrl}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    OG Description
                  </label>
                  <textarea
                    name="ogDescription"
                    value={metaData.ogDescription}
                    onChange={handleInputChange}
                    rows="2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  ></textarea>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    name="ogImage"
                    value={metaData.ogImage}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    OG Type
                  </label>
                  <select
                    name="ogType"
                    value={metaData.ogType}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="blog">Blog</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>
              </div>

              {/* Twitter Card Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🐦</span> Twitter Card
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      name="twitterTitle"
                      value={metaData.twitterTitle}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Twitter Card Type
                    </label>
                    <select
                      name="twitterCard"
                      value={metaData.twitterCard}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">
                        Summary with Large Image
                      </option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter Description
                  </label>
                  <textarea
                    name="twitterDescription"
                    value={metaData.twitterDescription}
                    onChange={handleInputChange}
                    rows="2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  ></textarea>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter Image URL
                  </label>
                  <input
                    type="text"
                    name="twitterImage"
                    value={metaData.twitterImage}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter @username
                  </label>
                  <input
                    type="text"
                    name="twitterSite"
                    value={metaData.twitterSite}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="@yourusername"
                  />
                </div>
              </div>

              {/* Additional Meta Tags */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">⚙️</span> Additional Meta Tags
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={metaData.author}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Robots
                    </label>
                    <select
                      name="robots"
                      value={metaData.robots}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="index, nofollow">Index, No Follow</option>
                      <option value="noindex, follow">No Index, Follow</option>
                      <option value="noindex, nofollow">
                        No Index, No Follow
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Viewport
                    </label>
                    <input
                      type="text"
                      name="viewport"
                      value={metaData.viewport}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Favicon URL
                    </label>
                    <input
                      type="text"
                      name="favicon"
                      value={metaData.favicon}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>

                {/* Preview Type Selector */}
                <div className="mb-6">
                  <div className="flex bg-white rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setPreviewMode("google")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                        previewMode === "google"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Google
                    </button>
                    <button
                      onClick={() => setPreviewMode("facebook")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                        previewMode === "facebook"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => setPreviewMode("twitter")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                        previewMode === "twitter"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Twitter
                    </button>
                  </div>
                </div>

                {/* Preview Display */}
                <div className="flex justify-center mb-6">
                  {previewMode === "google" && <GooglePreview />}
                  {previewMode === "facebook" && <FacebookPreview />}
                  {previewMode === "twitter" && <TwitterPreview />}
                </div>

                {/* Code Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Generated Meta Tags</h3>
                    <button
                      onClick={() => {
                        logGAEvent(
                          applicationNamesForGA.metaTagsGenerator +
                            "toggle_show_code",
                          {
                            showCode: !showCode,
                          }
                        );
                        setShowCode(!showCode);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showCode ? "Hide Code" : "Show Code"}
                    </button>
                  </div>

                  {showCode && (
                    <div className="bg-gray-800 text-white p-3 rounded-md overflow-auto max-h-80 text-sm">
                      <pre>{generateMetaTagsCode()}</pre>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      logGAEvent(
                        applicationNamesForGA.metaTagsGenerator +
                          "click_copy_meta_tags"
                      );
                      copyToClipboard();
                    }}
                    className="w-full text-lg mt-4 py-2 px-4 bg-purple-700 border border-transparent rounded-full shadow-sm  font-medium text-white   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy Meta Tags 📋
                  </button>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-white p-3 rounded-md shadow-sm text-sm">
                  <h3 className="font-medium mb-2">SEO Tips:</h3>
                  <ul className="space-y-1 text-gray-600 list-disc pl-5">
                    <li>Keep titles under 60 characters</li>
                    <li>Meta descriptions should be 150-160 characters</li>
                    <li>Use unique titles and descriptions for each page</li>
                    <li>Include relevant keywords naturally</li>
                    <li>
                      Use high-quality images (1200x630px ideal for social)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
