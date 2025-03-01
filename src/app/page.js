"use client";
import { allUtilities } from "../Applications";
// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  // State for search, filters, and displayed utilities
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayedUtilities, setDisplayedUtilities] = useState([]);
  const categories = ["All", ...Object.keys(allUtilities)];

  // Update displayed utilities when search or filter changes
  useEffect(() => {
    document.getElementById("util-lib").style.display = "none";
    // Convert all utilities to a flat array for easier filtering
    let utilities = [];

    if (activeCategory === "All") {
      // Get all utilities from all categories
      Object.entries(allUtilities).forEach(([category, items]) => {
        utilities = [
          ...utilities,
          ...items.map((item) => ({ ...item, category })),
        ];
      });
    } else {
      // Get utilities only from the selected category
      utilities = allUtilities[activeCategory].map((item) => ({
        ...item,
        category: activeCategory,
      }));
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      utilities = utilities.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayedUtilities(utilities);

    return () => {
      document.getElementById("util-lib").style.display = "block";
    };
  }, [searchTerm, activeCategory]);

  return (
    <div className="flex flex-col">
      <button
        className="text-black-800 hover:text-blue-800 text-md absolute top-0"
        onClick={() => {
          debugSeoGenerator();
        }}
      >
        Debug
      </button>
      <Head>
        <title>NEXONWARE - Simplifying Your Digital Life</title>
        <meta
          name="description"
          content="Web utilities to simplify your digital life"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center mb-6 mt-2">
            <Link href="/" className="text-2xl font-bold">
              NEXONWARE
            </Link>
            <div className="hidden md:flex space-x-6">
              {/* <Link
                href="/blog"
                className="hover:opacity-80 transition-opacity"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="hover:opacity-80 transition-opacity"
              >
                About Us
              </Link> */}
            </div>
            <button className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </nav>

          <div className="text-center py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Simplifying Your Digital Life
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Discover our collection of powerful web utilities designed to make
              your online experience smoother, faster, and more productive.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-10 pb-16">
        <div className="container mx-auto px-4">
          <section id="utilities" className="rounded-lg ">
            <h2 className="text-2xl font-bold mb-6 text-gray-600">
              🚀 &nbsp;Explore Our Web Utilities
            </h2>

            {/* Search and filter bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search utilities..."
                  className="text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Display utilities */}
            <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1 mt-11">
              {displayedUtilities.length > 0 ? (
                displayedUtilities.map((util) => (
                  <div key={util.id} className="py-1 my-2">
                    <Link
                      href={`/${util.id}`}
                      target="_blank"
                      className="flex items-end group gap-1"
                    >
                      {/* Utility icon */}
                      <div className="mr-1.5 text-2xl text-gray-400 border bg-gray-200 px-2 py-1 rounded-lg">
                        {util.icon}
                      </div>

                      {/* Utility title and description */}
                      <div style={{ lineHeight: "1rem" }}>
                        <h3 className="text-gray-800 font-lg group-hover:text-blue-600 transition-colors">
                          {util.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {util.description}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500">
                  No utilities found matching your search. Try different
                  keywords or filters.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* <footer className="bg-gray-900 text-white mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-3">NEXONWARE</h3>
              <p className="text-gray-400">
                Simplifying Your Digital Life with powerful web utilities and
                tools that enhance productivity and streamline your online
                experience.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Legal</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Join our team
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-6 mt-6 border-t border-gray-800">
            <p>
              &copy; {new Date().getFullYear()} NEXONWARE. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
