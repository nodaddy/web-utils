"use client";

import { useState } from "react";

export default function SeoDebugForm() {
  const [formData, setFormData] = useState({
    primaryKeywords: "",
    secondaryKeywords: "",
    appRoute: "",
    appDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/create-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryKeywords: formData.primaryKeywords
            .split(",")
            .map((k) => k.trim()),
          secondaryKeywords: formData.secondaryKeywords
            .split(",")
            .map((k) => k.trim()),
          appRoute: formData.appRoute,
          appDescription: formData.appDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create SEO app");

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 mt-16">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">
          Create App Route
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Primary Keywords (comma-separated)
            </label>
            <input
              type="text"
              name="primaryKeywords"
              value={formData.primaryKeywords}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Secondary Keywords (comma-separated)
            </label>
            <input
              type="text"
              name="secondaryKeywords"
              value={formData.secondaryKeywords}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              App Route
            </label>
            <input
              type="text"
              name="appRoute"
              value={formData.appRoute}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              App Description
            </label>
            <textarea
              name="appDescription"
              value={formData.appDescription}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-sm">
            <h3 className="text-green-400 font-bold mb-2">Response:</h3>
            <pre className="overflow-x-auto text-gray-300">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <ApplicationListingForm />
    </div>
  );
}

function ApplicationListingForm() {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    icon: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData({ ...formData, icon: emoji });
    setShowEmojiPicker(false);
  };

  const emojis = ["🚀", "💡", "🔥", "🎨", "⚡", "📱", "🌟", "💻", "🎯", "🤖"];

  return (
    <div className="flex justify-around text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
          Application Listing Form
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Icon (Emoji)
            </label>
            <div className="relative">
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                onFocus={() => setShowEmojiPicker(true)}
              />
              {showEmojiPicker && (
                <div className="absolute bg-gray-900 p-2 rounded-lg shadow-lg mt-2 w-full grid grid-cols-5 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-lg hover:bg-gray-700 p-2 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            Copy to Clipboard
          </button>
        </form>
      </div>
    </div>
  );
}
