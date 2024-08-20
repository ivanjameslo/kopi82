/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAVBAR_LINKS } from "@/lib/links";
import MobileNavbar from "./MobileNavbar";

const NavBar = () => {
  const renderNavLinks = NAVBAR_LINKS.map((link) => (
    <Link
      href={link.href}
      key={link.label}
      className="text-base hover:underline"
    >
      {link.label}
    </Link>
  ));

  return (
    <nav className="md:fixed backdrop-blur-md top-0 h-16 w-full bg-gradient-to-r from-[#FAEED1] to-[#B19470] shadow-lg transition-all z-[999]">
      <div className="px-10 flex h-16 items-center opacity-100 justify-between">
        <Link href={"/"} className="flex z-40">
          <Image src="/kopi.png" alt="Kopi 82 Logo" width={40} height={40} />
        </Link>

        <div className="h-full items-center space-x-14 text-lg hidden md:flex">
          {renderNavLinks}
        </div>

        <MobileNavbar />
      </div>
    </nav>
  );
};

export default NavBar;