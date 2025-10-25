'use client';

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

type Contributor = {
  id: number;
  username: string;
  avatar?: string | null;
  total_edits: number;
  weekly_edits: number;
};

const timeframes = [
  { key: "all_time", label: "All Time Edits" },
  { key: "this_week", label: "Edits This Week" },
];

export default function LeaderBoard() {
  const [timeframe, setTimeframe] = useState<"all_time" | "this_week">("all_time");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // 🔹 Replace this with your API route or mock JSON
        const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
        const data = await res.json();
        setContributors(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [timeframe]);

  // If you don't have an API yet, use fallback mock data
  useEffect(() => {
    if (contributors.length === 0) {
      setContributors([
        { id: 1, username: "enterpr1se", total_edits: 1589251, weekly_edits: 77775 },
        { id: 2, username: "Shei", total_edits: 2163488, weekly_edits: 14391 },
        { id: 3, username: "Samara", total_edits: 4227532, weekly_edits: 14368 },
        { id: 4, username: "sunnybird21", total_edits: 16872, weekly_edits: 10774 },
        { id: 5, username: "RuiZafon", total_edits: 1671416, weekly_edits: 5998 },
        { id: 6, username: "h345407561", total_edits: 10055, weekly_edits: 5570 },
        { id: 7, username: "strong_style", total_edits: 88192, weekly_edits: 5535 },
        { id: 8, username: "chkchkboom", total_edits: 285053, weekly_edits: 5128 },
        { id: 9, username: "marack99", total_edits: 244177, weekly_edits: 5058 },
        { id: 10, username: "HeelerCattle86", total_edits: 251104, weekly_edits: 4472 },
      ]);
    }
  }, [contributors.length]);

  return (
    <section className="w-full bg-zinc-950 text-white py-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Trophy className="text-yellow-400 w-7 h-7" />
          <h2 className="text-3xl font-bold">Leaderboard</h2>
        </div>

        <div className="flex gap-2">
          {timeframes.map((t) => (
            <button
              key={t.key}
              onClick={() => setTimeframe(t.key as "all_time" | "this_week")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                timeframe === t.key
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto mt-8 px-4 overflow-hidden rounded-xl bg-zinc-900/80 backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-4 text-sm font-semibold text-gray-400 border-b border-zinc-700 py-3 px-2">
          <span>#</span>
          <span>User</span>
          <span className="text-right">Total Edits</span>
          <span className="text-right">This Week</span>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-400">Loading...</div>
        ) : (
          contributors.slice(0, 10).map((user, i) => (
            <div
              key={user.id}
              className={`grid grid-cols-4 items-center px-2 py-3 border-b border-zinc-800 hover:bg-zinc-800/60 transition ${
                i < 3 ? "text-yellow-300 font-semibold" : "text-gray-200"
              }`}
            >
              <span className="text-center">{i + 1}</span>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center font-bold uppercase">
                  {user.username.charAt(0)}
                </div>
                <span>{user.username}</span>
              </div>

              <span className="text-right">
                {user.total_edits.toLocaleString("en-US")}
              </span>

              <span className="text-right text-gray-400">
                {user.weekly_edits.toLocaleString("en-US")}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-6 text-center text-gray-500 text-sm">
        <p>🏆 Updated Weekly — Based on most active TMDB contributors</p>
      </div>
    </section>
  );
}
