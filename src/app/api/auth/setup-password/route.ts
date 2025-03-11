import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the token from Firestore
    const companySnapshot = await admin
      .firestore()
      .collection("companies")
      .where("verificationToken", "==", token)
      .where("adminEmail", "==", email)
      .get();

    if (companySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const companyDoc = companySnapshot.docs[0];
    const company = companyDoc.data();

    // Check if token is expired
    const verificationExpiry = company.verificationExpiry.toDate();
    if (verificationExpiry < new Date()) {
      return NextResponse.json(
        { success: false, error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Update password
    await admin.auth().updateUser(userRecord.uid, {
      password: password,
      emailVerified: true,
    });

    // Update company status to active
    await companyDoc.ref.update({
      status: "active",
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Password setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to setup password",
      },
      { status: 400 }
    );
  }
}
