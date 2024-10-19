'use client'

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Home, Box, ShoppingCart, Wallet } from "lucide-react";
import { NAVBAR_LINKS } from "@/lib/links";

export default function Sidebar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={`flex flex-col min-h-screen relative transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'
                } bg-gradient-to-b from-[#FAEED1] to-[#B19470] p-4 shadow-lg`}
        >
            <div className="flex flex-col space-y-4">
                <Link href="/" className="flex justify-center">
                    <Image src="/kopi.png" alt="Kopi 82 Logo" width={40} height={40} />
                </Link>
                {NAVBAR_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={`text-lg hover:underline flex items-center space-x-2 ${isOpen ? 'justify-start' : 'justify-center'
                            }`}
                        onClick={() => setIsOpen(false)}
                    >
                        {link.label === "Home" && <Home className="h-5 w-5" />}
                        {link.label === "Menu" && <ShoppingCart className="h-5 w-5" />}
                        {link.label === "Inventory" && <Box className="h-5 w-5" />}
                        {link.label === "Sales" && <Wallet className="h-5 w-5" />}
                        {isOpen && <span>{link.label}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
}