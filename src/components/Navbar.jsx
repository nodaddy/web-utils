"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAppContext } from "@/Context/AppContext";
import { HelpCircle, Info, PackageSearch } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, isAuthenticated, logout } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Nexonware
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4 text-sm md:text-base">
            <Link
              href="/products"
              className="flex items-center gap-2 block px-3 py-2 rounded-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PackageSearch /> Products
            </Link>

            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right side buttons */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              {/* <ThemeToggle /> */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
