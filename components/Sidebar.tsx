"use client";

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
            className={`flex flex-col min-h-screen relative transition-all duration-500 ${isOpen ? 'w-64' : 'w-28'
                } bg-gradient-to-b from-[#FAEED1] to-[#B19470] p-4 shadow-lg`}
        >
            <div className="flex flex-col space-y-4">
                <Link href="/" className="flex justify-center">
                    <Image
                        src="/kopi.png"
                        alt="Kopi 82 Logo"
                        width={80}
                        height={80}
                        className="transition-all duration-500 h-[80px] w-[80px]"
                    />
                </Link>

                <div className="pt-8 mt-8 flex flex-col space-y-8">
                    {NAVBAR_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-lg flex items-center space-x-2 ${isOpen ? 'justify-start pl-4' : 'justify-center'
                                } transition-all duration-500 group relative`} // Add 'group' class for hover effect
                        >
                            {/* Icon Rendering with fixed size */}
                            {link.label === "Home" && <Home className="h-6 w-6 flex-shrink-0" />}
                            {link.label === "Menu" && <ShoppingCart className="h-6 w-6 flex-shrink-0" />}
                            {link.label === "Inventory" && <Box className="h-6 w-6 flex-shrink-0" />}
                            {link.label === "Sales" && <Wallet className="h-6 w-6 flex-shrink-0" />}

                            {/* Text Label with smooth transition and underline animation */}
                            {isOpen && (
                                <span
                                    className={`transition-opacity duration-500 ${isOpen ? 'opacity-100 delay-1000' : 'opacity-0 delay-0'
                                        } whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-black after:w-0 after:transition-all after:duration-300 hover:after:w-full`}
                                    style={{ visibility: isOpen ? 'visible' : 'hidden' }}
                                >
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
