// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Get session from cookie
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get("tmdb_session")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No active session found" }, { status: 400 });
  }

  // Call TMDB API to delete session
  const res = await fetch("https://api.themoviedb.org/3/authentication/session", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  const data = await res.json();

  // Remove local cookie if successful
  if (data.success) {
    (await cookieStore).delete("tmdb_session");
  }

  return NextResponse.json(data);
}
