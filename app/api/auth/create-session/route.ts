import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing request token" }, { status: 400 });
  }

  const res = await fetch("https://api.themoviedb.org/3/authentication/session/new", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ request_token: token }),
  });

  const data = await res.json();

  // Build a response
  const response = NextResponse.json(data);

  if (data.success && data.session_id) {
    // ✅ Set cookie using response.cookies.set
    response.cookies.set("tmdb_session", data.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}
