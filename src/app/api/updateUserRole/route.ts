import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
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
        { error: "Unauthorized: Only admins can update user roles" },
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

    // Parse the request body
    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    // Prevent admins from updating their own role
    if (userId === decodedToken.uid) {
      return NextResponse.json(
        { error: "Admins cannot update their own role" },
        { status: 403 }
      );
    }

    // Validate the role
    const validRoles = ["admin", "manager", "analyst"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: admin, manager, analyst" },
        { status: 400 }
      );
    }

    // Get the target user
    const userRecord = await admin.auth().getUser(userId);

    // Check if the target user has the same companyId as the admin
    const userCustomClaims = userRecord.customClaims || {};
    const userCompanyId = userCustomClaims.companyId;

    if (userCompanyId !== adminCompanyId) {
      return NextResponse.json(
        { error: "Unauthorized: Cannot update users from different companies" },
        { status: 403 }
      );
    }

    // Update the user's role while preserving other custom claims
    await admin.auth().setCustomUserClaims(userId, {
      ...userCustomClaims,
      role: newRole,
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole}`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
