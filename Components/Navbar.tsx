"use client";
import { authClient } from "@/lib/auth-client";
import { useAtomValue } from "jotai";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="navbar">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" height={80} width={80} />
          <h1 className="text-4xl font-karla tracking-normal">StreamNest</h1>
        </Link>

        <figure className="flex gap-8 items-center">
          <button onClick={() => router.push("/profile/1")}>
            <Image
              src={session?.user.image ?? "/logo.png"}
              alt="user-profile"
              height={40}
              width={40}
              className="rounded-full aspect-square"
            />
          </button>
          
          <button
            onClick={async () => {
              return await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      redirect("/sign-in");
                    },
                  },
                });
              
            }}
          >
            <LogOut className="h-8 w-8 text-gray-100" />
          </button>
        </figure>
      </nav>
    </header>
  );
};

export default Navbar;
