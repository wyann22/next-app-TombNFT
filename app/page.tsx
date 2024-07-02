"use client";
import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";
export default function Home() {
  return (
    <div className="relative flex min-h-screen  flex-col">
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
          backgroundPosition: "-10px",
        }}
      >
        <div className="hero-content max-w-md mb-80">
          <Link
            href="/market"
            className="btn btn-outline text-white btn-small btn-wide rounded-md btn-md text-lg btn-ghost hover:bg-white hover:text-black bg-zinc-900"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </div>
  );
}
