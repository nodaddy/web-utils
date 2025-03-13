import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Fetch the company's products from the nexonwareProducts subcollection
    const productsSnapshot = await admin
      .firestore()
      .collection("companies")
      .doc(companyId)
      .collection("nexonwareProducts")
      .get();

    if (productsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    // Convert the products snapshot to an array of product objects
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching company products:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch company products",
      },
      { status: 500 }
    );
  }
}
