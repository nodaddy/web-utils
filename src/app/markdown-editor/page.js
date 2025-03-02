// app/markdown-editor/page.js
import dynamic from "next/dynamic";

// Dynamically import the client component
const MarkdownEditor = dynamic(() => import("./MarkdownEditor"), {
  loading: () => (
    <p className="text-center text-xl text-gray-300">
      <br />
      <br />
      <br />
      <br />
      Loading your markdown editor...
    </p>
  ),
});

export const metadata = {
  title: "Free Online Markdown Editor & Previewer | Format & Export Markdown",
  description:
    "Use our free Markdown Editor to write, preview, and export markdown content. Real-time preview, syntax highlighting, and export to HTML or PDF. Try now!",
  openGraph: {
    title: "Free Online Markdown Editor & Previewer",
    description:
      "Write and preview markdown with our free online editor. Perfect for README files, documentation, and blog posts.",
    type: "website",
    url: "https://nexonware.com/markdown-editor",
    images: [
      {
        url: "https://nexonware.com/assets/markdown-editor-preview.png",
        width: 1200,
        height: 630,
        alt: "Markdown Editor and Previewer",
      },
    ],
  },
  keywords: [
    // Primary Keywords
    "Markdown Editor",
    "Markdown Previewer",
    
    // Secondary Keywords
    "Online Markdown Editor",
    "Markdown to HTML",
    "Markdown Formatter",
    "Live Markdown Preview",
    
    // Long-Tail Keywords
    "Write Markdown Online",
    "Export Markdown to PDF",
    "Markdown Syntax Highlighting",
    "GitHub Markdown Editor",
    "README Markdown Editor",
    "Documentation Markdown Tool",
  ],
};

export default function MarkdownEditorPage() {
  return (
    <div className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Markdown Editor</h1>
          <p className="text-gray-600 mt-2">
            Write, preview, and export your markdown content with ease
          </p>
        </div>
        
        <MarkdownEditor />
        
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About Markdown</h2>
          <p className="text-gray-700 mb-4">
            Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. 
            Created by John Gruber in 2004, Markdown is now one of the world's most popular markup languages.
          </p>
          <p className="text-gray-700 mb-4">
            Using Markdown is different than using a WYSIWYG editor. In an application like Microsoft Word, you click buttons 
            to format words and phrases, and the changes are visible immediately. Markdown isn't like that. When you create 
            a Markdown-formatted file, you add Markdown syntax to the text to indicate which words and phrases should look different.
          </p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Why Use Markdown?</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>It's easy to learn and simple to use</li>
            <li>It's widely used for documentation (especially on GitHub)</li>
            <li>It converts easily to HTML and other formats</li>
            <li>It's portable and platform-independent</li>
            <li>It allows you to focus on writing content rather than formatting</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 