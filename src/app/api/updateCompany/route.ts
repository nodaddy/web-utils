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
        { error: "Unauthorized: Only admins can update company information" },
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
    const {
      companyId,
      companyName,
      address,
      phone,
      website,
      industry,
      description,
      logo,
    } = body;

    // Validate required fields
    if (!companyId || !companyName) {
      return NextResponse.json(
        { error: "Company ID and name are required" },
        { status: 400 }
      );
    }

    // Ensure the admin is updating their own company
    if (companyId !== adminCompanyId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Cannot update information for a different company",
        },
        { status: 403 }
      );
    }

    // Prepare the update data
    const updateData: Record<string, any> = {
      companyName,
      updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    // Add optional fields if they exist
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (industry !== undefined) updateData.industry = industry;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;

    // Update the company document in Firestore
    await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .update(updateData);

    return NextResponse.json({
      success: true,
      message: "Company information updated successfully",
    });
  } catch (error) {
    console.error("Error updating company information:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update company information",
      },
      { status: 500 }
    );
  }
}
