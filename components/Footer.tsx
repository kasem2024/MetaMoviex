'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import logo from '@/public/assets/logoicon.png'
export default function Footer() {
  // Example dynamic user (replace with your auth context / user session)
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you’d fetch from session or context
    setUsername("Alex"); // Example user
  }, []);

  return (
    <footer className="bg-zinc-950 text-gray-300 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-4 sm:grid-cols-2">
        {/* Logo + Welcome */}
        <div>
          <div className="flex items-center gap-3 mb-4">
                <Link
          href={'/'} 
          className='bg-red-600 p-[2px] rounded-2xl overflow-hidden'>
            <Image src={logo} alt="img" width={50} height={50} />
          </Link>
            <h2 className="text-xl font-bold text-white">MetaMovieX</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your personalized gateway to movies, TV, and people who make them.  
          </p>
          {username && (
            <p className="mt-4 text-sm text-gray-200">
              👋 Welcome back, <span className="font-semibold text-white">{username}</span>!
            </p>
          )}
        </div>

        {/* The Basics */}
        <div>
          <h3 className="text-white font-semibold mb-3">The Basics</h3>
          <ul className="space-y-2 text-sm">
            {["About TMDB", "Contact Us", "API Documentation", "API for Business", "System Status"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Get Involved */}
        <div>
          <h3 className="text-white font-semibold mb-3">Get Involved</h3>
          <ul className="space-y-2 text-sm">
            {["Contribution Bible", "Add New Movie", "Add New TV Show"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-red-500 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community + Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Community</h3>
          <ul className="space-y-2 text-sm mb-6">
            {["Guidelines", "Discussions", "Leaderboard", "Support Forums"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>

          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            {["Terms of Use", "API Terms of Use", "Privacy Policy", "DMCA Policy"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-gray-500 text-xs">
        <p>
          © {new Date().getFullYear()} MetaMovieX. Built with ❤️ using TMDB API.  
          <br className="sm:hidden" /> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
