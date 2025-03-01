// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
import SeoContent from "./SeoContent";
import { AppContainer } from "../../components/AppContainer";
import { AppSEOTextSection } from "../../components/AppSEOTextSection";
import { AppPageContainer } from "../../components/AppPageContainer";
// import JsonFormatter from "./JsonFormatter";

//  Dynamically import the client component
const App = dynamic(() => import("./App.jsx"), {
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
  title: "Case Converter Online | Convert Upper & Lower Case and More",
  description:
    "Instant text case converter: Easily change case online with our free case conversion tool. Convert uppercase to lowercase, or switch capital letters instantly and much more. Try it now!",
  openGraph: {
    title: "Case Converter Online | Convert Upper & Lower Case and more",
    description:
      "Easily change case online with our free case conversion tool. Convert uppercase to lowercase, lowercase to uppercase, or switch capital letters instantly and much more. Try it now!",
    type: "website",
    url: "https://nexonware.com/convert-case",
    images: [
      {
        url: "https://nexonware.com/assets/convert-case.png",
        width: 1200,
        height: 630,
        alt: "Case Converter Preview",
      },
    ],
  },
  keywords: [
    // Primary keywords
    "case conversion online",
    "change case online",
    "lower case converter",
    "upper case to lower case converter",
    "lowercase converter",
    "capital letters converter",

    // Secondary keywords
    "convert to upper case",
    "cap to lowercase",
    "upper to lowercase",
    "upper case convert",
  ],
};

export default function LoremIpsumPage() {
  return (
    <AppPageContainer>
      <AppSEOTextSection>
        <SeoContent />
      </AppSEOTextSection>

      <AppContainer>
        <App />
      </AppContainer>
    </AppPageContainer>
  );
}
