"use client";
import { authClient } from "@/lib/auth-client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    await authClient.signIn.social({ provider: "google" })
  }
  return (
    <main className="sign-in">
      <aside className="testimonial">
        <Link href="/">
          <Image src="/assets/icons/logo.png" alt="logo" height={80} width={80} />
          <h1 className="text-4xl font-karla tracking-normal">StreamNest</h1>
        </Link>
        <div className="description">
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="text-yellow-400 fill-yellow-400" />
              ))}
            </figure>
            <p className="font-sans tracking-normal">
              StreamNest makes screen recording easy. From quick walkthroughs to full presentations, it's fast, smooth, and shareable in seconds
            </p>
            <article>
              <Image
                src="/assets/images/jason.png"
                alt="jason"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h2>Jason Rivera</h2>
                <p>Product Designer, NovaByte</p>
              </div>
            </article>
          </section>
        </div>
        <p className="font-sans tracking-normal">© StreamNest {new Date().getFullYear()}</p>
      </aside>

      <aside className="google-sign-in">
        <section>
          <Link href="/">
            <Image
              src="/assets/icons/logo.png"
              alt="logo"
              width={40}
              height={40}
            />
            <h1 className="font-sans tracking-normal">SteamNest</h1>
          </Link>
          <p className="font-sans tracking-normal">
            Create and Share your very first <span>SteamNest</span> in no time!
          </p>
          <button onClick={handleSignIn}>
            {isLoading ? <BeatLoader size={10} /> : <>
              <Image
                src="/assets/icons/google.svg"
                alt="google"
                width={22}
                height={22}
              />
              <span className="font-sans tracking-normal font-bold">
                Sign in with Google
              </span></>}

          </button>
        </section>
      </aside>
      <div className="overlay" />
    </main>
  );
};

export default SignIn;
