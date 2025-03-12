// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
  import dynamic from "next/dynamic";
  import { AppContainer } from "../../components/AppContainer";
  import { AppSEOTextSection } from "../../components/AppSEOTextSection";
  import { AppPageContainer } from "../../components/AppPageContainer";
  import DescriptionWithSEO from "./DescriptionWithSEO";
  import pageMetadata from "./pageMetadata";
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
  
  export const metadata = pageMetadata;
  
  export default function LoremIpsumPage() {
    return (
      <AppPageContainer>
        <AppSEOTextSection>
          <DescriptionWithSEO />
        </AppSEOTextSection>
  
        <AppContainer>
          <App />
        </AppContainer>
      </AppPageContainer>
    );
  }  
  