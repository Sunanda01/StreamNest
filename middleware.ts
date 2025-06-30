
// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import aj, { createMiddleware, detectBot, shield } from "./lib/arcjet";

// Optional: Session check
// export async function middleware(request: NextRequest) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   // Allow unauthenticated users to access sign-in page
//   if (!session && !request.nextUrl.pathname.startsWith("/sign-in")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

// Arcjet validation (optional, but you must export a default function)
const validate = aj
  .withRule(shield({ mode: "LIVE" }))
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"],
    })
  );

export default createMiddleware(validate);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)",
  ],
};
