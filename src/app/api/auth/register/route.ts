import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import { generateCompanyVerificationToken } from "./tokens";
import crypto from "crypto";
import { sendCompanyRegistrationEmail } from "./nodemailer";

export async function POST(request: Request) {
  try {
    const { inviteCode, companyName, adminName, adminEmail } =
      await request.json();

    // Check if invite code exists and is valid
    const inviteSnapshot = await admin
      .firestore()
      .collection("invites")
      .where("code", "==", inviteCode)
      .where("status", "==", "active")
      .where("allowedDomains", "array-contains", adminEmail.split("@")[1])
      .get();

    if (inviteSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Invalid invite code" },
        { status: 400 }
      );
    }

    // The verification token is generated to uniquely identify the company registration process for the admin email.
    const verificationToken = generateCompanyVerificationToken(
      crypto.randomBytes(16).toString("hex"),
      adminEmail
    );
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hour expiry

    const tempPassword = crypto.randomBytes(16).toString("hex");

    // Create user in Firebase Authentication with email verification
    const userRecord = await admin.auth().createUser({
      email: adminEmail,
      password: tempPassword,
      displayName: adminName,
      emailVerified: false,
    });

    // Generate password reset link (this will be used for initial password setup)
    const passwordLink = await admin
      .auth()
      .generatePasswordResetLink(adminEmail);

    // Create company document in Firestore
    const companyDoc = await admin
      .firestore()
      .collection("companies")
      .add({
        companyName,
        adminId: userRecord.uid,
        adminEmail,
        adminName,
        emailDomains: adminEmail.split("@")[1], // Extracting domain from email
        inviteCode,
        verificationToken: verificationToken,
        verificationExpiry: verificationExpiry, // Assuming this will be set elsewhere
        status: "pending", // pending, active, suspended
        createdAt: new Date(),
        OwnedNexonwareProductIds: [],
        updatedAt: new Date(),
      });

    // Generate verification link
    const verificationLink = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/auth/setup-password?token=${verificationToken}&email=${encodeURIComponent(
      adminEmail
    )}`;

    console.log(`Verification link for ${adminEmail}: ${verificationLink}`);

    // Set custom claims for admin user
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: "admin",
      companyId: companyDoc.id,
    });

    // Delete the used invite code
    const inviteDoc = inviteSnapshot.docs[0];
    await inviteDoc.ref.update({
      status: "used",
      updatedAt: new Date(),
    });

    const emailSent = await sendCompanyRegistrationEmail(
      adminEmail,
      verificationLink,
      companyName,
      adminName
    );

    return NextResponse.json({
      success: true,
      message:
        "Company registered successfully. Please check your email to set your password.",
      companyId: userRecord.uid,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to register company",
      },
      { status: 400 }
    );
  }
}
