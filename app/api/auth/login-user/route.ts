import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  // convert the cookieHeader formatt to arr[string] formatt
  const cookies = Object.fromEntries(
    (cookieHeader || "")
      .split(";")
      .map(c => c.trim().split("=") as [string, string])
  );

  const sessionId = cookies["tmdb_session"];

  if (!sessionId) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const res = await fetch(`https://api.themoviedb.org/3/account?session_id=${sessionId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  const account = await res.json();
  return NextResponse.json(account);
}
