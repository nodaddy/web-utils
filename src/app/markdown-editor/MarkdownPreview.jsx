"use client";

import { useEffect, useState } from "react";
import 'highlight.js/styles/github.css'; // Import highlight.js CSS

export default function MarkdownPreview({ markdown }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // We'll use a dynamic import for the markdown parser to reduce initial bundle size
    const loadMarkdownParser = async () => {
      try {
        // Import the markdown-it library
        const MarkdownIt = (await import("markdown-it")).default;
        
        // Import plugins if needed
        const markdownItHighlight = (await import("markdown-it-highlightjs")).default;
        
        // Initialize markdown-it with plugins
        const md = new MarkdownIt({
          html: true,
          linkify: true,
          typographer: true,
        }).use(markdownItHighlight);
        
        // Render the markdown to HTML
        const renderedHtml = md.render(markdown || "");
        setHtml(renderedHtml);
      } catch (error) {
        console.error("Error loading markdown parser:", error);
        // Fallback to a simple renderer if the library fails to load
        setHtml(simpleMarkdownToHtml(markdown || ""));
      }
    };
    
    loadMarkdownParser();
  }, [markdown]);

  // Simple fallback markdown renderer in case the library fails to load
  const simpleMarkdownToHtml = (text) => {
    return text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  };

  return (
    <div 
      className="markdown-preview prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
} 