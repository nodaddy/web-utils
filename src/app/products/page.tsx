"use client";

import { useState, Suspense } from "react";
import { products } from "@/products";
import { allUtilities } from "@/Applications";
import Link from "next/link";
import {
  Icon,
  PackageSearch,
  ShoppingCart,
  Sparkle,
  Sparkles,
  Stars,
} from "lucide-react";
import { useAppContext } from "@/Context/AppContext";

// Cart context to share cart state between components
function ProductsContent() {
  // Get authentication state from context
  const { isAuthenticated } = useAppContext();

  // Cart functionality
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((id) => id !== productId));
  };

  const isInCart = (productId: string) => {
    return cart.includes(productId);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Large grayish shapes for corporate look */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Bottom left oblique rectangle */}
        <div className="absolute -bottom-[600px] -left-[600px] w-[2000px] h-[1200px] bg-gray-100 transform rotate-6"></div>

        {/* Top left oblique rectangle */}
        <div className="absolute -top-[700px] -left-[400px] w-[1800px] h-[1000px] bg-blue-50 transform -rotate-12"></div>
      </div>

      <div className="relative z-10 pt-16">
        <ProductsSection addToCart={addToCart} isInCart={isInCart} />
        <WebUtilitiesSection authenticated={isAuthenticated} />
      </div>
    </div>
  );
}

// Products section component
function ProductsSection({
  addToCart,
  isInCart,
}: {
  addToCart: (id: string) => void;
  isInCart: (id: string) => boolean;
}) {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2 className="flex items-center gap-2 text-2xl text-gray-800 sm:text-3xl font-semibold">
            <PackageSearch className="text-gray-700" /> Our Offerings
          </h2>
          <p className="mt-2 text-xl text-gray-600">
            Premium enterprise solutions for your business needs
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-transparent relative bg-white overflow-hidden rounded-xl transition-all duration-300 p-6"
            >
              <div className="mb-6">
                <div className="flex items-center">
                  {/* {product.icon ? (
                    <img
                      src={product.icon}
                      alt={product.name}
                      className="w-12 h-12 rounded-md mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {product.name.charAt(0)}
                    </div>
                  )} */}
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent break-words line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <p className="mt-4 text-gray-600 line-clamp-3">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bottom-4 left-6 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn more &nbsp; →
                  </a>

                  {/* <button
                    onClick={() => addToCart(product.id)}
                    disabled={isInCart(product.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      isInCart(product.id)
                        ? "bg-green-100 text-green-800 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isInCart(product.id) ? "Added to cart" : "Add to cart"}
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Web utilities section component
function WebUtilitiesSection({ authenticated }: { authenticated: boolean }) {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2 className="flex items-center gap-2 text-xl text-gray-800 sm:text-2xl font-semibold">
            <Sparkles className="text-gray-700" /> Complementary Web Utilities
          </h2>
          {!authenticated ? (
            <p className="mt-4 text-lg text-gray-600">
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800"
              >
                Register
              </Link>{" "}
              your company to get access to the following secure web utilities
              without any additional cost
              <br />
              <sup>*No credit card required</sup>
            </p>
          ) : (
            <p className="mt-4 text-lg text-gray-600">
              You can use the following secure web utilities on a daily basis
              without any additional cost
            </p>
          )}
        </div>

        <div className="mt-12">
          {Object.entries(allUtilities).map(
            ([category, tools]) =>
              tools.length > 0 && (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {tools.map((tool) => (
                      <Link
                        href={`/${tool.id}`}
                        key={tool.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-start border border-gray-100"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <span>{tool.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">
                            {tool.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Oblique rectangle for loading state */}
        <div className="absolute -top-[500px] -right-[500px] w-[2000px] h-[1200px] bg-gray-50 transform rotate-12"></div>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-md relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-center">Loading products...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
