import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to add this to your .env.local file
});

export async function POST(request) {
  try {
    // Extract the payload from the request
    const { primaryKeywords, secondaryKeywords, appRoute, appDescription } =
      await request.json();
    const keywords = [...primaryKeywords, ...secondaryKeywords];

    // Validate the input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!appRoute || typeof appRoute !== "string") {
      return NextResponse.json(
        { error: "App name must be a non-empty string" },
        { status: 400 }
      );
    }

    // Call OpenAI API to generate title and description for metadata
    const aiGeneratedMetadata = await generatePageMetadata(
      primaryKeywords,
      secondaryKeywords
    );

    // Call OpenAI API to generate SEO content for the page
    const seoContent = await generateSEOContent(
      primaryKeywords,
      secondaryKeywords,
      appRoute
    );

    let appJsxContent = "";
    if (appDescription) {
      // Call OpenAI API to generate App.jsx content
      appJsxContent = await generateAppJSX(appDescription);
    }

    // Create directory and write the metadata file
    const metadataSuccess = createMetadataFile(
      appRoute,
      aiGeneratedMetadata,
      primaryKeywords,
      secondaryKeywords
    );

    // Create the DescriptionWithSEO component
    const componentSuccess = createSEOComponentFile(appRoute, seoContent);

    let appComponentSuccess = true;

    // Create the App.jsx file
    appComponentSuccess = createAppJSXFile(appRoute, appJsxContent);

    // Create page.js file
    createPageJSFile(appRoute, seoContent);

    if (!metadataSuccess || !componentSuccess || !appComponentSuccess) {
      return NextResponse.json(
        { error: "Failed to create one or more required files" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Generated content and created metadata.js, DescriptionWithSEO.jsx, and App.jsx in app/${appRoute}/`,
      aiGeneratedMetadata,
      seoContent,
      appJsxContent,
    });
  } catch (error) {
    console.error("Error in generator:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

async function createPageJSFile(appRoute) {
  const contentForPageJS = `// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
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
  `;

  const appDirectory = path.join(process.cwd(), "src/app", appRoute);
  const filePath = path.join(appDirectory, "page.tsx");

  try {
    // Create the directory if it doesn't exist (should already exist from previous operations, but just in case)
    if (!fs.existsSync(appDirectory)) {
      fs.mkdirSync(appDirectory, { recursive: true });
    }

    // Write the file asynchronously
    await fs.writeFileSync(filePath, contentForPageJS);
    console.log(`✅ File created at: ${filePath}`);
  } catch (error) {
    console.error("❌ Error creating file:", error);
  }
}

async function generatePageMetadata(pk, sk) {
  const prompt = `
    Generate an SEO-optimized title and description for a web page based on the following keywords:
    Primary keywords: ${pk.join(", ")}
    Secondary keywords: ${sk.join(", ")}
    
    Return ONLY a JSON object with the following format:
    {
        title: "",
        description: "",
        openGraph: {
          title: "",
          description: "",
        }
      }
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO expert that creates concise, compelling titles and descriptions.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  // Parse the response
  return JSON.parse(completion.choices[0].message.content);
}

async function generateSEOContent(pk, sk, appRoute) {
  // Format the route for better readability in the prompt
  const formattedRoute = appRoute.replace(/\//g, " > ").replace(/-/g, " ");

  const prompt = `
    Generate most effective SEO optimised content for the web page of the web utility app based on these keywords:
    Primary keywords: ${pk.join(", ")}
    Secondary keywords: ${sk.join(", ")}
    
    The content should:
    1. Be approximately 250-300 words
    2. Include one H1 heading and 2-3 H2 subheadings
    3. Incorporate the keywords naturally
    4. Be informative and valuable to users
    5. should have Faqs section
    6. Do not give  \`\`\`\` html and \`\`\`\` in the begining and the end of your response

    Keep SEO in mind while generating the content, best seo

    
    Return the content as a simple HTML string with only h1, h2, p, and strong tags for example
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold"></h1>

      <p className="text-md text-gray-700"></p>

      <h2 className="text-2xl font-semibold"></h2>
      <ul className="list-disc pl-6 text-gray-700"></ul>

      <h2 className="text-2xl font-semibold"></h2>
      <ol className="list-decimal pl-6 text-gray-700"></ol>

      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>
      </div>

      <h2 className="text-2xl font-semibold"></h2>
      <p className="text-gray-700"></p>
    </div>
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO content expert that creates valuable, keyword-optimized content that ranks well in search engines while providing real value to readers.",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

async function generateAppJSX(appDescription) {
  const prompt = `
    Create a React component for a Next.js application based on the following description:
    "${appDescription}"
    
    Requirements:
    1. The component should be the default export
    2. Create an applicaiton that has all the features as per industry standard
    3. only use tailwind and html emojis if required, do not use any thrid party libraries
    6. Fous on usabiilty and accessible
    7. must look premium and professional
    9. add "use client" at the top
    
    please you must remove any ticks like \`\`\`\` jsx or \`\`\`\` from begining and the end of your response
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert Next.js developer that creates clean, efficient, and well-structured components.",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

function createMetadataFile(appRoute, seoContent, pk, sk) {
  try {
    // Define the paths
    const appDirectory = path.join(process.cwd(), "src/app", appRoute);
    const metadataFilePath = path.join(appDirectory, "pageMetadata.js");

    // Create the directory if it doesn't exist
    if (!fs.existsSync(appDirectory)) {
      fs.mkdirSync(appDirectory, { recursive: true });
    }

    seoContent.openGraph = {
      ...seoContent.openGraph,
      type: "website",
      url: `https://nexonware.com/${appRoute}`,
      images: [
        {
          url: "https://nexonware.com/assets/tools.png",
          width: 1200,
          height: 630,
          alt: "",
        },
      ],
    };

    seoContent.keywords = [...pk, ...sk];

    // Create the metadata.js content
    const metadataContent = `// Generated SEO metadata for ${appRoute}
const metadata = ${JSON.stringify(seoContent, null, 2)};

export default metadata;
`;

    // Write the file
    fs.writeFileSync(metadataFilePath, metadataContent);

    return true;
  } catch (error) {
    console.error("Error creating metadata file:", error);
    return false;
  }
}

function createSEOComponentFile(appRoute, seoContent) {
  try {
    // Define the paths
    const appDirectory = path.join(process.cwd(), "src/app", appRoute);
    const componentFilePath = path.join(appDirectory, "DescriptionWithSEO.jsx");

    // Create the directory if it doesn't exist (should already exist from metadata creation, but just in case)
    if (!fs.existsSync(appDirectory)) {
      fs.mkdirSync(appDirectory, { recursive: true });
    }

    // Create the React component content
    const componentContent = `// Generated SEO content component for ${appRoute}
import React from 'react';

const DescriptionWithSEO = () => {
  return (
    <div className="seo-content my-8 mx-auto max-w-3xl prose prose-lg">
      ${seoContent}
    </div>
  );
};

export default DescriptionWithSEO;
`;

    // Write the file
    fs.writeFileSync(componentFilePath, componentContent);

    return true;
  } catch (error) {
    console.error("Error creating SEO component file:", error);
    return false;
  }
}

function createAppJSXFile(appRoute, appJsxContent) {
  try {
    // Define the paths
    const appDirectory = path.join(process.cwd(), "src/app", appRoute);
    const appFilePath = path.join(appDirectory, "App.jsx");

    // Create the directory if it doesn't exist (should already exist from previous operations, but just in case)
    if (!fs.existsSync(appDirectory)) {
      fs.mkdirSync(appDirectory, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(appFilePath, appJsxContent);

    return true;
  } catch (error) {
    console.error("Error creating App.jsx file:", error);
    return false;
  }
}
