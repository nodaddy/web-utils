"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Interface for the decoded payload
interface RegistrationPayload {
  companyName: string;
  adminName: string;
  adminEmail: string;
  token: string;
  expires: number;
}

// Wrapper component that uses searchParams
function SetupPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [decodedData, setDecodedData] = useState<RegistrationPayload | null>(
    null
  );
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const encodedData = searchParams.get("data");

  useEffect(() => {
    if (encodedData) {
      try {
        const decoded = JSON.parse(
          Buffer.from(encodedData, "base64").toString()
        ) as RegistrationPayload;

        // Check if the token is expired
        if (decoded.expires < Date.now()) {
          setIsExpired(true);
          setError(
            "This verification link has expired. Please register again."
          );
        } else {
          setDecodedData(decoded);
        }
      } catch (err) {
        setError("Invalid verification link. Please try registering again.");
      }
    }
  }, [encodedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!decodedData) {
      setError("Invalid registration data");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationData: decodedData,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to login page on success
      router.push(
        "/signin?message=Account created successfully. You can now sign in."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to setup password");
    } finally {
      setLoading(false);
    }
  };

  if (!encodedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600">Invalid verification link</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600">This verification link has expired</p>
          <p className="mt-4">
            Please{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              register again
            </a>{" "}
            to receive a new verification link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Setup Your Password
        </h2>
        {decodedData && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
            <p>
              Creating account for: <strong>{decodedData.adminEmail}</strong>
            </p>
            <p>
              Company: <strong>{decodedData.companyName}</strong>
            </p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !decodedData}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading || !decodedData ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Setting up..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-center">Loading...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SetupPassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SetupPasswordForm />
    </Suspense>
  );
}
