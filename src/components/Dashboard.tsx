import ProductsPage from "@/app/products/page";
import React, { useState, useEffect } from "react";
import UserManagement from "./UserManagement";
import { getAuth, User, getIdTokenResult } from "firebase/auth";
import CompanySettings from "./CompanySettings";

interface PortalCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value?: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  link?: string;
}

interface CompanyProduct {
  id: string;
  name: string;
  description: string;
  link?: string;
  productId: string;
  isPurchased: boolean;
  createdAt: any;
  updatedAt: any;
  trialStartData?: any;
  status?: string;
  url?: string;
}

interface PortalProps {
  userName?: string;
  organization?: string;
  handleLogout?: () => void;
}

const Portal: React.FC<PortalProps> = ({
  userName = "Admin",
  handleLogout,
  organization = "Nexonware",
}) => {
  const [activeSection, setActiveSection] = useState("portal");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companyProducts, setCompanyProducts] = useState<CompanyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the current user on component mount
  useEffect(() => {
    const auth = getAuth();
    let isMounted = true;

    // Only set up the auth state listener if we don't already have a user
    if (!currentUser) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (isMounted) {
          setCurrentUser(user);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Fetch company products when user is available
  useEffect(() => {
    const fetchCompanyProducts = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Get the user's claims which include companyId
        const tokenResult = await getIdTokenResult(currentUser);
        const companyId = tokenResult.claims.companyId;

        if (companyId) {
          // Fetch the company's products
          const response = await fetch(
            `/api/company-products?companyId=${companyId}`
          );
          const data = await response.json();

          if (data.success && data.products) {
            setCompanyProducts(data.products);
          }
        }
      } catch (error) {
        console.error("Error fetching company products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProducts();
  }, [currentUser]);

  // Navigation items
  const navigationItems = [
    {
      id: "portal",
      name: "Portal",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "user-management",
      name: "User Management",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "products",
      name: "Products",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      name: "Settings",
      icon: (
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-2 text-white text-lg font-semibold">
                  <span className="inline-block whitespace-nowrap">
                    {organization}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`${
                      activeSection === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150`}
                  >
                    <div
                      className={`mr-3 ${
                        activeSection === item.id
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
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
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
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
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="relative">
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {userName.charAt(0)}
                    </div>
                    <span className="ml-2 text-gray-700">{userName}</span>
                    <svg
                      className={`ml-1 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div
            className={`${
              activeSection !== "products" ? "py-6" : "mt-[-70px]"
            }`}
          >
            {activeSection !== "products" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeSection === "portal" && "Portal"}
                  {activeSection === "user-management" && "User Management"}
                  {activeSection === "onboard" && "Onboard"}
                  {activeSection === "settings" && "Settings"}
                </h1>
              </div>
            )}
            <div
              className={`max-w-7xl mx-auto ${
                activeSection !== "products" ? "px-4 sm:px-6 md:px-8" : ""
              }`}
            >
              {/* Portal content */}
              {activeSection === "portal" && (
                <div className="py-4">
                  {/* Company Products */}
                  <div className="mt-8">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      Your Products
                    </h2>
                    {loading ? (
                      <div className="mt-4 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : companyProducts.length > 0 ? (
                      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {companyProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white overflow-hidden shadow rounded-lg"
                          >
                            <div className="p-5">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                                  <svg
                                    className="h-6 w-6 text-indigo-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                  <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                      {product.name}
                                    </dt>
                                    <dd>
                                      <div className="text-sm text-gray-900 mt-1">
                                        {product.description}
                                      </div>
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                              <div className="text-sm flex justify-between items-center">
                                <div className="font-medium text-gray-500">
                                  Status:{" "}
                                  <span className="text-green-600">
                                    {product.isPurchased
                                      ? "Purchased"
                                      : "Trial"}
                                  </span>
                                </div>
                                {(product.url || product.link) && (
                                  <a
                                    href={product.url || product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Launch
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                        <p className="text-gray-500">
                          No products available for your company.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Management content */}
              {activeSection === "user-management" && (
                <UserManagement currentUser={currentUser} />
              )}

              {/* Products content */}
              {activeSection === "products" && <ProductsPage />}

              {/* Settings content */}
              {activeSection === "settings" && (
                <div className="py-4">
                  <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Settings
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage system settings and preferences
                      </p>
                    </div>
                  </div>

                  {/* Company Settings */}
                  <CompanySettings currentUser={currentUser} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portal;
