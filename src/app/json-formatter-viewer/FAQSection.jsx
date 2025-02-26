"use client";
import { useState } from "react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is a JSON Formatter?",
      answer:
        "A JSON Formatter and JSON Validator helps format, beautify and validate JSON data, making it readable to visualise errors.",
    },
    {
      question: "How do I validate JSON online?",
      answer:
        "You can paste your JSON and use our JSON Validator to check for errors.",
    },
    {
      question: "Is this JSON Formatter free to use?",
      answer:
        "Yes, our JSON Formatter and JSON viewer is completely free with no hidden costs.",
    },
    {
      question: "How do I convert a JSON to XML?",
      answer:
        "Use our JSON to XML converter to convert JSON to XML and then you can view and then download that XML file as a downloadable .xml file.",
    },
    {
      question: "How do I convert a JSON to YAML?",
      answer:
        "Use our JSON to XML converter to convert JSON to YAML and then you can view and then download that yaml file as a downloadable .yaml file.",
    },
    {
      question: "How do I convert a JSON to CSV?",
      answer:
        "Use our JSON to XML converter to convert JSON to CSV and then you can view and then download that csv file as a downloadable .csv file.",
    },
    {
      question: "How do I convert a JSON string to a JSON file?",
      answer:
        "Use our JSON Converter to save a JSON string as a downloadable .json file.",
    },
    {
      question: "Can I use this tool on mobile devices?",
      answer:
        "Yes, our JSON Formatter is fully responsive and works on all devices.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="  mx-auto mt-16 p-6 border-t border-gray-300 text-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6">
        FAQs - Frequently Asked Questions
      </h2>

      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-200 mb-2">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left py-3 text-lg font-medium flex justify-between items-center focus:outline-none"
          >
            {faq.question}
            <span>{openIndex === index ? "▲" : "▼"}</span>
          </button>
          <div
            className={`overflow-hidden transition-all ${
              openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="py-2 text-gray-500"> - {faq.answer} </p>
          </div>
        </div>
      ))}
    </div>
  );
}
