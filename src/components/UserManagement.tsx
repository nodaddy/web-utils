import React, { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import admin from "@/lib/firebase-admin";

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  companyId: string;
}

interface UserManagementProps {
  currentUser: User | null;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminCompanyId, setAdminCompanyId] = useState<string | null>(null);
  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>(
    {}
  );
  const [copySuccess, setCopySuccess] = useState(false);

  // Available roles
  const availableRoles = ["admin", "manager", "analyst"];

  // Fetch the current admin's companyId on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!currentUser) return;

      try {
        // Get the current user's ID token
        const idToken = await currentUser.getIdToken(true);

        // Call an API endpoint to get the user's claims including companyId
        const response = await fetch("/api/getUserClaims", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user claims");
        }

        const data = await response.json();
        if (data.companyId) {
          setAdminCompanyId(data.companyId);
        }
      } catch (err) {
        setError("Failed to fetch admin data");
        console.error(err);
      }
    };

    fetchAdminData();
  }, [currentUser]);

  // Handle search for users
  const handleSearch = async () => {
    if (!searchEmail.trim() || !adminCompanyId) return;

    setLoading(true);
    setError(null);

    try {
      // Get the current user's ID token
      const idToken = await currentUser?.getIdToken(true);

      // Call an API endpoint to search for users with the same companyId
      const response = await fetch(
        `/api/searchUsers?email=${encodeURIComponent(searchEmail)}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to search users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!currentUser || !adminCompanyId) return;

    // Set loading state for this specific user
    setUpdatingRoles((prev) => ({ ...prev, [userId]: true }));
    setError(null);

    try {
      // Get the current user's ID token
      const idToken = await currentUser.getIdToken(true);

      // Call an API endpoint to update the user's role
      const response = await fetch("/api/updateUserRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId,
          newRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user role");
      }

      // Update the local state to reflect the change
      setUsers(
        users.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update user role");
      }
      console.error(err);
    } finally {
      // Clear loading state for this specific user
      setUpdatingRoles((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Handle copy invitation link
  const handleCopyInvitationLink = () => {
    if (!adminCompanyId) return;

    const invitationLink = `https://nexonware.com/join/${adminCompanyId}`;
    navigator.clipboard
      .writeText(invitationLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="py-4 space-y-6">
      {/* Company Invitation Link Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Invite Employees
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Share this link with employees to join your company
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5">
          {adminCompanyId ? (
            <div>
              <div className="flex items-center">
                <div className="flex items-center relative">
                  <div className="pl-4 p-3 font-medium shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50">
                    {`https://nexonware.com/join/${adminCompanyId}`}
                  </div>
                </div>
                <button
                  type="button"
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md ${
                    copySuccess
                      ? "text-green-500"
                      : "text-indigo-400 hover:text-indigo-700"
                  }  h-10`}
                  onClick={handleCopyInvitationLink}
                >
                  {copySuccess ? (
                    <>
                      <svg
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    "Copy Link"
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                &nbsp;&nbsp;&nbsp; When employees sign up using this link, they
                will automatically be added to your company.
              </p>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Loading company information...
            </div>
          )}
        </div>
      </div>

      {/* User Management Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Role Management
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Search for users and manage their roles
            </p>
          </div>
        </div>

        {/* Search form */}
        <div className="border-t border-gray-200 px-4 py-5">
          <div className="flex items-center justify-start">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email-search"
                className="pl-10 shadow-sm focus:ring-indigo-500 ring-2 ring-indigo-100 md:w-[400px] focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Search by email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-10"
              onClick={handleSearch}
              disabled={loading || !searchEmail.trim()}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>

        {/* User list */}
        <div className="border-t border-gray-200">
          {users.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.uid} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-indigo-600">
                        {user.email}
                      </div>
                      {user.displayName && (
                        <div className="text-sm text-gray-500">
                          {user.displayName}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">Role:</span>
                      <div className="relative">
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.uid, e.target.value)
                          }
                          disabled={
                            updatingRoles[user.uid] ||
                            currentUser?.uid === user.uid
                          }
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                        {updatingRoles[user.uid] && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <svg
                              className="animate-spin h-4 w-4 text-indigo-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      {currentUser?.uid === user.uid && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-indigo-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                "No users found. Search by email to find users."
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
