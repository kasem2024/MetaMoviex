"use client";

import { useUserStore } from "@/app/store/userStore";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const requestToken = params.get("request_token");
  const approved = params.get("approved");
  const denied = params.get("denied");
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function handleCallback() {
      if (approved === "false" || denied === "true") {
        router.replace("/login");
        return;
      }

      if (approved === "true" && requestToken) {
        try {
          const res = await fetch(`/api/auth/create-session?token=${requestToken}`);
          const data = await res.json();

          if (data.success) {
            const userRes = await fetch("/api/auth/login-user");
            const user = await userRes.json();

            setUser(user);
            router.replace("/");
          } else {
            router.replace("/login");
          }
        } catch (err) {
          console.error("Error during login callback:", err);
          router.replace("/login");
        }
      }
    }

    handleCallback();
  }, [approved, denied, requestToken, router, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-black">
      <h1 className="text-2xl font-semibold">Logging you in...</h1>
      <p className="text-gray-400 mt-2">Please wait while we complete authentication.</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
          Loading authentication...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
