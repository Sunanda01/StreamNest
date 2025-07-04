import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import {
  ArcjetDecision,
  shield,
  slidingWindow,
  validateEmail,
} from "@/lib/arcjet";
import { toNextJsHandler } from "better-auth/next-js";
import ip from "@arcjet/ip";
import { NextRequest } from "next/server";
const authHandler = toNextJsHandler(auth.handler);

//Email Validation
const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);

//Rate Limit
const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "2m",
    max: 2,
    characteristics: ["fingerprint"],
  })
);

const shieldValidation = aj.withRule(
  shield({
    mode: "LIVE",
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });
  let userId: string;
  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1";
  }
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    // const body = await req.clone().json();
    let body: any = {};
    try {
      body = await req.clone().json();
    } catch (e) {
      console.warn("Unable to parse body", e);
    }
    if (typeof body.email === "string") {
      return emailValidation.protect(req, {
        email: body.email,
      });
    }
  }
  if (!req.nextUrl.pathname.startsWith("/api/auth/sign-out")) {
    return rateLimit.protect(req, {
      fingerprint: userId,
    });
  }
  return shieldValidation.protect(req);
};

export const { GET } = authHandler;

export const POST = async (req: NextRequest) => {
  let body: any = {};
  try {
    body = await req.clone().json();
  } catch (e) {
    console.warn("Invalid JSON:", e);
    return new Response("Invalid request body", { status: 400 });
  }

  const decision = await protectedAuth(req);
  if (decision.isDenied()) {
    return new Response(decision.reason.toString(), { status: 403 });
  }

  // Debug: Check if provider is missing
  if (!body.provider) {
    console.error("Missing provider in request body");
    return new Response("Provider not specified", { status: 400 });
  }

  try {
    return await authHandler.POST(req);
  } catch (err) {
    console.error("Auth POST handler error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};


// export const POST = async (req: NextRequest) => {
//   let body: any = {};
//   try {
//     body = await req.clone().json();
//   } catch (e) {
//     console.warn("Invalid JSON:", e);
//   }

//   const decision = await protectedAuth(req);
//   if (decision.isDenied()) {
//     if (decision.reason.isEmail()) {
//       return new Response("Email validation failed", { status: 400 });
//     }
//     if (decision.reason.isRateLimit()) {
//       return new Response("Rate limit exceeded", { status: 429 });
//     }
//     if (decision.reason.isShield()) {
//       return new Response("Shield validation failed", { status: 403 });
//     }
//   }

//   try {
//     return await authHandler.POST(req);
//   } catch (err) {
//     console.error("Auth POST handler error:", err);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// };

// const session=await auth.api.getSession({
//         headers:await headers()
//     })
//     if(!session){
//         return NextResponse.redirect(new URL('/sign-in',request.url));
//     }
//     return NextResponse.next();
