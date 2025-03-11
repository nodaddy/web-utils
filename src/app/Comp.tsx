"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ProductList from "@/components/ProductList";
import Hero from "@/components/Hero";
import Feature from "@/components/Features";
import CTA from "@/components/CTA";
import { products } from "@/products";

export default function Comp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Set up token refresh interval
  useEffect(() => {
    let tokenRefreshInterval;

    if (user) {
      // Force token refresh every 10 minutes to prevent expiration
      tokenRefreshInterval = setInterval(async () => {
        try {
          // This will refresh the token
          const token = await user.getIdToken(true);
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }, 10 * 60 * 1000); // 10 minutes
    }

    return () => {
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Set user name for display
          setUserName(
            currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "User"
          );

          // Get the user's claims which include companyId
          const tokenResult = await getIdTokenResult(currentUser);
          const companyId = tokenResult.claims.companyId;

          if (companyId) {
            // Fetch the company document
            const response = await fetch(`/api/company?companyId=${companyId}`);
            const data = await response.json();

            if (data.success && data.company) {
              // Filter products based on ownedNexonwareProductIds
              const ownedProductIds =
                data.company.ownedNexonwareProductIds || [];

              // Map products with additional properties
              const filteredProducts = products
                .filter((product) => ownedProductIds.includes(product.id))
                .map((product) => ({
                  ...product,
                  status: product.status || "active",
                  lastAccessed: new Date().toLocaleDateString(),
                }));

              setCompanyProducts(filteredProducts);
            }
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      }

      setAuthChecked(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <ProductList
          products={companyProducts}
          userName={userName}
          organization={user.email?.split("@")[1] || "Nexonware Enterprise"}
        />
      ) : (
        <div>
          <Hero />
          <Feature />
          <CTA />
        </div>
      )}
    </div>
  );
}
