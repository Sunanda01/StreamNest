"use client"
import { LogOut, LogOutIcon } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";

const Navbar = () => {
    const user = {};
    const router = useRouter();
    return (
        <header className="navbar">
            <nav>
                <Link href="/">
                    <Image src="/logo.png" alt="logo" height={80} width={80} />
                    <h1 className="text-4xl font-karla tracking-normal">StreamNest</h1>
                </Link>
                {user && (
                    <figure className="flex gap-8">
                        <button onClick={() => router.push('/profile/1')}>
                            <Image src="/assets/images/dummy.jpg" alt="user-profile" height={40} width={40} className="rounded-full aspect-square" />
                        </button>
                        <button>
                            <LogOut className="h-8 w-8 text-gray-100" />
                        </button>
                    </figure>
                )}
            </nav>
        </header>
    )
}

export default Navbar