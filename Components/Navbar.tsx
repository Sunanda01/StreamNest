"use client";
import { authClient, sessionAtom } from "@/lib/auth-client";
import { useAtomValue } from "jotai";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useAtomValue(sessionAtom);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>errorrrrr</div>;
  if (!data?.user) {
    return <div>No user data found.</div>;
  }

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
              src={data.user.image || "/default-profile.png"} // ✅ use user's image
              alt="user-profile"
              height={40}
              width={40}
              className="rounded-full aspect-square"
            />
          </button>
          <button
            onClick={async () => {
              await authClient.signOut();
              router.push("/sign-in");
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
