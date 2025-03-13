import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split("Bearer ")[1];

    // Verify the token and get admin user claims
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if the user is an admin
    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Only admins can search users" },
        { status: 403 }
      );
    }

    // Get the admin's companyId
    const adminCompanyId = decodedToken.companyId;
    if (!adminCompanyId) {
      return NextResponse.json(
        { error: "Admin does not have a company ID" },
        { status: 400 }
      );
    }

    // Get the search email from query parameters
    const url = new URL(req.url);
    const searchEmail = url.searchParams.get("email");

    if (!searchEmail) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Search for users with the provided email pattern and the same companyId
    // Note: Firebase Admin SDK doesn't support direct filtering by custom claims in list users
    // So we need to fetch users and filter them manually

    // Get all users (with pagination if needed for large datasets)
    const listUsersResult = await admin.auth().listUsers(1000);

    // Filter users by email and companyId
    const filteredUsers = listUsersResult.users
      .filter((user) => {
        // Check if the user's email contains the search term
        const emailMatch =
          user.email &&
          user.email.toLowerCase().includes(searchEmail.toLowerCase());

        // Check if the user has the same companyId as the admin
        const customClaims = user.customClaims || {};
        const userCompanyId = customClaims.companyId;

        return emailMatch && userCompanyId === adminCompanyId;
      })
      .map((user) => {
        const customClaims = user.customClaims || {};
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: customClaims.role || "user",
          companyId: customClaims.companyId,
        };
      });

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
