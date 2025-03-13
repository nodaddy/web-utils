// I see the logic to set up claims i swritten two times in theis file, why two times?
// The logic to set up claims is written twice because it handles two different scenarios:
// When a new user is created, custom claims are set for that user.
// When an existing user is found (who already exists), their claims are updated to reflect the new company association.
// This ensures that both new and existing users have the correct claims based on their status.

import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

// Interface for the employee invitation payload
interface EmployeeInvitationPayload {
  email: string;
  companyId: string;
  companyName: string;
  token: string;
  expires: number;
}

export async function POST(request: Request) {
  try {
    console.log("Starting setup-employee-password process");

    const { invitationData, password } = await request.json();
    console.log("Received payload with email:", invitationData?.email);

    if (!invitationData || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = invitationData as EmployeeInvitationPayload;

    // Validate the payload
    if (!payload.email || !payload.companyId || !payload.token) {
      console.log("Invalid invitation data:", JSON.stringify(payload));
      return NextResponse.json(
        { success: false, error: "Invalid invitation data" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (payload.expires < Date.now()) {
      console.log(
        "Invitation expired. Expires:",
        new Date(payload.expires).toISOString()
      );
      return NextResponse.json(
        { success: false, error: "Invitation has expired" },
        { status: 400 }
      );
    }

    // Check if the company exists
    console.log("Checking if company exists:", payload.companyId);
    try {
      const companyDoc = await admin
        .firestore()
        .collection("companies")
        .doc(payload.companyId)
        .get();

      if (!companyDoc.exists) {
        console.log("Company not found:", payload.companyId);
        return NextResponse.json(
          { success: false, error: "Company not found" },
          { status: 404 }
        );
      }
      console.log("Company found:", payload.companyId);
    } catch (companyError) {
      console.error("Error checking company:", companyError);
      return NextResponse.json(
        { success: false, error: "Failed to verify company information" },
        { status: 500 }
      );
    }

    // Create a new user directly without checking if they exist first
    console.log("Creating new user with email:", payload.email);
    try {
      // Try to create the user
      const userRecord = await admin.auth().createUser({
        email: payload.email,
        password: password,
        emailVerified: true, // Email is verified since they clicked the link
      });

      console.log("User created successfully:", userRecord.uid);

      // Set custom claims for the new user
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        companyId: payload.companyId,
        role: "", // Default role for employees
      });

      console.log("Custom claims set for user:", userRecord.uid);

      return NextResponse.json({
        success: true,
        message: "Account created successfully. You can now sign in.",
      });
    } catch (createError: any) {
      console.error("Error creating user:", createError);

      // If the error is that the user already exists, try to update them instead
      if (
        createError.code === "auth/email-already-exists" ||
        (createError.message &&
          createError.message.includes("auth/email-already-exists"))
      ) {
        console.log(
          "User already exists. Attempting to update:",
          payload.email
        );

        try {
          // Get the existing user
          const existingUser = await admin.auth().getUserByEmail(payload.email);
          console.log("Found existing user:", existingUser.uid);

          // Update the user's password and email verification status
          await admin.auth().updateUser(existingUser.uid, {
            password: password,
            emailVerified: true,
          });
          console.log("Updated user password:", existingUser.uid);

          // Get current custom claims
          const userCustomClaims = existingUser.customClaims || {};

          // Check if user already belongs to a different company
          if (
            userCustomClaims.companyId &&
            userCustomClaims.companyId !== payload.companyId
          ) {
            console.log(
              "User already belongs to a different company:",
              userCustomClaims.companyId
            );
            return NextResponse.json(
              {
                success: false,
                error: "User already belongs to a different company",
              },
              { status: 400 }
            );
          }

          // Set custom claims for the user
          await admin.auth().setCustomUserClaims(existingUser.uid, {
            ...userCustomClaims,
            companyId: payload.companyId,
            role: "", // Default role for employees
          });
          console.log("Updated custom claims for user:", existingUser.uid);

          return NextResponse.json({
            success: true,
            message: "Account updated successfully. You can now sign in.",
          });
        } catch (updateError) {
          console.error("Error updating existing user:", updateError);
          return NextResponse.json(
            {
              success: false,
              error:
                "Failed to update existing user account. Please try again.",
            },
            { status: 500 }
          );
        }
      }

      // For any other error, return it to the client
      return NextResponse.json(
        {
          success: false,
          error:
            createError.message ||
            "Failed to create user account. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in setup-employee-password:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to setup password",
      },
      { status: 500 }
    );
  }
}
