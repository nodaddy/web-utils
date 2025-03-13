"use client";
import { useParams } from "next/navigation";
import RegisterPage from "../../page";
export default function RegisterPageWithProductId() {
  // if user comes from a product page, we need to pass the productId to the register page
  return <RegisterPage />;
}
