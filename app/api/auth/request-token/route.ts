import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.themoviedb.org/3/authentication/token/new", {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data); // { request_token, success, expires_at }
}
