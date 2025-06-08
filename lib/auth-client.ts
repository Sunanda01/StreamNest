// import { createAuthClient } from "better-auth/react";
// export const authClient=createAuthClient({
//     baseURL:process.env.NEXT_PUBLIC_BEST_URL!,
// })

import { createAuthClient } from "better-auth/react";
import { atomWithQuery } from "jotai-tanstack-query";
import { Session } from "..";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BEST_URL!,
});

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const sessionAtom = atomWithQuery<{ user: User }>(() => ({
  queryKey: ["session"],
  queryFn: async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BEST_URL}/api/auth/get-session`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const json = await res.json();
    console.log("Session JSON:", json.user);

    if (!res.ok) {
      throw new Error("Failed to fetch session");
    }
    if (!json|| !json.user) {
      throw new Error("Session or user data missing");
    }

    return { user: json.user }; // ✅ extract the user properly
  },
}));
