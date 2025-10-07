// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function CallbackPage() {
//   const params = useSearchParams();
//   const requestToken = params.get("request_token");
//   const approved = params.get("approved");
//   const [account, setAccount] = useState<any>(null);

//   useEffect(() => {
//     if (approved === "true" && requestToken) {
//       // Step 1: Create session (sets cookie)
//       fetch(`/api/auth/create-session?token=${requestToken}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success) {
//             // Step 2: Fetch account (cookie is used automatically)
//             fetch("/api/auth/login-user")
//               .then((res) => res.json())
//               .then((user) => setAccount(user));
//           }
//         });
//     }
//   }, [approved, requestToken]);

//   return (
//     <div>
//       <h1>Login Callback</h1>
//       {account ? (
//         <pre>{JSON.stringify(account, null, 2)}</pre>
//       ) : (
//         <p>Loading user info...</p>
//       )}
//     </div>
//   );
// }


"use client";

import { useUserStore } from "@/app/store/userStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {

  const params = useSearchParams();
  const router = useRouter();
  const requestToken = params.get("request_token");
  const approved = params.get("approved");
  const denied = params.get("denied");
  const setUser = useUserStore((state)=>state.setUser);

  // useEffect(() => {

  //   // If user rejected → go to landing page
  //   if (approved === "false") {
  //     router.replace("/landing");
  //     return;
  //   }
  //   if(denied === "true"){
  //     router.replace('/landing')
  //   }
  //   // If approved and token exists → create session
  //   if (approved === "true" && requestToken) {
  //     fetch(`/api/auth/create-session?token=${requestToken}`)
  //       .then((res) => res.json())
  //       .then(async (data) => {
  //         if (data.success) {
  //           // Redirect home after session created
  //           const userRes = await fetch('/api/auth/login-user');
  //           const user = await userRes.json();
  //           setUser(user);
  //           router.replace("/");
            
  //         } else {
  //           // Fallback: if session creation failed → landing
  //           router.replace("/landing");
  //         }
  //       });
  //   }
  // }, [approved, requestToken, router]);

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
    <div>
      <h1>Logging you in...</h1>
      <p>Please wait while we complete authentication.</p>
    </div>
  );
}
