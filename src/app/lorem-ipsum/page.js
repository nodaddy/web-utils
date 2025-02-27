// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
import Texts from "./Texts";
// import JsonFormatter from "./JsonFormatter";

//  Dynamically import the client component
const LoremIpsum = dynamic(() => import("./LoremIpsum"), {
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
  title: "Free Online Text Generator | Genrate Sample Fonts & Text Online",
  description:
    "Use our free Lorem Ipsum Generator to create random dummy text. Generate lipsum placeholder text in multiple languages. Try now!",
  openGraph: {
    title: "Free Online Text Generator | Genrate Sample Fonts & Text Online",
    description: `Generate dummy text and mockup text 
    instantly with our free online text generator. Customize your lorem ipsum with different font 
    styles, copy-paste fonts, and realistic dummy content for UI/UX, 
    web design, and presentations. Perfect for designers, developers, and content creators! 🚀`,
    type: "website",
    url: "https://nexonware.com/lorem-ipsum",
    images: [
      {
        url: "https://nexonware.com/assets/lorem-ipsum.png",
        width: 1200,
        height: 630,
        alt: "Lorem Ipsum Generator Preview",
      },
    ],
  },
  keywords: [
    "text generator",
    "sample text",
    "dummy text",
    "online text generator",
    "fonts generator",

    "samples of text",
    "dummy content",
    "fonts copy and paste",
    "lorem lipsum",
    "font style online",
    "text generator",
    "mockup text",
  ],
};

export default function LoremIpsumPage() {
  return (
    <>
      <div className="bg-[#f5f5f5] pt-16 overflow:auto flex justify-between bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Main Heading */}
        <div align="center" className="w-[42rem] pt-6 text-black">
          <h1 className="text-3xl">Lorem Ipsum</h1>

          <Texts />

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">
              Why Use Our Text Generator?
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <li className="bg-blue-50 p-4 rounded">
                ✓ Instant mockup text generation
              </li>
              <li className="bg-blue-50 p-4 rounded">
                ✓ Multiple samples of text lengths
              </li>
              <li className="bg-blue-50 p-4 rounded">
                ✓ Better than basic lorem lipsum
              </li>
              <li className="bg-blue-50 p-4 rounded">
                ✓ Easy fonts copy and paste
              </li>
              <li className="bg-blue-50 p-4 rounded">
                ✓ Test different font styles online
              </li>
              <li className="bg-blue-50 p-4 rounded">
                ✓ SEO-friendly dummy content
              </li>
            </ul>
          </div>
        </div>
        <LoremIpsum />
      </div>
    </>
  );
}
