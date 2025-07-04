import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, shield, slidingWindow, validateEmail } from "@/lib/arcjet";
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
    const body = await req.clone().json();
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
  const decision = await protectedAuth(req);
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      throw new Error("Email validation failed");
    }
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    if (decision.reason.isShield()) {
      throw new Error("Shield validation failed");
    }
  }

  return authHandler.POST(req);
};

// import { auth } from "@/lib/auth";
// import aj from "@/lib/arcjet";
// import ip from "@arcjet/ip";
// import { validateEmail, slidingWindow, shield } from "@/lib/arcjet";
// import { toNextJsHandler } from "better-auth/next-js";
// import { NextRequest } from "next/server";

// const authHandler = toNextJsHandler(auth.handler);

// // Arcjet Rules
// const emailValidation = aj.withRule(
//   validateEmail({
//     mode: "LIVE",
//     block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
//   })
// );

// const rateLimit = aj.withRule(
//   slidingWindow({
//     mode: "LIVE",
//     interval: "2m",
//     max: 3,
//     characteristics: ["fingerprint"],
//   })
// );

// const shieldValidation = aj.withRule(
//   shield({
//     mode: "LIVE",
//   })
// );

// const protectedAuth = async (req: NextRequest) => {
//   const pathname = req.nextUrl.pathname;

//   let userId: string;
//   try {
//     const session = await auth.api.getSession({ headers: req.headers });
//     userId = session?.user?.id || ip(req) || "127.0.0.1";
//   } catch {
//     userId = ip(req) || "127.0.0.1";
//   }

//   try {
//     const body = await req
//       .clone()
//       .json()
//       .catch(() => ({}));

//     // ✅ Email Sign-in protection
//     if (pathname.includes("/sign-in") && typeof body.email === "string") {
//       return emailValidation.protect(req, { email: body.email });
//     }

//     // ✅ Allow Social login
//     if (pathname.includes("/sign-in") && typeof body.provider === "string") {
//       console.log("🟢 Social login detected, skipping Arcjet validation");
//       return {
//         isDenied: () => false,
//         allow: () => true,
//         reason: {
//           isEmail: () => false,
//           isRateLimit: () => false,
//           isShield: () => false,
//           toString: () => "Allowed manually",
//         },
//       };
//     }

//     // ✅ Rate limit other sensitive routes
//     if (!pathname.includes("/sign-out")) {
//       return rateLimit.protect(req, { fingerprint: userId });
//     }
//   } catch (err) {
//     console.error("❌ Arcjet protection error:", err);
//   }

//   return shieldValidation.protect(req);
// };

// export const GET = authHandler.GET;

// export const POST = async (req: NextRequest) => {
//   try {
//     console.log("🔵 Auth POST Route hit:", req.nextUrl.pathname);

//     const decision = await protectedAuth(req);

//     if (decision.isDenied()) {
//       const reason = decision.reason.toString();
//       console.warn("🛑 Arcjet denied request:", reason);
//       return new Response(reason, { status: 403 });
//     }

//     return authHandler.POST(req);
//   } catch (err: any) {
//     console.error("❌ Unhandled auth POST error:", err);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// };
