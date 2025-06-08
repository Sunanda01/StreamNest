// pages/api/auth/get-session.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const isLoggedIn = true; // fake logic

  if (!isLoggedIn) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json({
    session: {
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        image: "/assets/images/dummy.jpg",
      },
    },
  });
}
