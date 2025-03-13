"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Dashboard from "../components/Dashboard";
import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import { products } from "@/products";

export default function Comp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("Nexonware Solutions");

  // Set up token refresh interval
  useEffect(() => {
    let tokenRefreshInterval;

    if (user) {
      // Force token refresh every 30 minutes instead of 10 to reduce unnecessary refreshes
      tokenRefreshInterval = setInterval(async () => {
        try {
          // This will refresh the token
          const token = await user.getIdToken(true);
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }, 30 * 60 * 1000); // 30 minutes
    }

    return () => {
      if (tokenRefreshInterval) clearInterval(tokenRefreshInterval);
    };
  }, [user]);

  // Single authentication effect to prevent multiple auth state changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

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

          if (companyId && isMounted) {
            // Fetch the company document
            const response = await fetch(`/api/company?companyId=${companyId}`);
            const data = await response.json();

            if (data.success && data.company && isMounted) {
              // Set company name from the company data
              if (data.company.companyName && data.company.companyName !== "") {
                setCompanyName(data.company.companyName);
              }

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

      if (isMounted) {
        setAuthChecked(true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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
        <Dashboard
          handleLogout={handleLogout}
          userName={userName}
          organization={companyName}
        />
      ) : (
        <>
          <Hero />
          <CTA />
        </>
      )}
    </div>
  );
}
