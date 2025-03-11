"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600" />

      {/* Decorative circles */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-section relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-white/90 mb-8"
          >
            Join thousands of businesses that trust Nexonware for their digital
            transformation needs. Get started today with our enterprise
            solutions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="auth/register"
              className="bg-white text-primary-600 hover:bg-white/90 font-medium py-2 px-6 rounded-md transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white hover:bg-white/10 font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
