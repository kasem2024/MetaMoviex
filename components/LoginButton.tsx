"use client";

import { LogIn } from "lucide-react";

export default function LoginButton() {
  const handleLogin = async () => {
    const res = await fetch("/api/auth/request-token");
    const data = await res.json();

    if (data.success) {
      const requestToken = data.request_token;
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-[#01b4e4] hover:bg-[#032541] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg hover:shadow-[#01b4e4]/40"
    >
      <LogIn size={18} />
      Login with TMDB
    </button>
  );
}
