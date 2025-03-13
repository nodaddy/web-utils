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

    // Verify the token and get user claims
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Return the user claims
    return NextResponse.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || "user", // Default to "user" if no role claim exists
      companyId: decodedToken.companyId || null,
    });
  } catch (error) {
    console.error("Error getting user claims:", error);
    return NextResponse.json(
      { error: "Failed to get user claims" },
      { status: 500 }
    );
  }
}
