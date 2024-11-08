// app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text px-4 text-center">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to PetPals!
      </motion.h1>

      <p className="text-lg mb-8 max-w-lg">
        PetPals is a virtual pet care experience where you can adopt, nurture, and interact with your own digital pet. Start your journey and make your new pet friend happy!
      </p>

      <Link href="/dashboard">
        <motion.button
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
      </Link>
    </div>
  );
}
