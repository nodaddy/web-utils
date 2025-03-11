"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950" />

      {/* Content */}
      <div className="container-section relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6"
          >
            Enterprise Arsenal, Startup Affordability
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Enterprise-grade tools and solutions to help your business grow,
            scale, and succeed in the digital age at a fraction of the cost of
            traditional software.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="auth/register" className="btn-primary">
              Get Started
            </Link>
            <Link href="/solutions" className="btn-outline">
              Explore Solutions
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16"
          >
            <div>
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                1000+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise Clients
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                99.9%
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Uptime</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Support</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
