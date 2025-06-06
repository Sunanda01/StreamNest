"use client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <main className="sign-up">
      <aside className="testimonial">
        <Link href="/">
          <Image src="/logo.png" width={32} height={32} alt="logo" />
          <h1>StreamNest</h1>
        </Link>
        <div className="description">
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index}/>
              ))}
            </figure>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
              nam. Quaerat reprehenderit placeat doloremque suscipit et vel
              aspernatur incidunt consequatur illo dignissimos officiis, nihil
              ab quis, earum, est quos alias.
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
        <p>© SteamNest {new Date().getFullYear()}</p>
      </aside>

      <aside className="google-sign-in">
        <section>
          <Link href="/">
            <Image
              src="/assets/images/jason.png"
              alt="logo"
              width={40}
              height={40}
            />
            <h1>SteamNest</h1>
          </Link>
          <p>
            Create and Share your very first <span>SteamNest</span> in no time!
          </p>
          <button>
            <Image
              src="/assets/icons/google.svg"
              alt="google"
              width={22}
              height={22}
            />
            <span>Sign in with Google</span>
          </button>
        </section>
      </aside>
      <div className="overlay" />
    </main>
  );
};

export default SignIn;
