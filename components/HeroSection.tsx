"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="mt-[50px] relative w-full h-[500px] md:h-[600px] flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg" // Replace with any TMDB or custom image
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-75"
        />

      </div>

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Animated Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        >
          Welcome to <span className="text-red-600">MetaMoviex</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
        >
          Millions of movies, TV shows, and people to discover. <br />
          Dive into the world of entertainment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 transition-colors px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
          >
            <Link href={'/movie'}>
            Explore Now</Link>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
