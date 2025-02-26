"use client";
// components/Navbar.jsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/Context/AppContext";
import { usePathname } from "next/navigation";
import { logGAEvent } from "@/app/googleAnalytics/gaEvents";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { tool } = useAppContext();
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    pathname !== "/" && (
      <nav className="bg-slate-900 text-white py-3 px-6 shadow-md fixed w-full top-0 z-50">
        <div className="mx-auto flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center text-2xl text-blue-400">
              {tool || "Nexonware"}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Solutions Dropdown */}
            {/*<div className="relative group">
            <button
              className="flex items-center hover:text-blue-400 transition-colors"
              onClick={toggleDropdown}
            >
              Solutions <span className="ml-1">▼</span>
            </button>

            <div
              className={`absolute left-0 mt-2 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                isDropdownOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              }`}
            >
              <div className="py-1">
                <Link
                  href="/solutions/enterprise"
                  className="block px-4 py-2 text-sm hover:bg-slate-700 hover:text-blue-400"
                >
                  Enterprise
                </Link>
                <Link
                  href="/solutions/small-business"
                  className="block px-4 py-2 text-sm hover:bg-slate-700 hover:text-blue-400"
                >
                  Small Business
                </Link>
                <Link
                  href="/solutions/developers"
                  className="block px-4 py-2 text-sm hover:bg-slate-700 hover:text-blue-400"
                >
                  Developers
                </Link>
              </div>
            </div> 
          </div>*/}
            {/* if window location is exactly nexonware.com */}
            <div
              onClick={() => {
                alert(
                  "Want something changed? Email your request to neeleshsharma351@gmail.com"
                );
                logGAEvent("click_give_feedback");
              }}
              className="hover:text-blue-400 transition-colors"
            >
              Give Feedback
            </div>
            <a
              href="https://www.buymeacoffee.com/neensta"
              onClick={() => logGAEvent("click_buy_me_a_coffee")}
              target="_blank"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                style={{ height: "35px" }}
              />
            </a>
          </div>
          {/* CTA Buttons */}
          {/* <div className="hidden md:flex items-center space-x-4"></div> */}

          {/* Mobile Menu Button (hidden on desktop) */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <span className="block w-6 h-px bg-white mb-1"></span>
              <span className="block w-6 h-px bg-white mb-1"></span>
              <span className="block w-6 h-px bg-white"></span>
            </button>
          </div>
        </div>
      </nav>
    )
  );
};

export default Navbar;
