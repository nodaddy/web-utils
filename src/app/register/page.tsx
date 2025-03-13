"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

// Form validation schema would normally use zod/yup - simplified for demo
type RegisterFormData = {
  companyName: string;
  adminName: string;
  adminEmail: string;
  productId?: string;
};

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData | null>(null);
  const router = useRouter();
  const params = useParams();

  const productId = params.productId as string;
  const productName = params.productName as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Make actual API call to register endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: data.companyName,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          productId: productId || null, // Include productId if available
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setFormData(data);
      setCurrentStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const isStepValid = await trigger();

    if (isStepValid) {
      const data = getValues();
      setFormData(data);

      if (currentStep === 1) {
        onSubmit(data);
      } else if (currentStep === 2) {
        setCurrentStep(3);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 w-full max-w-md z-10 bg-white/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <label
                htmlFor="companyName"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Company Name<span className="text-indigo-600">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v-4H5v4h10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  {...register("companyName", {
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "Company name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="py-4 pl-10 block w-full text-lg rounded-lg border-0 ring-1 ring-indigo-200 bg-white focus:ring-indigo-500 placeholder-gray-400 text-gray-900"
                  placeholder="Enter your company name"
                />
              </div>
              {errors.companyName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </motion.div>

            {/* Admin Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
            >
              <div>
                <label
                  htmlFor="adminName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Name<span className="text-indigo-600">*</span>
                </label>
                <input
                  {...register("adminName", {
                    required: "Admin name is required",
                    minLength: {
                      value: 2,
                      message: "Admin name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="ring-1 ring-gray-200 px-3 py-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Enter admin's full name"
                />
                {errors.adminName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.adminName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Email<span className="text-indigo-600">*</span>
                </label>
                <input
                  {...register("adminEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  type="email"
                  className="ring-1 ring-gray-200 px-3 py-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Enter admin's email address"
                />
                {errors.adminEmail && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.adminEmail.message}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4"
            >
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center z-10 w-full max-w-md bg-white/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.7, 1] }}
                className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="h-10 w-10 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Verification email sent!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-600 mb-6 max-w-md"
              >
                We've sent a verification email to{" "}
                <span className="font-medium text-indigo-600">
                  {formData?.adminEmail}
                </span>
                . Please check your inbox and verify your email address to
                continue.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md"
              >
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tip:</span> If you don't see the
                  email in your inbox, please check your spam or junk folder.
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  router.push("/signin");
                }}
                className="w-full md:w-auto flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Add CSS for background grid pattern
  const gridPatternStyle = `
    .bg-grid-pattern {
      background-image: 
        linear-gradient(to right, rgba(209, 213, 219, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(209, 213, 219, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
    }
  `;

  return (
    <div className="min-h-screen flex flex-col justify-center relative bg-gray-50">
      <style>{gridPatternStyle}</style>

      <div className="relative z-10 flex flex-col items-center ">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-500 mb-4">
          Registration
        </h1>
        <p className="text-md text-gray-600">
          Kindly register to get access to {productName}
        </p>
        <br />

        <div className="max-w-5xl w-full mb-12">
          <div className="flex flex-col items-center py-2 px-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex justify-center"
            >
              {renderStep()}
            </form>

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center mt-8"
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm"
        >
          © {new Date().getFullYear()} Nexonware • All data stays in your
          browser
        </motion.div>
      </div>
    </div>
  );
}
