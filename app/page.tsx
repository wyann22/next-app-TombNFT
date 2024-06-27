"use client";
import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between p-4">
      {/* <Image
        src="/logo-no-background.svg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
      /> */}

      <div
        className="hero min-h-screen bg-contain"
        style={{
          backgroundImage: "url('/logo-no-background.svg')",
          backgroundPosition: "center -10em",
        }}
      >
        <div className=""></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <Link
              href="/market"
              className="btn btn-outline text-white btn-small btn-wide rounded-md btn-md text-lg btn-ghost hover:bg-white hover:text-black bg-zinc-900"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
