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
    <header className="navbar">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo.png" alt="logo" height={80} width={80} />
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-karla tracking-normal">StreamNest</h1>
        </Link>

        <figure className="flex gap-6 items-center">
          <button onClick={() => router.push(`/profile/${user?.id}`)}>
            <Image
              src={session?.user.image ?? "/assets/images/dummy.jpg"}
              alt="user-profile"
              height={40}
              width={40}
              className="rounded-full aspect-square"
              priority
            />
          </button>

          <button
            onClick={async () => {
              return await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success('Logout Successful!!!');
                    redirect("/sign-in");
                  },
                  onError: () => {
                    toast.error('Logout Failed!!!');
                  }
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
