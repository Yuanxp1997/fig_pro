"use client";
import React from "react";
import LiveAvatars from "./avatar/LiveAvatars";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full flex select-none items-center justify-between gap-4 bg-primary-black px-5 py-2 text-white">
      <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20} />

      <LiveAvatars />
    </nav>
  );
};

export default Navbar;
