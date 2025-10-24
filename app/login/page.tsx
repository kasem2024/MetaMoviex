"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LoginButton from "../../components/LoginButton";

const Page = () => {


  return (
    <div className="relative w-screen h-screen bg-zinc-950 overflow-hidden font-sans text-white">
      {/* Background Video or Image */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        src="/videos/cinema-bg.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Image
            src="/assets/metamoviex.png"
            alt="MetaMoviex Logo"
            width={120}
            height={120}
            className="drop-shadow-xl"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
        >
          Welcome to MetaMoviex
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 mb-10 max-w-xl leading-relaxed"
        >
          Your cinematic universe — powered by TMDB. Discover, track, and explore millions of movies and TV shows with stunning detail.
        </motion.p>

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-black/60 p-4 rounded-xl backdrop-blur-md border border-zinc-800 hover:border-[#01b4e4]/50 transition"
        >
          <LoginButton />
        </motion.div>

        {/* Optional footer text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-gray-400 text-sm"
        >
          Looking forward to work together ✨
          <div className="mt-3 text-xs text-zinc-500">
            © {new Date().getFullYear()} MetaMoviex • Powered by TMDB API
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Page;
