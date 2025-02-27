// app/json-editor/page.tsx (or /pages/json-editor.tsx in Pages Router)
import dynamic from "next/dynamic";
// import JsonFormatter from "./JsonFormatter";

//  Dynamically import the client component
const PasswordGenerator = dynamic(() => import("./PasswordGenerator"), {
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
  title: "Free Secure Password Generator - Create Strong & Random Passwords",
  description:
    "Generate strong, random, and secure passwords instantly with our free password generator. Protect your accounts with complex and unguessable passwords.",
  openGraph: {
    title: "Free Secure Password Generator - Create Strong & Random Passwords",
    description:
      "Easily generate strong and random passwords to keep your accounts safe. Try our free password generator now!",
    type: "website",
    url: "https://nexonware.com/password-generator",
    images: [
      {
        url: "https://nexonware.com/assets/password-generator.png",
        width: 1200,
        height: 630,
        alt: "Password Generator Preview",
      },
    ],
  },
  keywords: [
    // Primary keywords
    "password generator",
    "free password creator",
    "random password generator",
    "strong password generator",
    "secure password generator",

    // Secondary keywords
    "pw generator",
    "suggest password",
    "random password gen",
    "create random password",
  ],
};

export default function LoremIpsumPage() {
  return (
    <>
      <div className="bg-[#f5f5f5] overflow:auto flex justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <PasswordGenerator />
      </div>
    </>
  );
}
