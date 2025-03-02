"use client";
import { allUtilities } from "../Applications";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

export default function Home() {
  // State for search, filters, and displayed utilities
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayedUtilities, setDisplayedUtilities] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(() => ["All", ...Object.keys(allUtilities)], []);

  // Handle scroll events for dynamic header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update displayed utilities when search or filter changes
  useEffect(() => {
    const utilLib = document.getElementById("util-lib");
    if (utilLib) utilLib.style.display = "none";

    // Efficient approach to create utilities array
    let utilities = [];

    if (activeCategory === "All") {
      utilities = Object.entries(allUtilities).flatMap(([category, items]) =>
        items.map((item) => ({ ...item, category }))
      );
    } else {
      utilities =
        allUtilities[activeCategory]?.map((item) => ({
          ...item,
          category: activeCategory,
        })) || [];
    }

    // Filter by search term
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch !== "") {
      utilities = utilities.filter((item) =>
        item.title.toLowerCase().includes(normalizedSearch)
      );
    }

    setDisplayedUtilities(utilities);

    return () => {
      if (utilLib) utilLib.style.display = "block";
    };
  }, [searchTerm, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-md py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="group relative flex items-center">
              <span className="text-white font-bold text-2xl tracking-tighter">
                <span className="text-cyan-400">NEXON</span>WARE
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full duration-300"></span>
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link
                href="#utilities"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Utilities
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* <div className="hidden md:block">
              <button className="bg-black border border-gray-800 px-5 py-2 rounded-full text-white hover:bg-gray-900 transition-colors">
                Sign In
              </button>
            </div> */}

            <button
              className="md:hidden text-white focus:outline-none"
              aria-label="Menu"
            >
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
        </div>
      </header>

      <section className="pt-24 pb-20 bg-gray-900 text-white relative overflow-hidden">
        {/* Abstract geometric shapes for premium feel */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-cyan-900 blur-xl"></div>
          <div className="absolute bottom-20 left-[5%] w-72 h-72 rounded-full bg-indigo-800 blur-xl"></div>
          <div className="absolute top-[40%] left-[50%] w-96 h-96 rounded-full bg-purple-900 blur-3xl"></div>
          <div className="absolute -bottom-20 right-[20%] w-80 h-80 bg-cyan-800 rounded-full blur-2xl opacity-20"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTIwM0QiIGQ9Ik0zNiAxOGgtMnYyNGgyeiIvPjxwYXRoIGZpbGw9IiMxQTIwM0QiIGQ9Ik0yIDE4aDU2djJIMnoiLz48L2c+PC9zdmc+')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-gray-800 text-cyan-400 text-xs uppercase tracking-wider rounded-full mb-6">
              Digital Utilities
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Simpler and Safer{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                Digital Experience
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover our meticulously crafted suite of digital utilities
              designed to elevate your online workflow and redefine
              productivity.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#utilities"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                Explore Collection
              </a>
              <a
                href="#"
                className="px-8 py-4 bg-gray-800 text-white rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">100+</div>
              <div className="text-gray-400 text-sm">Utilities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">150K+</div>
              <div className="text-gray-400 text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      <main id="utilities" className="flex-grow bg-white pt-16 pb-24">
        <div className="container mx-auto px-6">
          <section className="relative">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-cyan-600 text-sm font-semibold tracking-wider uppercase">
                  Our Collection
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  Premium Utilities
                </h2>
              </div>

              {/* Search bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search utilities..."
                  className="w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 pl-12 shadow-sm transition-shadow text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
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
            </div>

            {/* Categories */}
            <div className="mb-10 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Display utilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedUtilities.length > 0 ? (
                displayedUtilities.map((util) => (
                  <Link
                    key={util.id}
                    href={`/${util.id}`}
                    target="_blank"
                    className="group"
                  >
                    <div
                      align="center"
                      className="relative overflow-hidden bg-white rounded-[20px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-4"
                    >
                      {/* Utility icon */}
                      <div className="mb-4 text-2xl bg-gray-50 p-4 rounded-full inline-flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-transform duration-300 text-cyan-600 group-hover:text-cyan-500 group-hover:bg-cyan-50">
                        {util.icon}
                      </div>

                      {/* Utility title and description */}
                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg group-hover:text-cyan-600 transition-colors">
                          {util.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {util.description}
                        </p>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rotate-45 translate-x-8 -translate-y-8 group-hover:bg-cyan-50 transition-colors"></div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No utilities found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any utilities matching your search
                    criteria. Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Testimonials section */}
          <section className="my-24 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-cyan-600 text-sm font-semibold tracking-wider uppercase">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Trusted by professionals
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Sarah Johnson
                    </h4>
                    <p className="text-sm text-gray-500">Product Designer</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "These utilities have completely transformed my workflow. The
                  attention to detail is remarkable."
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Mark Stevens
                    </h4>
                    <p className="text-sm text-gray-500">Developer</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "I've tried dozens of utility suites, but NEXONWARE stands
                  apart with its performance and elegant design."
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Lisa Chen</h4>
                    <p className="text-sm text-gray-500">Marketing Lead</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The intuitive interface and powerful features make NEXONWARE
                  an essential part of my daily toolkit."
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="text-white font-bold text-2xl tracking-tighter mb-6">
                <span className="text-cyan-400">NEX</span>ONWARE
              </div>
              <p className="text-gray-400 mb-6">
                Premium digital utilities crafted to transform your online
                experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    File Converters
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Text Editors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Data Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Code Utilities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Image Processing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Stay up to date with the latest utilities and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 w-full"
                />
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-r-lg transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NEXONWARE. All rights reserved.
            </p>

            <div className="flex items-center mt-4 md:mt-0">
              <span className="inline-flex items-center justify-center h-8 w-8">
                <svg
                  className="h-5 w-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-xs text-gray-500">Servers operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
