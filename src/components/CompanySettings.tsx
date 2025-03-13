import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";

interface CompanyData {
  companyId: string;
  companyName: string;
  address?: string;
  phone?: string;
  website?: string;
  industry?: string;
  description?: string;
  logo?: string;
}

interface CompanySettingsProps {
  currentUser: User | null;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ currentUser }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        // Get the current user's ID token
        const idToken = await currentUser.getIdToken(true);

        // Call an API endpoint to get the user's claims including companyId and role
        const claimsResponse = await fetch("/api/getUserClaims", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!claimsResponse.ok) {
          throw new Error("Failed to fetch user claims");
        }

        const claimsData = await claimsResponse.json();

        // Check if user is admin
        setIsAdmin(claimsData.role === "admin");

        if (!claimsData.companyId) {
          throw new Error("User does not have a company ID");
        }

        // Fetch company data
        const companyResponse = await fetch(
          `/api/company?companyId=${claimsData.companyId}`
        );

        if (!companyResponse.ok) {
          throw new Error("Failed to fetch company data");
        }

        const companyResult = await companyResponse.json();

        if (!companyResult.success) {
          throw new Error(
            companyResult.error || "Failed to fetch company data"
          );
        }

        setCompanyData({
          companyId: claimsData.companyId,
          companyName: companyResult.company.companyName || "",
          address: companyResult.company.address || "",
          phone: companyResult.company.phone || "",
          website: companyResult.company.website || "",
          industry: companyResult.company.industry || "",
          description: companyResult.company.description || "",
          logo: companyResult.company.logo || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [currentUser]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyData || !currentUser) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      // Get the current user's ID token
      const idToken = await currentUser.getIdToken(true);

      // Call the API to update company data
      const response = await fetch("/api/updateCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update company information");
      }

      setSuccess("Company information updated successfully");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Loading company information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-red-500">
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Company Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Only administrators can modify company settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Company Settings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your company information
          </p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={companyData?.companyName || ""}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={companyData?.address || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={companyData?.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={companyData?.website || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  value={companyData?.industry || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={companyData?.description || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    updating ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
