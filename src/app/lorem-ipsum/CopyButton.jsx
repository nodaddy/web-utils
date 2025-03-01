"use client";

import applicationNamesForGA from "../../Applications";
import { logGAEvent } from "../googleAnalytics/gaEvents";

const { useState } = require("react");

const CopyButton = ({ content, id }) => {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  return (
    <button
      onClick={() => {
        logGAEvent(`${applicationNamesForGA.textGenerator}_click_copy_text`, {
          textType: id,
        });
        copyToClipboard();
      }}
      className={`px-4 py-1 rounded text-sm font-bold  
  ${copied === id ? "text-green-500" : "text-blue-500"}
  `}
    >
      {copied === id ? "Copied!" : "Copy Text"}
    </button>
  );
};

export default CopyButton;
