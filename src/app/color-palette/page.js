// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
import ColorPaletteSEOContent from "./TextContent";
import { AppPageContainer } from "../../components/AppPageContainer";
import { AppSEOTextSection } from "../../components/AppSEOTextSection";
import { AppContainer } from "../../components/AppContainer";
// import JsonFormatter from "./JsonFormatter";

//  Dynamically import the client component
const Colorpalette = dynamic(() => import("./ColorPalette"), {
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
  title:
    "Free Color Palette Generator | Color Schemes and Harmony Online and Export",
  description:
    "Use our free Color Palette Generator to create beautiful color schemes and harmony. Generate and Export pastel, bright, purple, pink, orange, and other color palettes online. Try now!",
  openGraph: {
    title:
      "Free Color Palette Generator | Generate Color Schemes and download pdf Online",
    description:
      "Quickly create beautiful color palettes, free online color palette generator. Pastel, bright, purple, pink, orange, and other color palettes online. Try now!",
    type: "website",
    url: "https://nexonware.com/color-palette",
    images: [
      {
        url: "https://nexonware.com/assets/color-palette.png",
        width: 120,
        height: 120,
        alt: "Color Palette Generator Preview",
      },
    ],
  },
  keywords: [
    // Primary Keywords (High Volume)
    "Color palatte",
    "Colour circle Chart",
    "Pastel color palatte",
    "Bright color palatte",
    "Colour circle",
    "Purple color palatte",
    "Pink color palatte",
    "Orange color palatte",
  ],
};

export default function JsonEditorPage() {
  return (
    <AppPageContainer>
      <AppSEOTextSection>
        <ColorPaletteSEOContent />
      </AppSEOTextSection>

      <AppContainer>
        <Colorpalette />
      </AppContainer>
    </AppPageContainer>
  );
}
