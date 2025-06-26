"use client";
import { authClient } from "@/lib/auth-client";
import { useAtomValue } from "jotai";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <header className="w-full px-4 py-2 bg-white shadow-md sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
        {/* Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="logo" height={50} width={50} />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-normal">
            StreamNest
          </h1>
        </Link>

        {/* Profile + Logout */}
        <figure className="flex items-center gap-3 sm:gap-6">
          <button onClick={() => router.push(`/profile/${user?.id}`)}>
            <Image
              src={session?.user.image ?? "/assets/images/dummy.jpg"}
              alt="user-profile"
              height={36}
              width={36}
              className="rounded-full aspect-square lg:h-9 lg:w-9 md:h-9 md:w-9 h-7 w-7"
              priority
            />
          </button>

          <button
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logout Successful!!!");
                    redirect("/sign-in");
                  },
                  onError: () => {
                    toast.error("Logout Failed!!!");
                  },
                },
              });
            }}
            className="p-1 rounded hover:bg-gray-200 transition"
          >
            <LogOut className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
          </button>
        </figure>
      </nav>
    </header>

  );
};

export default Navbar;
