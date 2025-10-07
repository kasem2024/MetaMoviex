"use client";

export default function LoginButton() {
  const handleLogin = async () => {
    const res = await fetch("/api/auth/request-token");
    const data = await res.json();

    if (data.success) {
      const requestToken = data.request_token;
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    }
  };

  return <button onClick={handleLogin}>Login with TMDB</button>;
}
