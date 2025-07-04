import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// }); #update

export const authClient = createAuthClient({
  baseURL: typeof window === "undefined"
    ? process.env.BETTER_AUTH_URL
    : process.env.NEXT_PUBLIC_BASE_URL,
});

