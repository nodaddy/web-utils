import React from "react";
import CopyButton from "./CopyButton";
import FontAndSizeControls from "./FontAndSizeControls";

const Texts = () => {
  // Sample text variations using SEO keywords
  const textSamples = [
    {
      id: "short",
      title: "Short Length Sample Text",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Our online text generator provides perfect mockup text samples for anyone. This sample text helps visualize Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    },
    {
      id: "medium",
      title: "Medium Length Sample Text",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. our text generator delivers instantly. These samples of text save valuable time in your creative process. Browse various font styles online and see how your typography choices will appear. Our dummy text generator creates professional-looking content that's easy to copy and paste into any software, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. `,
    },
    {
      id: "large",
      title: "Long Dummy Content",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. with placeholder content. Unlike traditional lorem lipsum, our mockup text incorporates natural language patterns that better represent actual content. Choose from multiple samples of text in various lengths to find the perfect dummy content for your projects. Our text generator helps visualize how different fonts and layouts will appear. Whether you need short paragraphs or extended blocks of dummy text, our generator provides instant solutions with easy fonts copy and paste functionality. Test different font styles online with our generated content to ensure your typography choices work well with real-world text patterns.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    },
    {
      id: "extra-large",
      title: "Extra Long Lorem Lipsum Alternative",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  providing realistic content patterns that better represent final text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. project and an excellent one. With our text generator, you can instantly create samples of text tailored to your specific needs.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.Our dummy content generator offers multiple paragraph styles and lengths, perfect for testing different font styles online. Each sample text block can be easily copied and pasted into your software, document, website, or system. The fonts generator functionality allows you to preview how different typography choices affect readability and visual appeal.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.Unlike traditional lorem ipsum generators, our text generator creates content that maintains natural language patterns while serving as effective placeholder text. This helps everyone better visualize the final product during review processes. Whether you need a short paragraph for a small section or extensive dummy text for a full page layout, our online text generator delivers instantly.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.Remember that good mockup text should mimic the rhythm and flow of real content. Our samples of text are carefully crafted to match typical content patterns across various uses and applications. With our fonts copy and paste feature, testing different typography options has never been easier.",
    },
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg text-gray-800`}>
      <p className="text-center mb-8 text-gray-600">
        Generate professional dummy text and lorem lipsum alternatives with our
        online text generator. Perfect for mockups with easy fonts copy and
        paste.
      </p>

      {/* Font and Size Controls */}
      <FontAndSizeControls />

      <div className="space-y-8">
        {textSamples.map((sample) => (
          <div key={sample.id} className="rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{sample.title}</h2>
              {<CopyButton content={sample.content} id={sample.id} />}
            </div>
            <div className={`bg-white p-4 rounded border`}>
              {sample.content.split("\n\n").map((paragraph, index) => (
                <p
                  align="left"
                  key={index}
                  className="sample-text-paragraph mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Texts;
